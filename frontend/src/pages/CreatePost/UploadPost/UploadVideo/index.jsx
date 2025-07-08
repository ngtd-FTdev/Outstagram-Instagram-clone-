import Nouislider from 'nouislider-react'
import { useState } from 'react'
import CropperImg from '../Cropper'

function UploadVideo({
    mediaType,
    videoSrc,
    videoRef,
    formatTimeDisplay,
    startTime,
    endTime,
    handleSliderChange,
    videoSnapshots,
    handleSnapshotClick,
    aspectRatios,
    setSelectedAspectRatio,
    selectedAspectRatio,
    trimVideo,
    isLoading,
    processedVideo,
    videoDuration,
    setCroppedVideo,
    cropVideo,
}) {
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const cropVideoArea = async () => {
        try {
            cropVideo(croppedAreaPixels)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <>
            {mediaType === 'video' && videoSrc && (
                <div className='w-full max-w-3xl'>
                    <div className='mb-4 rounded-lg bg-white p-4 shadow-md'>
                        <h2 className='mb-4 text-xl font-semibold'>
                            Chỉnh sửa video
                        </h2>
                        <div className='relative mb-4 h-[500px] w-[500px]'>
                            {/* <video
                                src={videoSrc}
                                ref={videoRef}
                                className='hidden w-full rounded-md'
                                controls
                            /> */}
                            <CropperImg
                                key={selectedAspectRatio.value}
                                videoURL={videoSrc}
                                cropAreaClassName=''
                                videoRef={videoRef}
                                aspect={selectedAspectRatio.value}
                                zoom={zoom}
                                setZoom={setZoom}
                                croppedAreaPixels={croppedAreaPixels}
                                setCroppedAreaPixels={setCroppedAreaPixels}
                            />
                        </div>
                        <div className='mb-4'>
                            <h3 className='mb-2 text-lg font-medium'>
                                Cắt thời gian ({formatTimeDisplay(startTime)} -{' '}
                                {formatTimeDisplay(endTime)})
                            </h3>
                            <div className='px-2 py-4'>
                                <Nouislider
                                    range={{
                                        min: 0,
                                        max:
                                            videoDuration === 0
                                                ? 100
                                                : videoDuration,
                                    }}
                                    start={[startTime, endTime]}
                                    connect
                                    step={0.1}
                                    onUpdate={handleSliderChange}
                                />
                            </div>
                            <p className='text-sm text-gray-500'>
                                Tối đa 1 phút. Hiện tại:{' '}
                                {formatTimeDisplay(endTime - startTime)}
                            </p>
                        </div>

                        {videoSnapshots.length > 0 && (
                            <div className='mb-4'>
                                <h3 className='mb-2 text-lg font-medium'>
                                Snapshots
                                </h3>
                                <div className='flex space-x-2 overflow-x-auto pb-2'>
                                    {videoSnapshots.map((thumb, index) => (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                handleSnapshotClick(
                                                    thumb.timePoint
                                                )
                                            }
                                            className='cursor-pointer overflow-hidden rounded-md border-2 border-transparent hover:border-blue-500'
                                        >
                                            <img
                                                src={thumb.src}
                                                alt={`Snapshots ${index}`}
                                                className='h-20 w-20 object-cover'
                                            />
                                            <div className='bg-gray-100 py-1 text-center text-xs'>
                                                {formatTimeDisplay(
                                                    thumb.timePoint
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className='mb-4'>
                            <h3 className='mb-2 text-lg font-medium'>
                                Tỷ lệ khung hình
                            </h3>
                            <div className='flex flex-wrap gap-2'>
                                {aspectRatios.map(ratio => (
                                    <button
                                        key={ratio.value}
                                        onClick={() =>
                                            setSelectedAspectRatio(ratio)
                                        }
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

                        <div className='flex justify-end'>
                            <button
                                onClick={cropVideoArea}
                                disabled={isLoading}
                                className='rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400'
                            >
                                {isLoading ? 'Đang xử lý...' : 'Crop video'}
                            </button>
                        </div>
                        <div className='flex justify-end'>
                            <button
                                onClick={trimVideo}
                                disabled={isLoading}
                                className='rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400'
                            >
                                {isLoading ? 'Đang xử lý...' : 'Áp dụng'}
                            </button>
                        </div>
                    </div>

                    {processedVideo && (
                        <div className='mb-4 rounded-lg bg-white p-4 shadow-md'>
                            <h2 className='mb-4 text-xl font-semibold'>
                                Video đã xử lý
                            </h2>
                            <video
                                src={processedVideo}
                                controls
                                className='w-full rounded-md'
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default UploadVideo
