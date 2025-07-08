import { getCroppedImg } from '@/utils/croppedImg'
import { useState } from 'react'
import CropperImg from '../Cropper'

function UploadImg({
    mediaType,
    imageList,
    currentIndex,
    setCurrentIndex,
    aspectRatios,
    changeAspectRatio,
    selectedAspectRatio,
    imageFilters,
    applyFilter,
    selectedFilter,
    cropImage,
    croppedImages,
    cropperRef,
    setCroppedImages,
}) {
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const cropImg = async () => {
        try {
            const croppedImage = await getCroppedImg(
                imageList[currentIndex]?.src,
                croppedAreaPixels,
                selectedFilter.style.filter
            )
            setCroppedImages([croppedImage])
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <>
            {mediaType === 'image' && imageList.length > 0 && (
                <div className='w-full max-w-3xl'>
                    <div className='mb-4 rounded-lg bg-white p-4 shadow-md'>
                        <div className='mb-4 flex justify-between'>
                            <h2 className='text-xl font-semibold'>
                                Chỉnh sửa ảnh ({currentIndex + 1}/
                                {imageList.length})
                            </h2>
                            <div className='flex space-x-2'>
                                {imageList.length > 1 && (
                                    <>
                                        <button
                                            onClick={() =>
                                                setCurrentIndex(prev =>
                                                    Math.max(0, prev - 1)
                                                )
                                            }
                                            disabled={currentIndex === 0}
                                            className='rounded-md bg-gray-200 px-3 py-1 disabled:opacity-50'
                                        >
                                            ←
                                        </button>
                                        <button
                                            onClick={() =>
                                                setCurrentIndex(prev =>
                                                    Math.min(
                                                        imageList.length - 1,
                                                        prev + 1
                                                    )
                                                )
                                            }
                                            disabled={
                                                currentIndex ===
                                                imageList.length - 1
                                            }
                                            className='rounded-md bg-gray-200 px-3 py-1 disabled:opacity-50'
                                        >
                                            →
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className='relative mb-4 h-[500px] w-[500px]'>
                            <CropperImg
                                key={selectedAspectRatio.value}
                                photoURL={imageList[currentIndex]?.src}
                                cropAreaClassName=''
                                aspect={selectedAspectRatio.value}
                                zoom={zoom}
                                cropperRef={cropperRef}
                                setZoom={setZoom}
                                mediaStyle={selectedFilter.style}
                                croppedAreaPixels={croppedAreaPixels}
                                setCroppedAreaPixels={setCroppedAreaPixels}
                            />
                        </div>
                        <div className='mb-4'>
                            <h3 className='mb-2 text-lg font-medium'>
                                Tỷ lệ khung hình
                            </h3>
                            <div className='flex flex-wrap gap-2'>
                                {aspectRatios.map(ratio => (
                                    <button
                                        key={ratio.value}
                                        onClick={() => changeAspectRatio(ratio)}
                                        className={`rounded-md px-3 py-1 ${
                                            selectedAspectRatio.value ===
                                            ratio.value
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 text-gray-800'
                                        }`}
                                    >
                                        {ratio.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className='mb-4'>
                            <h3 className='mb-2 text-lg font-medium'>Bộ lọc</h3>
                            <div className='grid grid-cols-3 gap-2 sm:grid-cols-6'>
                                {imageFilters.map(filter => (
                                    <div
                                        key={filter.name}
                                        onClick={() => applyFilter(filter)}
                                        className={`cursor-pointer overflow-hidden rounded-md border-2 p-1 ${
                                            selectedFilter.name === filter.name
                                                ? 'border-blue-500'
                                                : 'border-transparent'
                                        }`}
                                    >
                                        <div className='relative aspect-square overflow-hidden'>
                                            <img
                                                src={
                                                    imageList[currentIndex]?.src
                                                }
                                                alt={filter.name}
                                                className='h-full w-full object-cover'
                                                style={filter.style}
                                            />
                                            <div className='absolute inset-x-0 bottom-0 bg-black bg-opacity-50 py-1 text-center text-xs text-white'>
                                                {filter.name}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <div className='img-preview h-24 w-24 overflow-hidden border bg-gray-100'></div>
                            <button
                                onClick={cropImg}
                                className='rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
                            >
                                Áp dụng
                            </button>
                        </div>
                    </div>
                    {croppedImages.some(img => img !== null) && (
                        <div className='mb-4 rounded-lg bg-white p-4 shadow-md'>
                            <h2 className='mb-4 text-xl font-semibold'>
                                Ảnh đã xử lý
                            </h2>
                            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
                                {croppedImages.map(
                                    (img, index) =>
                                        img && (
                                            <div
                                                key={index}
                                                className='relative aspect-square overflow-hidden rounded-md'
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Cropped ${index}`}
                                                    className='h-full w-full object-cover'
                                                />
                                            </div>
                                        )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default UploadImg
