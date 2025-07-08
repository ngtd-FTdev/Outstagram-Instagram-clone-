import ArrowIcon from '@/assets/icons/arrowIcon.svg?react'
import BackArrowIcon from '@/assets/icons/backArrowIcon.svg?react'
import MediaGalleryIcon from '@/assets/icons/MediaGalleryIcon.svg?react'
import SelectCropIcon from '@/assets/icons/SelectCropIcon.svg?react'
import PopoverCom from '@/components/PopoverCom'
import { useSelector } from 'react-redux'
import CropperRender from './Cropper'
import MediaGallery from './MediaGallery'
import SelectCrop from './SelectCrop'
import { useEffect } from 'react'

function CropPosts({
    handleMediaSelect,
    indexSelectedMedia,
    mediaPostsLength,
    handleBack,
    handleNext,
}) {
    const mediaPost = useSelector(
        state => state.createPost.mediaPosts[indexSelectedMedia]
    )

    useEffect(() => {
        if (!mediaPost) {
            handleBack()
        }
    }, [mediaPost])

    const { crop, zoom } = mediaPost?.cropSettings || {
        crop: { x: 0, y: 0 },
        zoom: 1,
    }

    return (
        <div className='flex flex-col overflow-hidden'>
            <div className='z-30 flex h-[43px] items-center justify-between border-b border-[--ig-elevated-separator] bg-[--ig-primary-background]'>
                <div
                    onClick={handleBack}
                    className='ml-2 flex cursor-pointer items-center justify-center p-2 active:opacity-50'
                >
                    <BackArrowIcon className='h-6 w-6 text-[--ig-primary-text]' />
                </div>
                <h2 className='text-center text-base font-semibold text-[--ig-primary-text]'>
                    Crop
                </h2>
                <div
                    onClick={handleNext}
                    className='mr-4 cursor-pointer select-none text-sm font-semibold text-[--ig-primary-button] hover:text-[--ig-link] active:opacity-50'
                >
                    Next
                </div>
            </div>
            <div className='relative flex h-[519px] max-h-[527px] min-h-[348px] min-w-[348px] max-w-[527px] flex-col items-center justify-center bg-[--ig-secondary-background] p-6'>
                <div className='absolute inset-0 z-0'>
                    <CropperRender
                        type={mediaPost?.type}
                        mediaUrl={mediaPost?.mediaUrl}
                        crop={crop}
                        zoom={zoom}
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
                <div className='absolute bottom-2 left-2 z-[20] m-2'>
                    <PopoverCom
                        modal={true}
                        BodyPop={() => (
                            <SelectCrop
                                mediaPost={mediaPost}
                                indexSelectedMedia={indexSelectedMedia}
                            />
                        )}
                    >
                        <div className='flex cursor-pointer items-center justify-center rounded-full bg-[--black-25] p-2 hover:opacity-70 active:opacity-100'>
                            <SelectCropIcon className='h-4 w-4 text-white' />
                        </div>
                    </PopoverCom>
                </div>
                <div className='absolute bottom-2 right-2 z-[20] m-2'>
                    <PopoverCom
                        align='end'
                        modal={true}
                        BodyPop={() => <MediaGallery />}
                    >
                        <div className='flex cursor-pointer items-center justify-center rounded-full bg-[--black-25] p-2 hover:opacity-70 active:opacity-100'>
                            <MediaGalleryIcon className='h-4 w-4 text-white' />
                        </div>
                    </PopoverCom>
                </div>
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
        </div>
    )
}

export default CropPosts
