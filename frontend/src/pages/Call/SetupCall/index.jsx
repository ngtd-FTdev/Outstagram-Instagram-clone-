import { useEffect, useRef, useState } from 'react'
import VideoCallOffIcon from '@/assets/icons/VideoCallOffIcon.svg?react'
import VideoCallOnIcon from '@/assets/icons/VideoCallOnIcon.svg?react'
import VoiceCallOnIcon from '@/assets/icons/VoiceCallOnIcon.svg?react'
import VoiceCallOffIcon from '@/assets/icons/VoiceCallOffIcon.svg?react'
import SpeakerIcon from '@/assets/icons/SpeakerIcon.svg?react'
import SettingCallIcon from '@/assets/icons/SettingCallIcon.svg?react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useConversationDisplayName } from '@/hooks/useConversationDisplayName'
import { Button } from '@/components/ui/button'

function SetupCall({
    chatId,
    callId,
    dataConversation,
    mediaSettings,
    setMediaSettings,
    permissions,
    permissionError,
    onRequestPermissions,
    onCreateCall,
    onJoinCall,
    isLoading,
}) {
    const { chatName, avatar } = useConversationDisplayName(dataConversation)
    const [localStream, setLocalStream] = useState(null)
    const [error, setError] = useState('')
    const videoRef = useRef(null)
    const streamRef = useRef(null)

    useEffect(() => {
        let stream = null

        const setupStream = async () => {
            try {
                if (mediaSettings.video || mediaSettings.audio) {
                    const constraints = {
                        video: mediaSettings.video
                            ? {
                                  width: { ideal: 1280 },
                                  height: { ideal: 720 },
                                  facingMode: 'user',
                              }
                            : false,
                        audio: mediaSettings.audio,
                    }

                    stream =
                        await navigator.mediaDevices.getUserMedia(constraints)
                    streamRef.current = stream
                    setLocalStream(stream)

                    if (videoRef.current && mediaSettings.video) {
                        videoRef.current.srcObject = stream
                    }
                }
            } catch (err) {
                console.error('Failed to get media stream:', err)
            }
        }

        setupStream()

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
        }
    }, [mediaSettings.video, mediaSettings.audio])

    useEffect(() => {
        if (videoRef.current && localStream && mediaSettings.video) {
            videoRef.current.srcObject = localStream
        } else if (videoRef.current && !mediaSettings.video) {
            videoRef.current.srcObject = null
        }
    }, [localStream, mediaSettings.video])

    const handleToggleVideo = async () => {
        try {
            if (!mediaSettings.video && permissions.camera === 'denied') {
                await onRequestPermissions()
                return
            }

            setMediaSettings(prev => ({ ...prev, video: !prev.video }))
        } catch (err) {
            setError('Camera permission denied')
        }
    }

    const handleToggleAudio = async () => {
        try {
            if (!mediaSettings.audio && permissions.microphone === 'denied') {
                await onRequestPermissions()
                return
            }

            setMediaSettings(prev => ({ ...prev, audio: !prev.audio }))
            setError('')
        } catch (err) {
            setError('Microphone permission denied')
        }
    }

    const handleToggleSpeaker = () => {
        setMediaSettings(prev => ({ ...prev, speaker: !prev.speaker }))
    }

    const handleStartCall = async () => {
        try {
            setError('')
    
            if (callId) {
                await onJoinCall(mediaSettings)
            } else {
                await onCreateCall()
            }
        } catch (err) {
            setError('Failed to start call')
        }
    }

    const canStartCall =
        !isLoading &&
        (permissions.camera === 'granted' ||
            permissions.microphone === 'granted')

    return (
        <div className='flex min-h-screen items-center justify-center bg-black p-4'>
            <div className='mb-8 flex gap-4'>
                <div className='relative flex h-[424px] w-[640px] flex-col items-center overflow-hidden rounded-[8px] bg-[--ig-bg-call]'>
                    <div className='flex h-[360px] w-full flex-col items-center justify-center bg-[--web-wash]'>
                        {mediaSettings.video && localStream ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className='h-full w-full scale-x-[-1] transform object-cover'
                            />
                        ) : (
                            <div className='flex flex-grow flex-col items-center justify-center'>
                                <VideoCallOffIcon className='mb-1 h-[48px] w-[48px] text-[--ig-color-call]' />
                                <span className='text-[15px] font-medium text-[--ig-color-call]'>
                                    Camera off
                                </span>
                            </div>
                        )}
                    </div>

                    <div className='flex w-full flex-grow items-center justify-center gap-6 p-4'>
                        <Button
                            onClick={handleToggleVideo}
                            variant='ghost'
                            size='icon'
                            className='flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[--ig-bg-button-call] hover:bg-[--ig-bg-button-hover-call]'
                        >
                            {mediaSettings.video ? (
                                <VideoCallOnIcon className='h-8 w-8 text-white' />
                            ) : (
                                <VideoCallOffIcon className='h-8 w-8 text-[--disabled-icon]' />
                            )}
                        </Button>

                        <Button
                            onClick={handleToggleAudio}
                            variant='ghost'
                            size='icon'
                            className='flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[--ig-bg-button-call] hover:bg-[--ig-bg-button-hover-call]'
                        >
                            {mediaSettings.audio ? (
                                <VoiceCallOnIcon className='h-6 w-6 text-white' />
                            ) : (
                                <VoiceCallOffIcon className='h-6 w-6 text-[--disabled-icon]' />
                            )}
                        </Button>

                        <Button
                            onClick={handleToggleSpeaker}
                            variant='ghost'
                            size='icon'
                            className='flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[--ig-bg-button-call] hover:bg-[--ig-bg-button-hover-call]'
                        >
                            <SpeakerIcon
                                className={`h-8 w-8 ${mediaSettings.speaker ? 'text-white' : 'text-[--disabled-icon]'}`}
                            />
                        </Button>

                        <Button
                            variant='ghost'
                            size='icon'
                            className='flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[--ig-bg-button-call] hover:bg-[--ig-bg-button-hover-call]'
                        >
                            <SettingCallIcon className='h-8 w-8 text-[--disabled-icon]' />
                        </Button>
                    </div>
                </div>

                <div className='flex h-[424px] w-[350px] flex-col items-center justify-center rounded-xl bg-[--ig-bg-call] p-6'>
                    <Avatar className='mb-4 h-20 w-20 rounded-full'>
                        <AvatarImage
                            src={avatar}
                            alt='avatar'
                            className='object-cover'
                        />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <div className='mb-1 text-center text-2xl font-bold text-white'>
                        {chatName || 'Unknown User'}
                    </div>

                    <div className='my-2 text-center text-[15px] text-white'>
                        {callId
                            ? 'Ready to join call?'
                            : 'Ready to start call?'}
                    </div>

                    <div className='mb-4 text-center text-sm text-gray-400'>
                        {permissions.camera === 'granted' &&
                        permissions.microphone === 'granted' ? (
                            <span className='text-green-400'>
                                ✓ Camera & Microphone ready
                            </span>
                        ) : permissions.camera === 'granted' ? (
                            <span className='text-yellow-400'>
                                ⚠ Microphone access needed
                            </span>
                        ) : permissions.microphone === 'granted' ? (
                            <span className='text-yellow-400'>
                                ⚠ Camera access needed
                            </span>
                        ) : (
                            <span className='text-red-400'>
                                ⚠ Camera & Microphone access needed
                            </span>
                        )}
                    </div>

                    <Button
                        onClick={handleStartCall}
                        disabled={!canStartCall || isLoading}
                        className='mt-6 h-[40px] rounded-full bg-[--primary-button-background] px-6 text-[15px] font-semibold text-white transition hover:bg-blue-600 active:bg-[--primary-button-background] disabled:opacity-50'
                    >
                        {isLoading
                            ? 'Starting...'
                            : callId
                              ? 'Join Call'
                              : 'Start Call'}
                    </Button>

                    {!canStartCall && (
                        <Button
                            onClick={onRequestPermissions}
                            variant='outline'
                            className='mt-2 h-[32px] rounded-full border-white/20 px-4 text-[13px] text-white hover:bg-white/10'
                        >
                            Grant Permissions
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SetupCall
