import { useState, useEffect } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'

const MAX_RECORDING_TIME = 60

export const useAudioRecorder = () => {
    const [recordingTime, setRecordingTime] = useState(0)
    const [audioDuration, setAudioDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [audioBlob, setAudioBlob] = useState(null)
    
    const {
        status,
        startRecording: startMediaRecording,
        stopRecording: stopMediaRecording,
        mediaBlobUrl,
        clearBlobUrl,
    } = useReactMediaRecorder({
        audio: true,
        onStop: (blobUrl, blob) => {
            setAudioBlob(blob)
        }
    })
    
    useEffect(() => {
        let interval
        
        if (status === 'recording') {
            interval = setInterval(() => {
                setRecordingTime(prev => {
                    const newTime = prev + 0.2
                    if (newTime >= MAX_RECORDING_TIME) {
                        stopMediaRecording()
                        return MAX_RECORDING_TIME
                    }
                    return newTime
                })
            }, 200)
        } else {
            clearInterval(interval)
        }
        
        return () => clearInterval(interval)
    }, [status, stopMediaRecording])
    
    useEffect(() => {
        if (mediaBlobUrl) {
            const audio = new Audio(mediaBlobUrl)
            
            const handleLoadedMetadata = () => {
                if (audio.duration && isFinite(audio.duration)) {
                    setAudioDuration(Math.floor(audio.duration))
                } else {
                    setAudioDuration(recordingTime || 1)
                }
            }
            
            const handleError = (error) => {
                console.error('Error loading audio metadata:', error)
                setAudioDuration(recordingTime || 1)
            }
            
            audio.addEventListener('loadedmetadata', handleLoadedMetadata)
            audio.addEventListener('error', handleError)
            
            const timeoutId = setTimeout(() => {
                setAudioDuration(current => {
                    if (current === 0) {
                        return recordingTime || 1
                    }
                    return current
                })
            }, 1000)
            
            return () => {
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
                audio.removeEventListener('error', handleError)
                clearTimeout(timeoutId)
            }
        }
    }, [mediaBlobUrl, recordingTime])
    
    const resetRecording = () => {
        clearBlobUrl()
        setRecordingTime(0)
        setCurrentTime(0)
        setAudioDuration(0)
        setAudioBlob(null)
    }

    const startRecording = () => {
        resetRecording()
        startMediaRecording()
    }

    const stopRecording = () => {
        stopMediaRecording()
    }

    return {
        isRecording: status === 'recording',
        recordingTime,
        audioSrc: mediaBlobUrl,
        audioDuration,
        currentTime,
        setCurrentTime,
        startRecording,
        stopRecording,
        resetRecording,
        audioBlob
    }
}