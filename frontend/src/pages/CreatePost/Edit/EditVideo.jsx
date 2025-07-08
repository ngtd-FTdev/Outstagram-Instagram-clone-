import { Switch } from '@/components/ui/switch'
import {
    setSoundOn,
    setThumbnail,
    setTrimVideo,
} from '@/redux/features/createPost'
import { getThumbnailAtTime } from '@/utils/ffmpeg/videoUtils'
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const HANDLE_WIDTH = 70

function GetThumbnailForVideo({
    time,
    mediaPost,
    duration,
    onTimeChange,
    containerRef,
    indexSelectedMedia,
}) {
    const [isDragging, setIsDragging] = useState(false)
    const handleRef = useRef(null)
    const videoRef = useRef(null)

    const dispatch = useDispatch()

    const handleMouseDown = e => {
        setIsDragging(true)
        e.preventDefault()
    }

    useEffect(() => {
        const handleMouseMove = e => {
            if (!isDragging || !containerRef?.current) return

            const containerRect = containerRef.current.getBoundingClientRect()
            const containerWidth = containerRect.width

            let newX = e.clientX - containerRect.left
            newX = Math.max(0, Math.min(newX, containerWidth - HANDLE_WIDTH))

            const newTime = (newX / (containerWidth - HANDLE_WIDTH)) * duration
            onTimeChange(newTime)
        }

        const handleMouseUp = async e => {
            if (!isDragging || !containerRef?.current) return

            const containerRect = containerRef.current.getBoundingClientRect()
            const containerWidth = containerRect.width

            let newX = e.clientX - containerRect.left
            newX = Math.max(0, Math.min(newX, containerWidth - HANDLE_WIDTH))

            const newTime = (newX / (containerWidth - HANDLE_WIDTH)) * duration
            const newThumb = await getThumbnailAtTime(
                mediaPost.mediaUrl,
                newTime
            )

            dispatch(
                setThumbnail({
                    mediaIndex: indexSelectedMedia,
                    thumbnail: newThumb,
                })
            )
            setIsDragging(false)
        }

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, duration, onTimeChange, containerRef])

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = time
        }
    }, [time])

    return (
        <div
            ref={handleRef}
            className='absolute top-0 h-[102px] w-[70px] cursor-grab select-none overflow-hidden rounded-[6px] border-[2px] border-white bg-[--ig-primary-button] shadow-xl'
            style={{
                left:
                    duration > 0 && containerRef?.current
                        ? `${(time / duration) * (containerRef.current.offsetWidth - HANDLE_WIDTH)}px`
                        : '0px',
            }}
            onMouseDown={handleMouseDown}
        >
            <video
                ref={videoRef}
                className='h-full w-full object-cover'
                src={mediaPost.mediaUrl}
            />
        </div>
    )
}

function SetTrimVideo({
    mediaPost,
    duration,
    trimContainerRef,
    indexSelectedMedia,
}) {
    const [isDragging, setIsDragging] = useState(false)
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(duration)
    const [activeHandle, setActiveHandle] = useState(null)

    const MIN_DURATION = 1

    const dispatch = useDispatch()

    useEffect(() => {
        const handleMouseMove = e => {
            if (!isDragging || !trimContainerRef?.current) return

            const containerRect =
                trimContainerRef.current.getBoundingClientRect()
            const containerWidth = containerRect.width

            let newX = e.clientX - containerRect.left
            newX = Math.max(0, Math.min(newX, containerWidth))
            const newTime = (newX / containerWidth) * duration

            if (duration <= MIN_DURATION) {
                setStart(0)
                setEnd(duration)
                return
            }

            if (activeHandle === 'start') {
                if (end - newTime >= MIN_DURATION) {
                    setStart(Math.max(0, newTime))
                }
            } else if (activeHandle === 'end') {
                if (newTime - start >= MIN_DURATION) {
                    setEnd(Math.min(duration, newTime))
                }
            }
        }

        const handleMouseUp = () => {
            setIsDragging(false)
            setActiveHandle(null)
            dispatch(
                setTrimVideo({
                    mediaIndex: indexSelectedMedia,
                    trim: { startTime: start, endTime: end },
                })
            )
        }

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, duration, start, end, activeHandle])

    useEffect(() => {
        setStart(0)
        setEnd(duration)
    }, [duration])

    const handleMouseDown = handle => e => {
        if (duration <= MIN_DURATION) return

        setIsDragging(true)
        setActiveHandle(handle)
        e.preventDefault()
    }

    const formatTime = time => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    return (
        <>
            <div
                className='absolute bottom-0 top-0 rounded-[6px] bg-black/50'
                style={{
                    left: 0,
                    width: `${(start / duration) * 100}%`,
                }}
            />

            <div
                className='absolute bottom-0 top-0 rounded-[6px] bg-black/50'
                style={{
                    right: 0,
                    width: `${((duration - end) / duration) * 100}%`,
                }}
            />

            <div
                className='group absolute bottom-0 top-0 w-1 cursor-ew-resize'
                style={{ left: `${(start / duration) * 100}%` }}
                onMouseDown={handleMouseDown('start')}
            >
                <div className='absolute left-1/2 h-full w-[10px] -translate-x-1/2 rounded-s-md bg-white'>
                    <span className='absolute left-1/2 top-1/2 h-6 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-black'></span>
                </div>
                {activeHandle === 'start' && (
                    <span className='absolute -top-[20px] left-1/2 -translate-x-1/2 select-none text-[11px] text-[--ig-primary-text]'>
                        {formatTime(start)}
                    </span>
                )}
            </div>

            <div
                className='group absolute bottom-0 top-0 w-1 cursor-ew-resize'
                style={{ left: `${(end / duration) * 100}%` }}
                onMouseDown={handleMouseDown('end')}
            >
                <div className='absolute left-1/2 h-full w-[10px] -translate-x-1/2 rounded-e-md bg-white'>
                    <span className='absolute left-1/2 top-1/2 h-6 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-black'></span>
                </div>
                {activeHandle === 'end' && (
                    <span className='absolute -top-[20px] left-1/2 -translate-x-1/2 select-none text-[11px] text-[--ig-primary-text]'>
                        {formatTime(end)}
                    </span>
                )}
            </div>
        </>
    )
}

function EditVideo({ mediaPost, indexSelectedMedia }) {
    const [thumbnailTime, setThumbnailTime] = useState(0)
    const containerRef = useRef(null)
    const trimContainerRef = useRef(null)
    const [snapshotUrls, setSnapshotUrls] = useState([])

    const sound = useSelector(
        state => state.createPost.mediaPosts[indexSelectedMedia].edit.soundOn
    )
    const dispatch = useDispatch()

    useEffect(() => {
        if (mediaPost?.edit?.snapshots) {
            const urls = mediaPost.edit.snapshots.map(snapshot =>
                URL.createObjectURL(snapshot.src)
            )
            setSnapshotUrls(urls)

            return () => {
                urls.forEach(url => URL.revokeObjectURL(url))
            }
        }
    }, [mediaPost?.edit?.snapshots])

    const handleTimeChange = async newTime => {
        setThumbnailTime(newTime)
    }

    const handleSelectThumbnail = e => {
        const maxFileSize = 20 * 1024 * 1024
        const file = e.target.files[0]

        if (!file) return

        if (file.size > maxFileSize) {
            return
        }

        const reader = new FileReader()

        reader.onloadend = () => {
            const base64 = reader.result
            dispatch(setThumbnail({ mediaIndex: indexSelectedMedia, thumbnail: base64 }))
        }

        reader.readAsDataURL(file)
    }

    const handleSetSoundOn = () => {
        dispatch(
            setSoundOn({ isSoundOn: !sound, mediaIndex: indexSelectedMedia })
        )
    }

    return (
        <div className='z-20 w-[--creation-settings-width] overflow-y-scroll border-l border-[--ig-elevated-separator]'>
            <div className='flex flex-col px-[16px]'>
                <div className='mb-3 flex flex-col'>
                    <div className='my-[14px] flex items-center justify-between'>
                        <span className='text-base font-bold text-[--ig-primary-text]'>
                            Cover photo
                        </span>
                        <label>
                            <div className='cursor-pointer select-none text-center text-sm font-semibold text-[--ig-primary-button] hover:text-[--ig-link] active:opacity-50'>
                                Select from computer
                            </div>
                            <input
                                type='file'
                                className='hidden'
                                onChange={handleSelectThumbnail}
                                accept='image/jpeg,image/png,image/heic,image/heif'
                            />
                        </label>
                    </div>
                    <div
                        ref={containerRef}
                        className='relative my-2 flex flex-nowrap'
                    >
                        <div
                            className='thumbnails-container relative flex h-[100px] flex-grow flex-nowrap overflow-hidden rounded-[6px]'
                            style={{ width: '100%' }}
                        >
                            {snapshotUrls.map((url, index) => (
                                <div
                                    key={index}
                                    className='relative h-[100px] flex-1 bg-cover bg-center bg-no-repeat'
                                    style={{
                                        backgroundImage: `url('${url}')`,
                                    }}
                                ></div>
                            ))}
                        </div>
                        <GetThumbnailForVideo
                            time={thumbnailTime}
                            duration={mediaPost?.edit?.duration || 0}
                            onTimeChange={handleTimeChange}
                            containerRef={containerRef}
                            mediaPost={mediaPost}
                            indexSelectedMedia={indexSelectedMedia}
                        />
                    </div>
                </div>
                <div className='mb-3 flex flex-col'>
                    <div className='my-4'>
                        <span className='text-base font-bold text-[--ig-primary-text]'>
                            Trim
                        </span>
                    </div>
                    <div>
                        <div ref={trimContainerRef} className='relative my-2'>
                            <div className='flex h-[64px] overflow-hidden rounded-[6px]'>
                                {snapshotUrls.map((url, index) => (
                                    <div
                                        key={index}
                                        className='relative w-1/5 bg-cover bg-center bg-no-repeat'
                                        style={{
                                            backgroundImage: `url('${url}')`,
                                        }}
                                    ></div>
                                ))}
                            </div>
                            <SetTrimVideo
                                mediaPost={mediaPost}
                                duration={mediaPost?.edit?.duration || 0}
                                trimContainerRef={trimContainerRef}
                                indexSelectedMedia={indexSelectedMedia}
                            />
                        </div>
                        <div className='relative'>
                            <div className='mt-2 w-full bg-[--ig-separator]'>
                                <div className='flex w-full justify-between'>
                                    {Array.from({ length: 9 }, (_, index) => (
                                        <div
                                            key={index}
                                            className='flex w-[18px] flex-col items-center text-[--ig-secondary-text]'
                                        >
                                            <div
                                                className={`mb-1 h-[4px] w-[4px] rounded-full ${[0, 4, 8].includes(index) ? 'bg-[--ig-secondary-text]' : 'bg-[--ig-tertiary-text]'}`}
                                            />
                                            {index === 0 && (
                                                <span className='select-none text-sm'>
                                                    0s
                                                </span>
                                            )}
                                            {index === 4 && (
                                                <span className='select-none text-sm'>
                                                    {`${Math.floor((mediaPost?.edit?.duration || 0) / 2)}s`}
                                                </span>
                                            )}
                                            {index === 8 && (
                                                <span className='select-none text-sm'>
                                                    {`${Math.floor(mediaPost?.edit?.duration || 0)}s`}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mb-8 mt-3 flex w-full justify-between'>
                    <div className='flex items-center justify-center'>
                        <span className='text-base font-normal text-[--ig-primary-text]'>
                            Sound on
                        </span>
                    </div>
                    <div className='h-[24px] w-[40px]'>
                        <Switch
                            checked={sound}
                            onCheckedChange={handleSetSoundOn}
                            className='h-full w-full data-[state=checked]:bg-[--ig-toggle-background-on-prism] data-[state=unchecked]:bg-[--ig-toggle-background-off-prism]'
                            classThumb='h-[20px] w-[20px] bg-[--ig-stroke-prism] data-[state=checked]:translate-x-[16px] data-[state=unchecked]:translate-x-[2px]'
                            id='sound-one'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditVideo
