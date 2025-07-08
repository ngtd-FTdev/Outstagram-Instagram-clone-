import ArrowIcon from '@/assets/icons/arrowIcon.svg?react'
import { setCroppedAreaPixels } from '@/redux/features/createPost'
import { getFilterStyle } from '@/utils/algorithms'
import { calculateCroppedAreaPixels, getCroppedImg } from '@/utils/croppedImg'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EditImage from './EditImage'

function MediaImgRender({
    handleMediaSelect,
    indexSelectedMedia,
    mediaPostsLength,
    mediaPost,
}) {
    const adjustments = useSelector(
        state =>
            state.createPost.mediaPosts[indexSelectedMedia]?.edit?.Adjustments
    ) || {
        brightness: 0,
        contrast: 0,
        fade: 0,
        saturation: 0,
        temperature: 0,
        vignette: 0,
    }

    const [croppedImages, setCroppedImages] = useState(null)

    useEffect(() => {
        const cropImg = async () => {
            try {
                const croppedImage = await getCroppedImg(
                    mediaPost.mediaUrl,
                    mediaPost.cropSettings.croppedAreaPixels
                )
                setCroppedImages([croppedImage])
            } catch (e) {
                console.error(e)
            }
        }
        cropImg()
    }, [mediaPost, indexSelectedMedia])

    return (
        <>
            <div className='relative z-0 flex h-[519px] w-[519px] flex-grow flex-col items-center justify-center bg-[--ig-secondary-background] p-6'>
                <div className='absolute inset-0 z-0 flex items-center justify-center'>
                    <img
                        src={croppedImages}
                        alt='media'
                        className='h-full w-full object-contain'
                        style={{
                            filter: getFilterStyle({
                                filter: mediaPost.edit.filter,
                                adjustments,
                            }),
                        }}
                    />
                </div>
                {indexSelectedMedia > 0 && (
                    <div className='absolute left-0 top-1/2 z-[20] -translate-y-1/2 p-2'>
                        <div
                            onClick={() => handleMediaSelect('back')}
                            className='flex cursor-pointer items-center justify-center rounded-full bg-[--black-26-08] p-2 hover:opacity-70 active:opacity-100'
                        >
                            <ArrowIcon className='h-4 w-4 -rotate-90 text-white' />
                        </div>
                    </div>
                )}
                {indexSelectedMedia < mediaPostsLength - 1 && (
                    <div className='absolute right-0 top-1/2 z-[20] -translate-y-1/2 p-2'>
                        <div
                            onClick={() => handleMediaSelect('next')}
                            className='flex cursor-pointer items-center justify-center rounded-full bg-[--black-26-08] p-2 hover:opacity-70 active:opacity-100'
                        >
                            <ArrowIcon className='h-4 w-4 rotate-90 text-white' />
                        </div>
                    </div>
                )}

                <div className='absolute bottom-[14px] right-1/2 z-[20] translate-x-1/2'>
                    <div className='m-2 flex gap-1'>
                        {mediaPostsLength > 1 &&
                            Array.from(
                                { length: mediaPostsLength },
                                (_, index) => (
                                    <button
                                        key={index}
                                        className={`h-[6px] w-[6px] rounded-full transition-all ${
                                            index === indexSelectedMedia
                                                ? 'bg-[--ig-primary-button]'
                                                : 'bg-[--grey-4]'
                                        }`}
                                    />
                                )
                            )}
                    </div>
                </div>
            </div>
            <EditImage indexSelectedMedia={indexSelectedMedia} />
        </>
    )
}

export default MediaImgRender
