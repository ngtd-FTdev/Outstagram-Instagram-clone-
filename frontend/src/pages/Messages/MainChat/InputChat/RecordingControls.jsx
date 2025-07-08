import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import IsPlayIcon from '@/assets/icons/IsPlayIcon.svg?react'
import PlayIcon from '@/assets/icons/PlayIcon.svg?react'
import PlusCLIcon from '@/assets/icons/plusCLIcon.svg?react'
import RecordingIcon from '@/assets/icons/recordingIcon.svg?react'

const RecordingControls = ({
    isRecording,
    isPlaying,
    recordingTime,
    audioDuration,
    currentTime,
    onPlayPause,
    onSend,
    onCancel,
    onSeek,
}) => {
    const [timeStartAudio, setTimeStartAudio] = useState(0)
    const pointerTimeRef = useRef()

    const handleSetTimeStartAudio = e => {
        if (!audioDuration || isRecording) return

        const progressBar = pointerTimeRef.current
        const rect = progressBar.getBoundingClientRect()
        const clickPosition = e.clientX - rect.left
        const progressBarWidth = rect.width
        const seekTime = (clickPosition / progressBarWidth) * audioDuration

        onSeek?.(seekTime)
    }

    const formatTime = seconds => {
        if (!seconds || isNaN(seconds) || !isFinite(seconds)) {
            return '0:00'
        }

        seconds = Math.max(0, Math.round(seconds))
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    }

    const progressPercentage = isRecording
        ? 0
        : audioDuration && isFinite(audioDuration) && audioDuration > 0
          ? Math.min(100, (currentTime / audioDuration) * 100)
          : 0

    return (
        <div className='flex flex-grow items-center'>
            <button
                onClick={onCancel}
                className='flex items-center justify-center p-2 active:opacity-50'
                aria-label='Cancel recording'
            >
                <PlusCLIcon className='h-5 w-5 rotate-45 fill-[--ig-primary-text]' />
            </button>

            <div className='ml-1 mr-2 flex flex-grow'>
                <div className='relative flex h-[36px] flex-grow items-center justify-between rounded-[18px] bg-[--chat-composer-button-color]'>
                    <div
                        ref={pointerTimeRef}
                        onClick={isRecording ? null : handleSetTimeStartAudio}
                        onMouseDown={
                            isRecording ? null : handleSetTimeStartAudio
                        }
                        className='absolute inset-0 z-0 overflow-hidden rounded-full'
                    >
                        {isRecording ? (
                            <div
                                className='absolute bottom-0 left-0 top-0 h-full bg-white opacity-20'
                                style={{
                                    width: `${(recordingTime / 60) * 100}%`,
                                }}
                            ></div>
                        ) : (
                            <div
                                className='absolute inset-0 h-full bg-white opacity-20'
                                style={{
                                    width: `${progressPercentage}%`,
                                }}
                            ></div>
                        )}
                    </div>

                    <button
                        onClick={onPlayPause}
                        className='z-20 mx-[6px] fill-[--chat-composer-button-color] flex h-6 w-6 items-center justify-center rounded-full bg-white text-white'
                        aria-label={
                            isRecording
                                ? 'Stop recording'
                                : isPlaying
                                  ? 'Pause playback'
                                  : 'Play recording'
                        }
                    >
                        {isRecording ? (
                            <RecordingIcon className='h-6 w-6' />
                        ) : isPlaying ? (
                            <IsPlayIcon className='h-6 w-6' />
                        ) : (
                            <PlayIcon className='h-6 w-6' />
                        )}
                    </button>

                    <div className='z-20 mx-[6px] flex h-[23px] select-none items-center justify-center rounded-[12px] bg-white px-2 text-[.8125rem] font-medium text-[--chat-composer-button-color]'>
                        {isRecording
                            ? formatTime(recordingTime)
                            : formatTime(audioDuration - currentTime)}
                    </div>
                </div>
            </div>

            <button
                onClick={onSend}
                className='mr-[2px] select-none rounded-md text-sm font-semibold text-[--ig-primary-button] hover:text-[--ig-link] active:opacity-50'
                aria-label='Send voice message'
            >
                Send
            </button>
        </div>
    )
}

export default RecordingControls
