import { useLikePostMutation, useSavePostMutation } from '@/api/slices/postApiSlice'
import CircleIcon from '@/assets/icons/circleIcon.svg?react'
import CommentIcon from '@/assets/icons/commentIcon.svg?react'
import DirectIcon from '@/assets/icons/directIcon.svg?react'
import HeartIcon from '@/assets/icons/heartIcon.svg?react'
import HeartIconSolid from '@/assets/icons/heartIconSolid.svg?react'
import LoadingIcon from '@/assets/icons/loadingIcon.svg?react'
import MoreOptionsIcon from '@/assets/icons/moreOptionsIcon.svg?react'
import SaveIcon from '@/assets/icons/SaveIcon.svg?react'
import SavedIcon from '@/assets/icons/savedIcon.svg?react'
import VerifiedIcon from '@/assets/icons/verifiedIcon.svg?react'
import HoverCardProfile from '@/components/HoverCardProfile'
import Modal from '@/components/modal'
import TimeAgo from '@/components/TimeAgo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useReply } from '@/contexts/ReplyContext'
import SharePost from '@/pages/Home/NewsFeed/Post/SharePost'
import HeaderRightPost from '@/pages/PostPage/RightPost/HeaderRightPost'
import PostDetail from '@/pages/PostPage/RightPost/PostDetail'
import ChatComment from '@/pages/PostPage/RightPost/PostDetail/ChatComment'
import { setLikesForPost, setSavedForPost } from '@/redux/features/post'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { setIsFollowing, setUsers } from '@/redux/features/user'
import { useFollowUserMutation, useUnFollowUserMutation } from '@/api/slices/userApiSlice'
import { toast } from 'sonner'

function RightPost({ dataPost }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isLiked, setIsLiked] = useState(dataPost.isLiked)
    const [saved, setSaved] = useState(dataPost.isSaved || false)
    const { handleFocusInput } = useReply()

    const dataUser = useSelector(
        state => state.users.byId[dataPost?.author?._id]
    )

    const { user } = useSelector(state => state.auth)
    let isPostForUser = user?._id === dataPost.author._id

    const [likePost] = useLikePostMutation()
    const [savePost] = useSavePostMutation()
    const [followUser] = useFollowUserMutation()
    const [unFollowUser, { isLoading: isUnfollowLoading }] =
        useUnFollowUserMutation()

    const dispatch = useDispatch()

    useEffect(() => {
        if (!dataUser && dataPost?.author) {
            dispatch(setUsers([dataPost.author]))
        }
    }, [dataUser, dataPost?.author])

    const handleFollow = async () => {
        if (!dataUser?.isFollowingAuthor) {
            try {
                await followUser(dataUser?._id).unwrap()
                dispatch(setIsFollowing({ userId: dataUser?._id, value: true }))
            } catch (error) {
                toast.error('Failed to follow user!')
            }
        }
    }

    const handleConfirmUnfollow = async () => {
        if (dataUser?.isFollowingAuthor) {
            try {
                await unFollowUser(dataUser._id).unwrap()
                dispatch(setIsFollowing({ userId: dataUser._id, value: false }))
            } catch (error) {
                toast.error('Failed to unfollow!')
            }
        }
    }

    const handleLike = async () => {
        await likePost(dataPost._id).unwrap()
        setIsLiked(!isLiked)
        dispatch(setLikesForPost({ postId: dataPost._id, isLiked: !isLiked }))
    }

    const handleSavePost = async () => {
        try {
            await savePost(dataPost._id).unwrap()
            setSaved(!saved)
            dispatch(setSavedForPost({ postId: dataPost._id, isSaved: !saved }))
        } catch (error) {
            console.error('Failed to save post:', error)
        }
    }

    return (
        <div className='flex w-[--media-info] flex-grow flex-col bg-[--ig-primary-background]'>
            <HeaderRightPost
                dataPost={dataPost}
                isFollow={dataUser?.isFollowingAuthor}
                handleConfirmUnfollow={handleConfirmUnfollow}
                handleFollow={handleFollow}
                isLoading={isLoading}
                isPostForUser={isPostForUser}
            />
            <div className='flex min-w-[--media-info] flex-grow flex-col border-l border-[--post-separator]'>
                <PostDetail
                    isFollow={dataUser?.isFollowingAuthor}
                    handleConfirmUnfollow={handleConfirmUnfollow}
                    handleFollow={handleFollow}
                    scrollBar={true}
                    dataPost={dataPost}
                />
                <div className='order-2 flex flex-grow items-center border-t border-[--post-separator] px-4 pb-2 pt-[6px]'>
                    <span
                        className='group -ml-2 cursor-pointer p-2'
                        onClick={handleLike}
                    >
                        <div className='flex items-center justify-center'>
                            {isLiked ? (
                                <HeartIconSolid className='h-6 w-6 animate-scale-in-out text-[--ig-badge]' />
                            ) : (
                                <HeartIcon className='h-6 w-6 text-[--ig-primary-icon] group-hover:text-[--ig-secondary-icon]' />
                            )}
                        </div>
                    </span>
                    <span
                    onClick={handleFocusInput}
                        className='group cursor-pointer p-2'
                    >
                        <div className='flex items-center justify-center'>
                            <CommentIcon className='h-6 w-6 text-[--ig-primary-icon] group-hover:text-[--ig-secondary-icon]' />
                        </div>
                    </span>
                    <Modal
                        modalComponent={SharePost}
                        asChild={true}
                        CloseButton={false}
                    >

                    <span className='group cursor-pointer p-2'>
                        <div className='flex items-center justify-center'>
                            <DirectIcon className='h-6 w-6 text-[--ig-primary-icon] group-hover:text-[--ig-secondary-icon]' />
                        </div>
                    </span>
                    </Modal>
                    <span onClick={handleSavePost} className='group ml-auto cursor-pointer p-2'>
                        <div className='flex items-center justify-center'>
                        {saved ? (
                                <SavedIcon className='h-6 w-6 text-[--ig-primary-icon] group-hover:text-[--ig-secondary-icon]' />
                            ) : (
                                <SaveIcon className='h-6 w-6 text-[--ig-primary-icon] group-hover:text-[--ig-secondary-icon]' />
                            )}
                        </div>
                    </span>
                </div>
                <div className='order-3 mb-1 px-4'>
                    {dataPost?.likes > 0 ? (
                        <span className='text-sm font-semibold text-[--ig-primary-text]'>
                            <span className=''>{dataPost?.likes} </span>
                            likes
                        </span>
                    ) : (
                        <span className='text-sm text-[--ig-primary-text]'>
                            Be the first to
                            <div
                                onClick={handleLike}
                                className='inline cursor-pointer font-semibold text-[--ig-secondary-button]'
                            >
                                {' '}
                                like this
                            </div>
                        </span>
                    )}
                </div>
                <div className='order-4 -mt-1 mb-4 pl-4'>
                    <TimeAgo
                        date={dataPost?.createdAt}
                        className='-mt-1 mr-3 inline cursor-default text-xs font-normal text-[--ig-secondary-text]'
                    />
                </div>
                <ChatComment postId={dataPost?._id} />
            </div>
        </div>
    )
}

export default RightPost
