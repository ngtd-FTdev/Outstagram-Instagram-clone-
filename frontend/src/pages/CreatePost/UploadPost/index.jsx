import { useVideoProcessor } from '@/utils/ffmpeg/useVideoProcessor'
import { formatTimeDisplay } from '@/utils/ffmpeg/videoUtils'
import Nouislider from 'nouislider-react'
import 'nouislider/distribute/nouislider.css'
import { useRef, useState } from 'react'
import CropperImg from './Cropper'
import UploadImg from './UploadImg'
import UploadVideo from './UploadVideo'

const imageFilters = [
    { name: 'Normal', class: 'filter-normal', style: {} },
    { name: 'B&W', class: 'filter-bw', style: { filter: 'grayscale(100%)' } },
    { name: 'Sepia', class: 'filter-sepia', style: { filter: 'sepia(100%)' } },
    {
        name: 'Vintage',
        class: 'filter-vintage',
        style: { filter: 'sepia(50%) brightness(90%)' },
    },
    {
        name: 'Warm',
        class: 'filter-warm',
        style: { filter: 'saturate(150%) hue-rotate(10deg)' },
    },
    {
        name: 'Cool',
        class: 'filter-cool',
        style: { filter: 'saturate(120%) hue-rotate(-10deg)' },
    },
]

const aspectRatios = [
    { name: 'Original', value: 'original' },
    { name: '1:1', value: 1 / 1 },
    { name: '4:5', value: 4 / 5 },
    { name: '16:9', value: 16 / 9 },
]

function PostUpload() {
    const [files, setFiles] = useState([])
    const [mediaType, setMediaType] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [message, setMessage] = useState('')

    const [imageList, setImageList] = useState([])
    const [selectedFilter, setSelectedFilter] = useState(imageFilters[0])
    const [croppedImages, setCroppedImages] = useState([])
    const [selectedAspectRatio, setSelectedAspectRatio] = useState(
        aspectRatios[0]
    )

    const {
        isLoading,
        message: videoMessage,
        videoSrc,
        videoDuration,
        startTime,
        endTime,
        processedVideo,
        videoSnapshots,
        croppedVideo,
        setMessage: setVideoMessage,
        setStartTime,
        setEndTime,
        processVideoFile,
        trimVideo,
        setCroppedVideo,
        cropVideo,
    } = useVideoProcessor()

    const cropperRef = useRef(null)
    const videoRef = useRef(null)

    useState(() => {
        if (videoMessage) {
            setMessage(videoMessage)
        }
    }, [videoMessage])

    const handleFileChange = e => {
        const selectedFiles = Array.from(e.target.files)
        if (selectedFiles.length === 0) return

        const firstFile = selectedFiles[0]
        const isVideo = firstFile.type.startsWith('video/')

        if (isVideo) {
            if (selectedFiles.length > 1) {
                setMessage('Chỉ được phép tải lên 1 video')
                return
            }
            processVideoFile(firstFile)
            setMediaType('video')
        } else {
            if (selectedFiles.length > 10) {
                setMessage('Chỉ được phép tải lên tối đa 10 ảnh')
                return
            }
            handleImageFiles(selectedFiles)
            setMediaType('image')
        }
        setFiles(selectedFiles)
    }

    const handleImageFiles = imageFiles => {
        const promises = imageFiles.map(file => {
            return new Promise(resolve => {
                const reader = new FileReader()
                reader.onload = e => {
                    resolve({
                        src: e.target.result,
                        originalFile: file,
                        filter: 'Normal',
                        aspectRatio: 'original',
                    })
                }
                reader.readAsDataURL(file)
            })
        })

        Promise.all(promises).then(images => {
            setImageList(images)
            setCroppedImages(Array(images.length).fill(null))
        })
    }

    const cropImage = () => {
        if (cropperRef.current) {
            const croppedUrl = cropperRef.current.getCroppedCanvas().toDataURL()
            const newCroppedImages = [...croppedImages]
            newCroppedImages[currentIndex] = croppedUrl
            setCroppedImages(newCroppedImages)
        }
    }

    const changeAspectRatio = ratio => {
        setSelectedAspectRatio(ratio)
    }

    const applyFilter = filter => {
        setSelectedFilter(filter)
    }

    const handleSliderChange = (values, handle) => {
        if (handle === 0) {
            setStartTime(parseFloat(values[0]))
            if (videoRef.current) {
                videoRef.current.currentTime = parseFloat(values[0])
            }
        } else {
            setEndTime(parseFloat(values[1]))
        }
    }

    const handleSnapshotsClick = timePoint => {
        if (videoRef.current) {
            videoRef.current.currentTime = timePoint
        }
    }

    const handleFinish = () => {
        const finalData = {
            type: mediaType,
            content:
                mediaType === 'image'
                    ? croppedImages.filter(img => img !== null)
                    : processedVideo,
            filter: selectedFilter.name,
            aspectRatio: selectedAspectRatio.value,
        }
        setMessage('Upload thành công!')
    }

    return (
        <div className='flex min-h-screen flex-col items-center bg-gray-50 p-6'>
            <h1 className='mb-6 text-3xl font-bold text-gray-800'>
                Tạo bài viết
            </h1>

            {message && (
                <div className='mb-4 w-full max-w-3xl rounded-md bg-blue-100 p-3 text-blue-800'>
                    {message}
                </div>
            )}

            {isLoading && (
                <div className='mb-4 flex w-full max-w-3xl justify-center rounded-md bg-gray-100 p-4'>
                    <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500'></div>
                </div>
            )}

            {!files.length && (
                <div className='mb-6 w-full max-w-3xl'>
                    <label className='flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50'>
                        <div className='flex flex-col items-center justify-center pb-6 pt-5'>
                            <svg
                                className='mb-4 h-12 w-12 text-gray-500'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                                ></path>
                            </svg>
                            <p className='mb-2 text-sm text-gray-500'>
                                Nhấn để tải lên ảnh hoặc video
                            </p>
                            <p className='text-xs text-gray-500'>
                                Hỗ trợ JPG, PNG, GIF cho ảnh (tối đa 10 ảnh)
                            </p>
                            <p className='text-xs text-gray-500'>
                                Hỗ trợ MP4, WEBM cho video (tối đa 1 video, 1
                                phút)
                            </p>
                        </div>
                        <input
                            type='file'
                            className='hidden'
                            onChange={handleFileChange}
                            accept='image/*,video/*'
                            multiple
                        />
                    </label>
                </div>
            )}

            <UploadImg
                mediaType={mediaType}
                imageList={imageList}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                aspectRatios={aspectRatios}
                changeAspectRatio={changeAspectRatio}
                selectedAspectRatio={selectedAspectRatio}
                imageFilters={imageFilters}
                applyFilter={applyFilter}
                selectedFilter={selectedFilter}
                cropImage={cropImage}
                croppedImages={croppedImages}
                cropperRef={cropperRef}
                setCroppedImages={setCroppedImages}
            />

            <UploadVideo
                mediaType={mediaType}
                videoSrc={videoSrc}
                videoRef={videoRef}
                formatTimeDisplay={formatTimeDisplay}
                startTime={startTime}
                endTime={endTime}
                handleSliderChange={handleSliderChange}
                videoSnapshots={videoSnapshots}
                handleSnapshotsClick={handleSnapshotsClick}
                aspectRatios={aspectRatios}
                setSelectedAspectRatio={setSelectedAspectRatio}
                selectedAspectRatio={selectedAspectRatio}
                trimVideo={trimVideo}
                isLoading={isLoading}
                processedVideo={processedVideo}
                videoDuration={videoDuration}
                setCroppedVideo={setCroppedVideo}
                cropVideo={cropVideo}
            />

            {((mediaType === 'image' &&
                croppedImages.some(img => img !== null)) ||
                (mediaType === 'video' && processedVideo)) && (
                <div className='mt-4 flex w-full max-w-3xl justify-end'>
                    <button
                        onClick={handleFinish}
                        className='rounded-md bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600'
                    >
                        Hoàn tất
                    </button>
                </div>
            )}
        </div>
    )
}

export default PostUpload
