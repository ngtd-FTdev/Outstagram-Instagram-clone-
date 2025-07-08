import Cropper from '@/components/Cropper'
import {
    setCropMedias,
    setCroppedAreaPixels,
    setZoomMedias,
} from '@/redux/features/createPost'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function CropperRender({ type, crop, mediaUrl, zoom = 1, mediaStyle = '' }) {
    const [photoURL, setPhotoURL] = useState(null)
    const [videoURL, setVideoURL] = useState(null)
    const videoRef = useRef(null)
    const cropperRef = useRef(null)

    const dispatch = useDispatch()

    const aspectRatio = useSelector(state => state.createPost.aspectRatio)
    const mediaIndex = useSelector(state => state.createPost.indexSelectedMedia)

    const cropComplete = (croppedArea, croppedAreaPixels) => {
        dispatch(setCroppedAreaPixels({ croppedAreaPixels, mediaIndex }))
    }

    const setZoom = zoom => {
        dispatch(setZoomMedias({ zoom, mediaIndex }))
    }

    const setCrop = crop => {
        dispatch(setCropMedias({ crop, mediaIndex }))
    }

    useEffect(() => {
        if (!mediaUrl) return

        if (type === 'video') {
            setVideoURL(mediaUrl)
        } else if (type === 'image') {
            setPhotoURL(mediaUrl)
        }
    }, [mediaUrl, type])

    if (!type || !mediaUrl) {
        return (
            <div className='flex h-full w-full items-center justify-center text-[--ig-secondary-text]'>
                Loading media...
            </div>
        )
    }

    if (type === 'video') {
        return (
            <Cropper
                video={videoURL}
                crop={crop}
                zoom={zoom}
                videoRef={videoRef}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onCropComplete={cropComplete}
                disableAutomaticStylesInjection={true}
                style={{ mediaStyle }}
            />
        )
    }

    return (
        <Cropper
            image={photoURL}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            cropperRef={cropperRef}
            onZoomChange={setZoom}
            onCropChange={setCrop}
            onCropComplete={cropComplete}
            disableAutomaticStylesInjection={true}
            style={{ mediaStyle }}
        />
    )
}

export default CropperRender
