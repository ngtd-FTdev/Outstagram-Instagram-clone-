import img from '@/assets/img/screenshot2.png'
import Cropper from '@/components/Cropper'
import { useEffect, useState } from 'react'

function CropperImg({
    setCrop,
    crop,
    mediaURL,
    videoRef,
    cropperRef,
    aspect = 1,
    zoom = 1,
    setZoom = null,
    setCroppedAreaPixels = null,
    mediaStyle = '',
}) {
    const [photoURL, setPhotoURL] = useState(null)
    const [videoURL, setVideoURL] = useState(null)

    useEffect(() => {
        if (mediaURL?.type?.startsWith('video/')) {
            setPhotoURL(mediaURL.url)
        } else if (mediaURL?.type?.startsWith('image/')) {
            setVideoURL(mediaURL.url)
            setZoom = null
        }
    }, [mediaURL])

    const [rotation, setRotation] = useState(0)

    const cropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }
    return (
        <>
            <Cropper
                image={photoURL}
                video={videoURL}
                crop={crop}
                zoom={zoom}
                videoRef={videoRef}
                rotation={rotation}
                aspect={aspect}
                cropperRef={cropperRef}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropChange={setCrop}
                onCropComplete={cropComplete}
                disableAutomaticStylesInjection={true}
                style={{ mediaStyle }}
            />
        </>
    )
}

export default CropperImg
