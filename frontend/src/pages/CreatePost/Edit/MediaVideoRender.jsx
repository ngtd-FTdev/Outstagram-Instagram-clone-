import ArrowIcon from '@/assets/icons/arrowIcon.svg?react'
import EditVideo from './EditVideo'
import { useVideoProcessor } from '@/utils/ffmpeg/useVideoProcessor'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import RenderVideoCreatePost from '@/components/RenderVideoCreatePost'

function MediaVideoRender({
    handleMediaSelect,
    indexSelectedMedia,
    mediaPostsLength,
    mediaPost,
}) {
    const { cropSettings } = mediaPost
    const { croppedAreaPixels } = cropSettings

    const {
        isLoading,
        message: videoMessage,
        videoSrc,
        videoDuration,
        startTime,
        endTime,
        processedVideo,
        videoSnapshots,
        setMessage: setVideoMessage,
        setStartTime,
        setEndTime,
        processVideoFile,
    } = useVideoProcessor()

    return (
        <div className='flex w-full'>
            <div className='relative z-0 flex h-[519px] w-[519px] flex-grow flex-col items-center justify-center overflow-hidden bg-[--ig-secondary-background]'>
                <div className='absolute inset-0 z-0 flex items-center justify-center'>
                    <div className='relative flex h-[519px] w-[519px] items-center justify-center overflow-hidden'>
                        <RenderVideoCreatePost
                            croppedAreaPixels={croppedAreaPixels}
                            mediaPost={mediaPost}
                        />
                    </div>
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
                        {mediaPostsLength > 1 && Array.from(
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
            <EditVideo
                mediaPost={mediaPost}
                indexSelectedMedia={indexSelectedMedia}
            />
        </div>
    )
}

export default MediaVideoRender
