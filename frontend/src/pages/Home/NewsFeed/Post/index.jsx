import CircleIcon from '@/assets/icons/circleIcon.svg?react'
import CommentIcon from '@/assets/icons/commentIcon.svg?react'
import DirectIcon from '@/assets/icons/directIcon.svg?react'
import HeartIcon from '@/assets/icons/heartIcon.svg?react'
import HeartIconSolid from '@/assets/icons/heartIconSolid.svg?react'
import LikeIcon from '@/assets/icons/likeIcon.svg?react'
import MoreOptionsIcon from '@/assets/icons/moreOptionsIcon.svg?react'
import SaveIcon from '@/assets/icons/saveIcon.svg?react'
import SavedIcon from '@/assets/icons/savedIcon.svg?react'
import VerifiedIcon from '@/assets/icons/verifiedIcon.svg?react'
import ChatInput from '@/components/chatInput'
import HoverCardProfile from '@/components/HoverCardProfile'
import Modal from '@/components/modal'
import RenderFormattedText from '@/components/renderFormattedText'
import TimeAgo from '@/components/TimeAgo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import EmblaCarouselPost from '@/pages/PostPage/EmblaCarouselPost'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    useLikePostMutation,
    useSavePostMutation,
    useDeletePostMutation,
} from '@/api/slices/postApiSlice'
import SharePost from './SharePost'
import { setIsFollowingAuthor, setIsUnFollowingAuthor, setLikesForPost } from '@/redux/features/post'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useFollowUserMutation, useUnFollowUserMutation } from '@/api/slices/userApiSlice'
import { setIsFollowing } from '@/redux/features/user'

function Post({ postId }) {
    const userId = useSelector(state => state.auth.user._id)
    const post = useSelector(state => state.postFeed.postsById[postId])
    const { _id, author, caption, comments, createdAt, media, likes, isSaved } =
        post

    const dataUser = useSelector(state => state.users.byId[author?._id])

    const [isLiked, setIsLiked] = useState(post.isLiked || false)
    const [likeCount, setLikeCount] = useState(likes || 0)
    const [showLikeAnimation, setShowLikeAnimation] = useState(false)
    const [likePost] = useLikePostMutation()
    const [savePost] = useSavePostMutation()
    const [followUser] = useFollowUserMutation()
    const [saved, setSaved] = useState(isSaved || false)

    const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation()

    const navigate = useNavigate()

    const onDelete = async () => {
        try {
            await deletePost(_id).unwrap()
            toast.success('Deleted post successfully!')
            // TODO: Xử lý cập nhật lại state, xóa post khỏi redux, hoặc refetch list post
        } catch (error) {
            toast.error('Failed to delete post!')
        }
    }

    const isUser = userId === author?._id

    const dispatch = useDispatch()

    const [showFullCaption, setShowFullCaption] = useState(false)
    const MAX_LENGTH = 30
    const SHORT_CAPTION_LENGTH = 13

    const isLongCaption = caption && caption.length > MAX_LENGTH
    const shortCaption = isLongCaption
        ? caption.slice(0, SHORT_CAPTION_LENGTH) + '...'
        : caption

    const handleLike = async () => {
        const response = await likePost(_id).unwrap()
        setIsLiked(!isLiked)
        setLikeCount(prev => (isLiked ? prev - 1 : prev + 1))
        if (!isLiked) {
            setShowLikeAnimation(true)
        }
        dispatch(setLikesForPost({ postId: _id, isLiked: !isLiked }))
    }

    const handleDoubleClickLike = async () => {
        if (!isLiked) {
            await likePost(_id).unwrap()
            setIsLiked(true)
            setLikeCount(prev => prev + 1)
            setShowLikeAnimation(true)
        }
    }

    const handleSavePost = async () => {
        try {
            await savePost(_id).unwrap()
            setSaved(!saved)
        } catch (error) {
            console.error('Failed to save post:', error)
        }
    }

    const onCopyLink = async () => {
        try {
            if (!navigator.clipboard) {
                throw new Error('Clipboard not supported')
            }
            const postUrl = `${window.location.origin}/p/${postId}`
            await navigator.clipboard.writeText(postUrl)
            toast.success('Link copied to clipboard!')
        } catch (error) {
            toast.error('Failed to copy link!')
        }
    }

    const onGoToPost = async () => {
        navigate(`/p/${postId}`)
    }

    const [unFollowUser, { isLoading: isUnfollowLoading }] =
        useUnFollowUserMutation()

    const onUnfollow = async () => {
        try {
            await unFollowUser(author._id).unwrap()
            dispatch(setIsFollowing({ userId: dataUser._id, value: false }))
        } catch (error) {
            toast.error('Failed to unfollow!')
        }
    }

    const handleFollow = async () => {
        if (!dataUser?.isFollowingAuthor && !isUser) {
            try {
                await followUser(dataUser?._id).unwrap()
                dispatch(setIsFollowing({ userId: dataUser._id, value: true }))
            } catch (error) {
                console.error('Failed to follow user:', error)
            }
        }
    }

    return (
        <>
            <div className='flex flex-col'>
                <article>
                    <div className='min-w-[min(--revamp-feed-card-media-min-width, 100%)] mb-[--revamp-feed-item-spacing] flex h-full w-full flex-col border-b-[1px] border-[--ig-separator] pb-[--revamp-feed-card-dense-padding]'>
                        <div className='flex w-full flex-row items-center justify-start pb-3 pl-1'>
                            <div className='mr-3 cursor-pointer'>
                                <Link to={author.username}>
                                    <HoverCardProfile>
                                        <div className='relative'>
                                            <span className='absolute left-[50%] top-[50%] h-[42] w-[42px] translate-x-[-50%] translate-y-[-50%]'>
                                                <CircleIcon className='font-extralight' />
                                            </span>
                                            <Avatar className='h-8 w-8'>
                                                <AvatarImage
                                                    src={
                                                        author?.profile_pic_url
                                                    }
                                                    alt={`@${author?.username}`}
                                                />
                                                <AvatarFallback>
                                                    {author?.username}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </HoverCardProfile>
                                </Link>
                            </div>
                            <div className='flex flex-grow flex-col justify-center'>
                                <div className='flex flex-row items-center'>
                                    <HoverCardProfile>
                                        <div className='flex cursor-pointer flex-row items-center'>
                                            <Link to={author?.username}>
                                                <span className='text-sm font-semibold text-[--ig-primary-text]'>
                                                    {author?.username}
                                                </span>
                                            </Link>
                                            <div className='ml-1'>
                                                <VerifiedIcon className='h-3 w-3' />
                                            </div>
                                        </div>
                                    </HoverCardProfile>
                                    <div className='flex cursor-pointer flex-row items-center'>
                                        <span className='mx-1 text-sm font-normal text-[--ig-secondary-text]'>
                                            &#8226;
                                        </span>
                                        <Link>
                                            <span className='text-[--ig-secondary-text]'>
                                                {createdAt && (
                                                    <TimeAgo date={createdAt} />
                                                )}
                                            </span>
                                        </Link>
                                    </div>
                                    {!isUser &&
                                        !dataUser?.isFollowingAuthor && (
                                            <div className='flex cursor-pointer flex-row items-center'>
                                                <span className='mx-1 text-sm font-normal text-[--ig-secondary-text]'>
                                                    &#8226;
                                                </span>
                                                <button
                                                    onClick={handleFollow}
                                                    className='flex items-center justify-center text-[--ig-primary-button] outline-none hover:text-[--ig-link] active:opacity-70'
                                                    // disabled={isLoading}
                                                >
                                                    <div
                                                        className={
                                                            'text-sm font-semibold leading-[18px]'
                                                        }
                                                    >
                                                        Follow
                                                    </div>
                                                    {/* {isLoading && (
                                        <div className='flex flex-grow items-start justify-center'>
                                        <LoadingIcon className='h-[18px] w-[18px] animate-spin text-[--web-always-white]' />
                                        </div>
                                        )} */}
                                                </button>
                                            </div>
                                        )}
                                </div>
                            </div>
                            <Modal
                                nameModal={'More_Options'}
                                CloseButton={false}
                                asChild={true}
                                isOwner={isUser}
                                onCopyLink={onCopyLink}
                                onUnfollow={onUnfollow}
                                isFollow={dataUser?.isFollowingAuthor}
                                onDelete={onDelete}
                                onGoToPost={onGoToPost}
                            >
                                <div className='ml-2 flex cursor-pointer items-center justify-center'>
                                    <MoreOptionsIcon className='h-6 w-6 text-[--ig-primary-icon]'/>
                                </div>
                            </Modal>
                        </div>
                        <div
                            className='w-[calc(-2px + min(470px, 100vw))] relative max-h-[3000px] overflow-x-hidden rounded border-[1px] border-[--ig-separator]'
                            onDoubleClick={handleDoubleClickLike}
                        >
                            <EmblaCarouselPost dataStoryNotes={media} />
                            <div className='absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[-50%] transform'>
                                {showLikeAnimation && (
                                    <motion.div
                                        key={Math.random()}
                                        initial={{
                                            opacity: 0,
                                            scale: 0,
                                            y: 0,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            scale: [0, 1, 1],
                                            y: [0, 0, -700],
                                        }}
                                        exit={{
                                            opacity: 0,
                                            scale: 1,
                                            y: -700,
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            times: [0, 0.3, 1],
                                        }}
                                        onAnimationComplete={() =>
                                            setShowLikeAnimation(false)
                                        }
                                        className=''
                                    >
                                        <LikeIcon className='' />
                                    </motion.div>
                                )}
                            </div>
                        </div>
                        <div className='h-full w-full'>
                            <section className='my-1 grid grid-cols-2 items-center'>
                                <div className='flex items-center'>
                                    <span
                                        className='-ml-2 flex cursor-pointer items-center justify-center p-2'
                                        onClick={handleLike}
                                    >
                                        {isLiked ? (
                                            <HeartIconSolid className='h-6 w-6 animate-scale-in-out text-[--ig-badge]' />
                                        ) : (
                                            <HeartIcon className='h-6 w-6 text-[--ig-primary-icon] hover:text-[--ig-secondary-icon] active:opacity-50' />
                                        )}
                                    </span>
                                    <Modal
                                        nameModal='Post_Modal'
                                        pathReplace={`/p/${_id}`}
                                        asChild={true}
                                        dataPost={post}
                                    >
                                        <span className='flex cursor-pointer items-center justify-center p-2'>
                                            <CommentIcon className='h-6 w-6 text-[--ig-primary-icon] hover:text-[--ig-secondary-icon] active:opacity-50' />
                                        </span>
                                    </Modal>
                                    <Modal
                                        modalComponent={SharePost}
                                        CloseButton={false}
                                    >
                                        <span className='flex cursor-pointer items-center justify-center p-2'>
                                            <DirectIcon className='h-6 w-6 text-[--ig-primary-icon] hover:text-[--ig-secondary-icon] active:opacity-50' />
                                        </span>
                                    </Modal>
                                </div>
                                <div className='ml-auto mr-0 flex'>
                                    <span
                                        className='cursor-pointer p-2'
                                        onClick={handleSavePost}
                                    >
                                        {saved ? (
                                            <SavedIcon className='h-6 w-6 text-[--ig-primary-text]' />
                                        ) : (
                                            <SaveIcon className='h-6 w-6 text-[--ig-primary-icon] hover:text-[--ig-secondary-icon] active:opacity-50' />
                                        )}
                                    </span>
                                </div>
                            </section>
                            <section className='leading-4'>
                                <span className='max-w-full text-[--ig-primary-text] cursor-pointer text-sm font-semibold leading-4'>
                                    {likeCount > 0 && (
                                        <span className='leading-4'>
                                            {likeCount}
                                            &nbsp;likes
                                        </span>
                                    )}
                                </span>
                            </section>
                            {caption && (
                                <div className='mt-2 inline-block max-w-full leading-4'>
                                    <div className='mr-1 inline-block'>
                                        {caption && (
                                            <Link
                                                to={author.username}
                                                className='flex flex-row'
                                            >
                                                <span className='text-sm text-[--ig-primary-text] font-semibold leading-[18px]'>
                                                    {author.username}
                                                </span>
                                                <div className='ml-1 flex items-center leading-[18px]'>
                                                    <VerifiedIcon className='h-3 w-3' />
                                                </div>
                                            </Link>
                                        )}
                                    </div>
                                    <span className='text-sm text-[--ig-primary-text] leading-[18px]'>
                                        <div className='inline'>
                                            <span
                                                className='text-sm leading-none'
                                                dir='auto'
                                            >
                                                <RenderFormattedText
                                                    text={
                                                        showFullCaption
                                                            ? caption
                                                            : shortCaption
                                                    }
                                                />
                                                {isLongCaption &&
                                                    !showFullCaption && (
                                                        <span
                                                            className='cursor-pointer text-[--ig-secondary-text]'
                                                            onClick={() =>
                                                                setShowFullCaption(
                                                                    true
                                                                )
                                                            }
                                                        >
                                                            more
                                                        </span>
                                                    )}
                                            </span>
                                        </div>
                                    </span>
                                </div>
                            )}
                            <div className='mt-2 leading-4'>
                                {comments > 0 && (
                                    <Modal
                                        nameModal='Post_Modal'
                                        pathReplace={`/p/${_id}`}
                                        asChild={true}
                                        dataPost={post}
                                    >
                                        <span className='cursor-pointer text-sm leading-4 text-[--ig-secondary-text] hover:underline'>
                                            View all
                                            <span> {comments} </span>
                                            comment
                                        </span>
                                    </Modal>
                                )}
                            </div>
                            <section className='mt-1 w-full'>
                                <ChatInput
                                    postId={_id}
                                    parentId={null}
                                    onCommentSuccess={response => {
                                        console.log('Comment added:', response)
                                    }}
                                />
                            </section>
                        </div>
                    </div>
                </article>
            </div>
        </>
    )
}

export default Post
