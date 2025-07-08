import { useState, useRef, useEffect } from 'react'
import TextInputSection from './TextInputSection'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'
import RecordingControls from './RecordingControls'
import MediaPreview from './MediaPreview'
import { useReplyMessage } from '@/contexts/ReplyMessage'
import { useSelector } from 'react-redux'

import CloseIcon from '@/assets/icons/closeIcon.svg?react'
import {
    useSendMessageMutation,
    useSendVoiceMessageMutation,
} from '@/api/slices/messageApiSlide'

const InputChat = ({ onSendAudio, onSendMedia }) => {
    const { replyMessage, clearReply } = useReplyMessage()
    const userId = useSelector(state => state.auth.user?._id)
    const [valueChat, setValueChat] = useState('')
    const [isPlaying, setIsPlaying] = useState(false)
    const [selectedMedia, setSelectedMedia] = useState([])
    const fileInputRef = useRef(null)

    const audioRef = useRef(null)
    const {
        isRecording,
        recordingTime,
        audioSrc,
        audioDuration,
        currentTime,
        setCurrentTime,
        startRecording,
        stopRecording,
        resetRecording,
        audioBlob,
    } = useAudioRecorder()

    const [sendMessage] = useSendMessageMutation()
    const [sendVoiceMessage] = useSendVoiceMessageMutation()
    const chatId = useSelector(state => state.message.chatId)

    const handlePlayPause = () => {
        if (isRecording) {
            stopRecording()
            return
        }

        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    const handleMediaSelect = event => {
        const files = Array.from(event.target.files || [])
        if (files.length > 0) {
            const newMedia = files.map(file => ({
                file,
                preview: URL.createObjectURL(file),
                type: file.type.startsWith('video/') ? 'video' : 'image',
            }))
            setSelectedMedia(prev => [...prev, ...newMedia])
        }
        event.target.value = ''
    }

    const handleRemoveMedia = index => {
        setSelectedMedia(prev => {
            const newMedia = [...prev]
            URL.revokeObjectURL(newMedia[index].preview)
            newMedia.splice(index, 1)
            return newMedia
        })
    }

    const handleSendAudio = async () => {
        try {
            if (isRecording) {
                await stopRecording()
            }

            if (!audioBlob || audioDuration <= 0) {
                console.error('No valid audio data to send')
                return
            }

            const result = await sendVoiceMessage({
                conversationId: chatId,
                audioBlob,
                duration: audioDuration,
            })

            if (result.error) {
                throw new Error('Failed to send voice message')
            }

            resetRecording()
            setIsPlaying(false)
            onSendAudio?.(audioBlob, audioDuration)
        } catch (error) {
            resetRecording()
            setIsPlaying(false)
            console.error('Error sending voice message:', error)
        }
    }

    const handleReset = () => {
        if (isRecording) {
            stopRecording()
        }
        setIsPlaying(false)
        resetRecording()
    }

    const handleSeek = time => {
        if (audioRef.current) {
            audioRef.current.currentTime = time
            setCurrentTime(time)
        }
    }

    const handleSendMessage = () => {
        if (isRecording || audioSrc) {
            handleSendAudio()
        }

        if (valueChat.trim() || selectedMedia.length > 0) {
            onSendMessage({ text: valueChat, mediaFiles: selectedMedia })
            setValueChat('')
            setSelectedMedia([])
        }
    }

    const onSendMessage = async ({ text, mediaFiles }) => {
        await sendMessage({
            dataChat: {
                text,
                files: mediaFiles.map(media => media.file),
                replyMessage: replyMessage.id ? replyMessage : null,
            },
            conversationId: chatId,
        })
        if (replyMessage.id) {
            clearReply()
        }
    }

    useEffect(() => {
        if (replyMessage.id) {
            setSelectedMedia([])
        }
    }, [replyMessage])

    useEffect(() => {
        const audioElement = audioRef.current
        if (!audioElement) return

        const handleTimeUpdate = () => {
            setCurrentTime(audioElement.currentTime)
        }

        const handleEnded = () => {
            setIsPlaying(false)
            setCurrentTime(0)
            audioElement.currentTime = 0
        }

        const handleError = () => {
            setIsPlaying(false)
            console.error('Audio playback error')
        }

        audioElement.addEventListener('timeupdate', handleTimeUpdate)
        audioElement.addEventListener('ended', handleEnded)
        audioElement.addEventListener('error', handleError)

        return () => {
            audioElement.removeEventListener('timeupdate', handleTimeUpdate)
            audioElement.removeEventListener('ended', handleEnded)
            audioElement.removeEventListener('error', handleError)
        }
    }, [audioRef.current])

    useEffect(() => {
        return () => {
            selectedMedia.forEach(media => {
                URL.revokeObjectURL(media.preview)
            })
        }
    }, [])

    return (
        <div>
            {replyMessage?.id && (
                <div className='flex justify-between border-t border-[--ig-separator] px-[15px] pb-[3px] pt-[5px]'>
                    <div className='mr-[10px] flex flex-col'>
                        <div className='my-[5px]'>
                            <span className='text-sm font-normal text-[--ig-primary-text]'>
                                Replying to{' '}
                                {replyMessage.originalSender === userId ? (
                                    'yourself'
                                ) : (
                                    <span className='font-semibold'>
                                        {replyMessage.fullname}
                                    </span>
                                )}
                            </span>
                        </div>
                        <div className='text-[13px] leading-3 text-[--ig-secondary-text]'>
                            {replyMessage.type === 'text'
                                ? replyMessage.content
                                : replyMessage.type}
                        </div>
                    </div>
                    <div onClick={clearReply} className='p-2'>
                        <CloseIcon className='h-3 w-3 text-[--ig-primary-text]' />
                    </div>
                </div>
            )}
            <div className='m-4 rounded-[22px] border-[1px] border-[--ig-elevated-separator]'>
                <input
                    type='file'
                    ref={fileInputRef}
                    className='hidden'
                    accept='image/*,video/*'
                    multiple
                    onChange={handleMediaSelect}
                    disabled={isRecording || !!audioSrc}
                />
                {selectedMedia.length > 0 &&
                    !replyMessage?.id &&
                    !isRecording &&
                    !audioSrc && (
                        <MediaPreview
                            mediaFiles={selectedMedia}
                            onClose={handleRemoveMedia}
                            onAddMore={() => fileInputRef.current?.click()}
                        />
                    )}

                <div className='flex min-h-11 flex-nowrap pl-[11px] pr-4'>
                    {audioSrc && (
                        <audio ref={audioRef} src={audioSrc} preload='auto' />
                    )}

                    {isRecording || audioSrc ? (
                        <RecordingControls
                            isRecording={isRecording}
                            isPlaying={isPlaying}
                            recordingTime={recordingTime}
                            audioDuration={audioDuration}
                            currentTime={currentTime}
                            onPlayPause={handlePlayPause}
                            onSend={handleSendAudio}
                            onCancel={handleReset}
                            onSeek={handleSeek}
                        />
                    ) : (
                        <TextInputSection
                            chatId={chatId}
                            value={valueChat}
                            onChange={setValueChat}
                            onVoiceClick={startRecording}
                            onMediaClick={() => fileInputRef.current?.click()}
                            onSend={handleSendMessage}
                            showSendButton={
                                !!(valueChat.trim() || selectedMedia.length > 0)
                            }
                            replyMessage={replyMessage}
                            disabled={isRecording || !!audioSrc}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default InputChat
