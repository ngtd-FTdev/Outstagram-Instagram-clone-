import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

class FFmpegService {
    constructor() {
        this.ffmpeg = new FFmpeg()
        this.loaded = false
    }

    setProgressCallback(callback) {
        this.ffmpeg.on('progress', ({ progress }) => {
            callback(`Đang xử lý: ${(progress * 100).toFixed(0)}%`)
        })
    }

    setLogCallback(callback) {
        this.ffmpeg.on('log', ({ message }) => {
            callback(message)
        })
    }

    async load() {
        if (this.loaded) return

        try {
            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm'

            await this.ffmpeg.load({
                coreURL: await toBlobURL(
                    `${baseURL}/ffmpeg-core.js`,
                    'text/javascript'
                ),
                wasmURL: await toBlobURL(
                    `${baseURL}/ffmpeg-core.wasm`,
                    'application/wasm'
                ),
            })

            this.loaded = true
            return true
        } catch (error) {
            console.error('Lỗi khi khởi tạo FFmpeg:', error)
            throw error
        }
    }

    formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        const secs = Math.floor(seconds % 60)
        const ms = Math.floor((seconds % 1) * 1000)
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`
    }

    async trimVideo(videoSrc, startTime, endTime) {
        if (!this.loaded) {
            throw new Error('FFmpeg chưa được khởi tạo')
        }

        const inputFileName = 'input.mp4'
        const outputFileName = 'output.mp4'

        const videoBlob = await fetch(videoSrc).then(r => r.blob())
        const videoFile = new File([videoBlob], inputFileName, {
            type: 'video/mp4',
        })

        await this.ffmpeg.writeFile(inputFileName, await fetchFile(videoFile))

        await this.ffmpeg.exec([
            '-i',
            inputFileName,
            '-ss',
            this.formatTime(startTime),
            '-to',
            this.formatTime(endTime),
            '-c:v',
            'libx264',
            '-c:a',
            'aac',
            '-b:a',
            '128k',
            '-movflags',
            'faststart+frag_keyframe+empty_moov',
            outputFileName,
        ])

        const data = await this.ffmpeg.readFile(outputFileName)

        const blob = new Blob([data.buffer], { type: 'video/mp4' })
        return URL.createObjectURL(blob)
    }

    async cropVideo(videoSrc, cropArea) {
        if (!this.loaded) {
            throw new Error('FFmpeg chưa được khởi tạo')
        }

        const inputFileName = 'input.mp4'
        const outputFileName = 'cropped.mp4'

        const videoBlob = await fetch(videoSrc).then(r => r.blob())
        const videoFile = new File([videoBlob], inputFileName, {
            type: 'video/mp4',
        })

        await this.ffmpeg.writeFile(inputFileName, await fetchFile(videoFile))

        const ffmpegArgs = [
            '-i',
            inputFileName,
            '-vf',
            `crop=${cropArea.width}:${cropArea.height}:${cropArea.x}:${cropArea.y}`,
            '-c:v',
            'libx264',
            '-preset',
            'fast',
            '-crf',
            '22',
            '-c:a',
            'aac',
            '-b:a',
            '128k',
            '-movflags',
            'faststart+frag_keyframe+empty_moov',
            outputFileName,
        ]

        await this.ffmpeg.exec(ffmpegArgs)

        const data = await this.ffmpeg.readFile(outputFileName)

        const blob = new Blob([data.buffer], { type: 'video/mp4' })
        return URL.createObjectURL(blob)
    }
}

const ffmpegService = new FFmpegService()
export default ffmpegService
