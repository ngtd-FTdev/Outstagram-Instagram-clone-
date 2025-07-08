import EmblaCarouselPost from '@/pages/PostPage/EmblaCarouselPost'
import { useState } from 'react'
import RightPost from './RightPost'
import LoadingIcon from '@/assets/icons/loadingLargeIcon.svg?react'
import { ReplyProvider } from '@/contexts/ReplyContext'

function PostModal({ dataPost }) {
    const [isFollow, setIsFollow] = useState(false)

    if (!dataPost) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <LoadingIcon className='h-8 w-8 animate-spin text-[--ig-primary-text]' />
            </div>
        )
    }

    const handleFollow = () => {
        if (!isFollow) {
            setIsFollow(true)
        }
    }

    const handleConfirmUnfollow = () => {
        if (isFollow) {
            setIsFollow(false)
        }
    }

    return (
        <>
            <div className='flex max-h-[--max-h-model] w-full flex-grow flex-col overflow-auto rounded-[2px]'>
                <div className='flex h-full w-full flex-grow'>
                    <div className='flex items-stretch justify-center'>
                        <div className='flex max-h-[694px] min-h-[450px] max-w-[555.2px] min-w-[300px] flex-grow basis-[555.2px] flex-col items-center justify-center overflow-hidden bg-[--web-always-black]'>
                            {/* <div className='h-[694px] w-[694px]'></div> */}
                            <div className='flex flex-grow flex-col items-stretch justify-start'>
                                <EmblaCarouselPost dataStoryNotes={dataPost.media} />
                            </div>
                        </div>
                    </div>
                    <div className='flex min-w-[405px] max-w-[500px] flex-grow flex-col items-stretch overflow-hidden'>
                        <ReplyProvider>
                            <RightPost dataPost={dataPost} />
                        </ReplyProvider>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PostModal
