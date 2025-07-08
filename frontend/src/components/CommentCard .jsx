import CircleIcon from '@/assets/icons/circleIcon.svg?react'
import HeartIcon from '@/assets/icons/heartIcon.svg?react'
import HeartIconSolid from '@/assets/icons/heartIconSolid.svg?react'
import MoreOptionsIcon from '@/assets/icons/moreOptionsIcon.svg?react'
import VerifiedIcon from '@/assets/icons/verifiedIcon.svg?react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import HoverCardProfile from './HoverCardProfile'
import Modal from './modal'
import TimeAgo from './TimeAgo'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import RenderFormattedText from './RenderFormattedText'
import { useLikeCommentMutation } from '@/api/slices/postApiSlice'

function CommentCard({
    isFollow,
    handleConfirmUnfollow,
    handleFollow,
    commentData,
    onReply,
}) {
    const [isLiked, setIsLiked] = useState(commentData?.isLiked || false)
    const [likesCount, setLikesCount] = useState(commentData?.likes || 0)
    const [likeComment] = useLikeCommentMutation()

    const handleLike = async (e) => {
        e.stopPropagation()
        try {
            await likeComment(commentData._id).unwrap()
            setIsLiked(!isLiked)
            setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
        } catch (error) {
            console.error('Failed to like comment:', error)
        }
    }

    const handleReply = e => {
        e.stopPropagation()
        onReply?.({
            username: commentData?.user?.username,
            id: commentData?.comment_parent ? commentData?.comment_parent : commentData?._id,
        })
    }

    const handleShowLike = e => {
        e.stopPropagation()
    }

    return (
        <div
            className='-mr-[2px] -mt-[5px] flex justify-between pt-3'
            onDoubleClick={handleLike}
        >
            <div className='flex w-[--full-28px] items-start'>
                <div className='mr-[18px] cursor-pointer select-none'>
                    <HoverCardProfile
                        isFollow={isFollow}
                        handleConfirmUnfollow={handleConfirmUnfollow}
                        handleFollow={handleFollow}
                        dataUser={commentData?.user}
                    >
                        <Link to={`/${commentData?.user?.username}`}>
                            <div className='relative cursor-pointer'>
                                <span className='absolute left-[50%] top-[50%] h-[42] w-[42px] translate-x-[-50%] translate-y-[-50%] select-none'>
                                    <CircleIcon className='font-extralight' />
                                </span>
                                <Avatar className='h-8 w-8'>
                                    <AvatarImage
                                        src={
                                            commentData?.user
                                                ?.profile_pic_url
                                        }
                                        alt='@shadcn'
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </div>
                        </Link>
                    </HoverCardProfile>
                </div>
                <div className='inline-block'>
                    <h3 className='inline-flex items-center text-[13px] font-semibold text-[--ig-primary-text]'>
                        <div className='mr-1 flex flex-col justify-start'>
                            <HoverCardProfile
                                isFollow={isFollow}
                                handleConfirmUnfollow={handleConfirmUnfollow}
                                handleFollow={handleFollow}
                            >
                                <Link
                                    to={`/${commentData?.user?.username}`}
                                    className='select-none text-center text-sm font-semibold leading-[18px] text-[--ig-secondary-button] hover:opacity-50'
                                >
                                    {commentData?.user?.username}
                                </Link>
                            </HoverCardProfile>
                        </div>
                        {commentData?.user?.is_verified && (
                            <div className='mr-1 mt-[1px] select-none'>
                                <VerifiedIcon className='h-3 w-3' />
                            </div>
                        )}
                    </h3>
                    <div className='inline'>
                        <span className='inline text-sm font-normal leading-[18px] text-[--ig-primary-text]'>
                            <RenderFormattedText text={commentData?.text} />
                        </span>
                    </div>
                    <div className='group mb-1 mt-2 flex justify-start'>
                        <span className='flex items-center text-xs leading-4 text-[--ig-secondary-text]'>
                            <TimeAgo
                                date={commentData?.updatedAt}
                                className='mr-3 inline cursor-default text-xs font-normal text-[--ig-secondary-text]'
                            />
                            {likesCount > 0 && (
                                <button className='mr-3 text-[--ig-secondary-text]'>
                                    <span className='text-xs font-semibold text-[--ig-secondary-text]'>
                                        {likesCount} likes
                                    </span>
                                </button>
                            )}
                            <button
                                className='mr-3 text-[--ig-secondary-text] active:opacity-70'
                                onClick={handleReply}
                            >
                                <span className='text-xs font-semibold text-[--ig-secondary-text]'>
                                    Reply
                                </span>
                            </button>
                            <div className='relative ml-1'>
                                <div className='absolute -left-[10px] -top-[12px] hidden items-center justify-center group-hover:inline-block'>
                                    <Modal
                                        nameModal={'More_Options'}
                                        CloseButton={false}
                                    >
                                        <MoreOptionsIcon className='h-6 w-6 text-[--ig-secondary-text]' />
                                    </Modal>
                                </div>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
            <span className='mt-[9px] cursor-pointer'>
                <div
                    className='flex flex-col items-center justify-center'
                    onClick={handleLike}
                >
                    {isLiked ? (
                        <HeartIconSolid className='h-3 w-3 animate-scale-in-out text-[--ig-badge]' />
                    ) : (
                        <HeartIcon className='h-3 w-3 text-[--ig-primary-icon]' />
                    )}
                </div>
            </span>
        </div>
    )
}

export default CommentCard
