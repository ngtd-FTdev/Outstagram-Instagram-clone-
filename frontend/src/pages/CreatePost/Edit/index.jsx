import ArrowIcon from '@/assets/icons/arrowIcon.svg?react'
import BackArrowIcon from '@/assets/icons/backArrowIcon.svg?react'
import { useSelector } from 'react-redux'
import EditImage from './EditImage'
import { getFilterStyle } from '@/utils/algorithms'
import { useEffect, useState } from 'react'
import { getCroppedImg } from '@/utils/croppedImg'
import MediaImgRender from './MediaImgRender'
import MediaVideoRender from './MediaVideoRender'

function EditPost({
    handleMediaSelect,
    indexSelectedMedia,
    mediaPostsLength,
    handleBack,
    handleNext,
}) {

    const mediaPost = useSelector(
        state => state.createPost.mediaPosts[indexSelectedMedia]
    )

    return (
        <div className='flex h-full flex-col overflow-hidden'>
            <div className='z-30 flex h-[43px] items-center justify-between border-b border-[--ig-elevated-separator] bg-[--ig-primary-background]'>
                <div
                    onClick={handleBack}
                    className='ml-2 flex cursor-pointer items-center justify-center p-2 active:opacity-50'
                >
                    <BackArrowIcon className='h-6 w-6 text-[--ig-primary-text]' />
                </div>
                <h2 className='text-center text-base font-semibold text-[--ig-primary-text]'>
                    Edit
                </h2>
                <div
                    onClick={handleNext}
                    className='mr-4 cursor-pointer select-none text-sm font-semibold text-[--ig-primary-button] hover:text-[--ig-link] active:opacity-50'
                >
                    Next
                </div>
            </div>
            <div className='flex flex-grow overflow-hidden'>
                {mediaPost?.type === 'image' ? (
                    <MediaImgRender
                        handleMediaSelect={handleMediaSelect}
                        indexSelectedMedia={indexSelectedMedia}
                        mediaPostsLength={mediaPostsLength}
                        mediaPost={mediaPost}
                    />
                ) : (
                    mediaPost && <MediaVideoRender
                        handleMediaSelect={handleMediaSelect}
                        indexSelectedMedia={indexSelectedMedia}
                        mediaPostsLength={mediaPostsLength}
                        mediaPost={mediaPost}
                    />
                )}
            </div>
        </div>
    )
}

export default EditPost
