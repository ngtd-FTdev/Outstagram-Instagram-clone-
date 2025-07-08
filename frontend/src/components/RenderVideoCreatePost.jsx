import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

function RenderVideoCreatePost({ croppedAreaPixels, mediaPost }) {
    const videoRef = useRef(null)
    const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 })

    const indexSelectedMedia = useSelector(
        state => state.createPost.indexSelectedMedia
    )

    const { startTime, endTime } = useSelector(
        state => state.createPost.mediaPosts[indexSelectedMedia].edit.Trim
    )

    useEffect(() => {
        const vid = videoRef.current
        if (!vid) return
        const onLoaded = () => {
            setNaturalSize({ w: vid.videoWidth, h: vid.videoHeight })
        }
        vid.addEventListener('loadedmetadata', onLoaded)
        return () => vid.removeEventListener('loadedmetadata', onLoaded)
    }, [])

    useEffect(() => {
        const vid = videoRef.current
        if (!vid) return

        const handleTimeUpdate = () => {
            if (vid.currentTime >= endTime) {
                vid.currentTime = startTime
            }
        }

        vid.currentTime = startTime
        vid.addEventListener('timeupdate', handleTimeUpdate)

        return () => {
            vid.removeEventListener('timeupdate', handleTimeUpdate)
        }
    }, [startTime, endTime])

    const CONTAINER = 519

    const { width: cw, height: ch, x: cx, y: cy } = croppedAreaPixels

    const scale = CONTAINER / cw

    const videoW = naturalSize.w * scale
    const videoH = naturalSize.h * scale

    const tx = -cx * scale
    const ty = -cy * scale

    return (
        <div
            style={{
                width: `${CONTAINER}px`,
                height: `${CONTAINER}px`,
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <div
                style={{
                    width: `${videoW}px`,
                    height: `${videoH}px`,
                    transform: `translate(${tx}px, ${ty}px)`,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}
            >
                <video
                    ref={videoRef}
                    src={mediaPost.mediaUrl}
                    style={{ width: '100%', height: '100%' }}
                    muted
                    autoPlay
                    loop
                />
            </div>
        </div>
    )
}

export default RenderVideoCreatePost
