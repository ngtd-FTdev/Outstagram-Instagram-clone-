import { useEffect, useState } from 'react'
import ffmpegService from './ffmpegService'
import { generateVideoSnapshots, getVideoMetadata } from './videoUtils'

export const useVideoProcessor = () => {
    const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')

    const [videoSrc, setVideoSrc] = useState('')
    const [videoDuration, setVideoDuration] = useState(0)
    const [startTime, setStartTime] = useState(0)
    const [endTime, setEndTime] = useState(0)
    const [processedVideo, setProcessedVideo] = useState('')
    const [videoSnapshots, setVideoSnapshots] = useState([])
    const [croppedVideo, setCroppedVideo] = useState('')
    const [videoMetadata, setVideoMetadata] = useState(null)

    useEffect(() => {
        const initializeFFmpeg = async () => {
            setIsLoading(true)
            setMessage('Đang khởi tạo FFmpeg...')

            try {
                ffmpegService.setProgressCallback(setMessage)
                ffmpegService.setLogCallback(message =>
                    console.log('FFmpeg log:', message)
                )

                await ffmpegService.load()

                setIsFFmpegLoaded(true)
                setMessage('FFmpeg đã sẵn sàng')
            } catch (error) {
                setMessage(`Lỗi khởi tạo FFmpeg: ${error.message}`)
                console.error('FFmpeg initialization error:', error)
            } finally {
                setIsLoading(false)
            }
        }

        initializeFFmpeg()
    }, [])

    useEffect(() => {
        return () => {
            if (processedVideo) URL.revokeObjectURL(processedVideo)
            if (croppedVideo) URL.revokeObjectURL(croppedVideo)
            if (videoSrc) URL.revokeObjectURL(videoSrc)
        }
    }, [processedVideo, croppedVideo, videoSrc])

    const processVideoFile = async videoFile => {
        if (!videoFile) return

        try {
            setIsLoading(true)
            setMessage('Đang xử lý video...')

            const videoUrl = URL.createObjectURL(videoFile)
            setVideoSrc(videoUrl)

            const metadata = await getVideoMetadata(videoFile)
            setVideoDuration(metadata.duration)
            setEndTime(metadata.duration)
            setVideoMetadata(metadata)

            setMessage('Đang tạo snapshots...')
            const snapshots = await generateVideoSnapshots(
                videoUrl,
                metadata.duration
            )
            setVideoSnapshots(snapshots)

            setMessage('Video đã sẵn sàng để xử lý')
        } catch (error) {
            setMessage(`Lỗi khi xử lý video: ${error.message}`)
            console.error('Video processing error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const trimVideo = async () => {
        if (!videoSrc || !isFFmpegLoaded) {
            setMessage('FFmpeg chưa được khởi tạo hoặc không có video')
            return
        }

        try {
            setIsLoading(true)
            setMessage('Đang cắt video...')

            const processedVideoUrl = await ffmpegService.trimVideo(
                videoSrc,
                startTime,
                endTime
            )
            setProcessedVideo(processedVideoUrl)

            setMessage('Xử lý video thành công')
        } catch (error) {
            setMessage(`Lỗi khi cắt video: ${error.message}`)
            console.error('Video trimming error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const cropVideo = async croppedAreaPixels => {
        if (!videoSrc || !isFFmpegLoaded) {
            setMessage('FFmpeg chưa được khởi tạo hoặc không có video')
            return
        }

        try {
            setIsLoading(true)
            setMessage('Đang crop video...')

            const croppedVideoUrl = await ffmpegService.cropVideo(
                videoSrc,
                croppedAreaPixels
            )

            setCroppedVideo(croppedVideoUrl)
            setProcessedVideo(croppedVideoUrl)

            setMessage('Crop video thành công')
            return croppedVideoUrl
        } catch (error) {
            setMessage(`Lỗi khi crop video: ${error.message}`)
            console.error('Video cropping error:', error)
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const downloadVideo = (filename = 'cropped-video.mp4') => {
        if (!croppedVideo) {
            setMessage('Không có video để tải xuống')
            return
        }

        const a = document.createElement('a')
        a.href = croppedVideo
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return {
        isFFmpegLoaded,
        isLoading,
        message,
        videoSrc,
        videoDuration,
        startTime,
        endTime,
        processedVideo,
        videoSnapshots,
        croppedVideo,
        videoMetadata,

        setMessage,
        setStartTime,
        setEndTime,
        processVideoFile,
        trimVideo,
        cropVideo,
        setCroppedVideo,
        downloadVideo,
        setVideoSrc,
    }
}
