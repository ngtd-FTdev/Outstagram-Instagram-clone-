import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import IsPlayIcon from '@/assets/icons/IsPlayIcon.svg?react'
import PlayIcon from '@/assets/icons/PlayIcon.svg?react'

const VoiceMessage = ({ audioUrl = '', isCurrentUser }) => {
    const waveformRef = useRef(null)
    const wavesurferRef = useRef(null)
    const durationRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    useEffect(() => {
        if (!waveformRef.current || !audioUrl) return

        const controller = new AbortController()
        let wavesurfer = null

        const initWaveSurfer = async () => {
            try {
                if (wavesurferRef.current) {
                    wavesurferRef.current.destroy()
                }

                wavesurfer = WaveSurfer.create({
                    container: waveformRef.current,
                    waveColor: '#ffffff',
                    progressColor: isCurrentUser ? '#90cdf4' : '#b2b2b2',
                    cursorColor: 'transparent',
                    barWidth: 3,
                    barRadius: 2,
                    barGap: 2,
                    height: 50,
                    responsive: true,
                    normalize: true,
                })

                wavesurferRef.current = wavesurfer

                await wavesurfer.load(audioUrl, null, controller.signal)

                wavesurfer.on('ready', () => {
                    const totalDuration = wavesurfer.getDuration()
                    setDuration(totalDuration)
                    const minutes = Math.floor(totalDuration / 60)
                    const seconds = Math.floor(totalDuration % 60)
                    if (durationRef.current) {
                        durationRef.current.innerText = `${minutes}:${seconds
                            .toString()
                            .padStart(2, '0')}`
                    }
                })

                wavesurfer.on('play', () => setIsPlaying(true))
                wavesurfer.on('pause', () => setIsPlaying(false))
                wavesurfer.on('finish', () => {
                    setIsPlaying(false)
                    setCurrentTime(0)
                })
                wavesurfer.on('audioprocess', () => {
                    setCurrentTime(wavesurfer.getCurrentTime())
                })
                wavesurfer.on('error', err => {
                    console.error('Wavesurfer error:', err)
                })
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error initializing WaveSurfer:', error)
                }
            }
        }

        initWaveSurfer()

        return () => {
            controller.abort()
            if (wavesurferRef.current) {
                wavesurferRef.current.destroy()
                wavesurferRef.current = null
            }
        }
    }, [audioUrl, isCurrentUser])

    const formatTime = time => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const togglePlay = () => {
        wavesurferRef.current?.playPause()
    }

    return (
        <div
            className={`flex max-w-[320px] items-center rounded-full px-4 py-2 shadow-md ${isCurrentUser ? 'order-2 bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-[--ig-highlight-background]'}`}
            style={{ minHeight: 50 }}
        >
            <button
                onClick={togglePlay}
                className={`mr-3 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-white shadow ${isCurrentUser ? 'fill-[--chat-composer-button-color]' : ''}`}
            >
                {isPlaying ? (
                    <IsPlayIcon className='h-[24px] w-[24px]' />
                ) : (
                    <PlayIcon className='h-[24px] w-[24px]' />
                )}
            </button>
            <div
                ref={waveformRef}
                className='flex h-8 flex-grow flex-col justify-center overflow-hidden'
                style={{ minWidth: 120 }}
            />
            <div
                ref={durationRef}
                className={`ml-3 h-[23px] w-[41px] rounded-[12px] bg-white text-center text-sm font-medium ${isCurrentUser ? 'text-[--chat-composer-button-color]' : 'text-black'}`}
            >
                {isPlaying
                    ? formatTime(duration - currentTime)
                    : formatTime(duration)}
            </div>
        </div>
    )
}

export default VoiceMessage
