export const createImage = url =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', error => reject(error))
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = url
    })

export const getCroppedImg = async (imageSrc, pixelCrop, filterStyle = '') => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return null
    }

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    ctx.filter = filterStyle

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    )

    return new Promise((resolve, reject) => {
        canvas.toBlob(file => {
            if (file) {
                resolve(URL.createObjectURL(file))
            } else {
                reject(new Error('Canvas is empty'))
            }
        }, 'image/jpeg')
    })
}

export const calculateCroppedAreaPixels = ({ width, height, aspectRatio }) => {
    let cropWidth, cropHeight

    if (width / height > aspectRatio) {
        cropHeight = height
        cropWidth = height * aspectRatio
    } else {
        cropWidth = width
        cropHeight = width / aspectRatio
    }

    const cropX = (width - cropWidth) / 2
    const cropY = (height - cropHeight) / 2

    return {
        x: Math.round(cropX),
        y: Math.round(cropY),
        width: Math.round(cropWidth),
        height: Math.round(cropHeight),
    }
}
