import { setMediaPosts } from '@/redux/features/createPost'
import { calculateCroppedAreaPixels } from '@/utils/croppedImg'
import {
    generateVideoSnapshots,
    getVideoMetadata,
} from '@/utils/ffmpeg/videoUtils'
import { useSelector } from 'react-redux'

const useMediaFileHandler = ({
    setError,
    dispatch,
    handleNext,
    lengthMedia,
}) => {
    const aspectRatio = useSelector(state => state.createPost.aspectRatio)

    const handleFiles = async files => {
        setError('')

        if (files.length === 0) return

        const totalMediaAfterAdding = lengthMedia + files.length
        if (totalMediaAfterAdding > 10) {
            const remainingSlots = 10 - lengthMedia
            if (remainingSlots <= 0) {
                setError('Maximum 10 media allowed')
                return
            }
            files = Array.from(files).slice(0, remainingSlots)
        }

        const VALID_TYPES = {
            image: ['image/jpeg', 'image/png', 'image/gif'],
            video: ['video/mp4', 'video/webm'],
        }
        const maxFileSize = 20 * 1024 * 1024

        const validFiles = []

        for (let file of files) {
            if (file.size > maxFileSize) {
                setError('Each file must be less than 10MB')
                continue
            }

            if (VALID_TYPES.video.includes(file.type)) {
                const videoUrl = URL.createObjectURL(file)
                const metadata = await getVideoMetadata(file)
                const snapshots = await generateVideoSnapshots(
                    videoUrl,
                    metadata.duration
                )

                const croppedAreaPixels = calculateCroppedAreaPixels({
                    width: metadata.width,
                    height: metadata.height,
                    aspectRatio,
                })

                const videoData = {
                    type: 'video',
                    file: file,
                    mediaUrl: videoUrl,
                    cropSettings: {
                        crop: { x: 0, y: 0 },
                        zoom: 1,
                        croppedAreaPixels: croppedAreaPixels,
                    },
                    edit: {
                        startTime: 0,
                        endTime: metadata.duration,
                        duration: metadata.duration,
                        metadata: metadata,
                        snapshots: snapshots,
                        Trim: {
                            startTime: 0,
                            endTime: 30,
                        },
                        soundOn: true,
                    },
                    thumbnail: '',
                }
                validFiles.push(videoData)
            } else if (VALID_TYPES.image.includes(file.type)) {
                const imgUrl = URL.createObjectURL(file)
                const img = new Image()
                img.src = imgUrl
                await new Promise(resolve => {
                    img.onload = () => {
                        const croppedAreaPixels = calculateCroppedAreaPixels({
                            width: img.naturalWidth,
                            height: img.naturalHeight,
                            aspectRatio,
                        })

                        validFiles.push({
                            type: 'image',
                            file: file,
                            mediaUrl: imgUrl,
                            cropSettings: {
                                crop: { x: 0, y: 0 },
                                zoom: 1,
                                croppedAreaPixels: croppedAreaPixels,
                            },
                            edit: {
                                filter: {
                                    name: 'Normal',
                                    style: { filter: 'none' },
                                },
                                adjustments: {
                                    brightness: 0,
                                    contrast: 0,
                                    fade: 0,
                                    saturation: 0,
                                    temperature: 0,
                                    vignette: 0,
                                },
                            },
                        })
                        resolve()
                    }
                })
            } else {
                setError(
                    'Only JPG, PNG, GIF images and video files are allowed'
                )
                return
            }
        }

        dispatch(setMediaPosts(validFiles))
        if (handleNext) {
            handleNext()
        }
    }

    return { handleFiles }
}
export default useMediaFileHandler
