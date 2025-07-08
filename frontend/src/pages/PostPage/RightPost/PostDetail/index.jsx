import CircleIcon from '@/assets/icons/circleIcon.svg?react'
import VerifiedIcon from '@/assets/icons/verifiedIcon.svg?react'
import HoverCardProfile from '@/components/HoverCardProfile'
import TimeAgo from '@/components/TimeAgo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from 'react-router-dom'
import PostComments from './PostComments'
import RenderFormattedText from '@/components/RenderFormattedText'

function PostDetail({
    isFollow,
    handleConfirmUnfollow,
    handleFollow,
    scrollBar,
    dataPost,
}) {
    return (
        <div className='relative order-1 flex h-full flex-shrink flex-grow flex-col overflow-y-auto overflow-x-hidden px-4'>
            <div
                className={`${scrollBar ? '' : 'scroll-bar-0'} absolute inset-0 flex-grow overflow-y-scroll p-4`}
            >
                <div className='pb-4 pr-[14px]'>
                    <div className='flex items-start'>
                        <div className='mr-[18px] cursor-pointer select-none'>
                            <HoverCardProfile
                                isFollow={isFollow}
                                handleConfirmUnfollow={handleConfirmUnfollow}
                                handleFollow={handleFollow}
                                dataUser={dataPost?.author}
                            >
                                <div className='relative cursor-pointer'>
                                    <span className='absolute left-[50%] top-[50%] h-[42] w-[42px] translate-x-[-50%] translate-y-[-50%] select-none'>
                                        <CircleIcon className='font-extralight' />
                                    </span>
                                    <Avatar className='h-8 w-8'>
                                        <AvatarImage
                                            src={dataPost?.author?.avatar}
                                            alt='@shadcn'
                                        />
                                        <AvatarFallback>
                                            {dataPost?.author?.username}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </HoverCardProfile>
                        </div>
                        <div className='inline-block'>
                            <h2 className='inline-flex items-center text-[13px] font-semibold text-[--ig-primary-text]'>
                                <div className='mr-1 flex flex-col justify-start'>
                                    <HoverCardProfile
                                        isFollow={isFollow}
                                        handleConfirmUnfollow={
                                            handleConfirmUnfollow
                                        }
                                        handleFollow={handleFollow}
                                        dataUser={dataPost?.author}
                                    >
                                        <Link className='select-none text-center text-sm font-semibold leading-[18px] text-[--ig-secondary-button] hover:opacity-50'>
                                            {dataPost?.author?.username}
                                        </Link>
                                    </HoverCardProfile>
                                </div>
                                {dataPost?.author?.is_verified && (
                                    <div className='mr-1 mt-[1px] select-none'>
                                        <VerifiedIcon className='h-3 w-3' />
                                    </div>
                                )}
                            </h2>
                            <div className='inline'>
                                <h1 className='inline text-sm font-normal leading-[18px] text-[--ig-primary-text]'>
                                    <RenderFormattedText
                                        text={dataPost?.caption}
                                    />
                                </h1>
                            </div>
                            <div className='mb-1 mt-2 flex justify-start'>
                                <span className='block text-xs leading-4 text-[--ig-secondary-text]'>
                                    Edited &nbsp;·&nbsp;
                                    {dataPost?.updatedAt && (
                                        <TimeAgo
                                            date={dataPost?.updatedAt}
                                            className='mr-3 inline cursor-default text-xs font-normal text-[--ig-secondary-text]'
                                        />
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <PostComments postId={dataPost?._id} dataPost={dataPost} />
                <div></div>
            </div>
        </div>
    )
}

export default PostDetail
