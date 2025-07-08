import CommentIcon from '@/assets/icons/commentIcon.svg?react'
import DirectIcon from '@/assets/icons/directIcon.svg?react'
import HeartIcon from '@/assets/icons/heartIcon.svg?react'
import HeartIconSolid from '@/assets/icons/heartIconSolid.svg?react'
import SaveIcon from '@/assets/icons/SaveIcon.svg?react'
import SavedIcon from '@/assets/icons/savedIcon.svg?react'
import Modal from '@/components/modal'
import TimeAgo from '@/components/TimeAgo'
import HeaderRightPost from '@/pages/PostPage/RightPost/HeaderRightPost'
import { useEffect, useState } from 'react'
import {
    useFollowUserMutation,
    useUnFollowUserMutation,
} from '@/api/slices/userApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import {
    useLikePostMutation,
    useSavePostMutation,
} from '@/api/slices/postApiSlice'
import { setIsFollowingAuthor, setIsUnFollowingAuthor, setLikesForPost, setSavedForPost } from '@/redux/features/post'
import { useReply } from '@/contexts/ReplyContext'
import SharePost from '../../SharePost'
import PostDetail from './PostDetail'
import ChatComment from './PostDetail/ChatComment'
import { setIsFollowing, setUsers } from '@/redux/features/user'

function RightPost({ postPage, dataPost }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isLiked, setIsLiked] = useState(dataPost.isLiked)
    const [savePost] = useSavePostMutation()
    const [saved, setSaved] = useState(dataPost.isSaved || false)
    const [followUser] = useFollowUserMutation()
    const [unFollowUser] = useUnFollowUserMutation()
    const [likePost] = useLikePostMutation()

    const dataUser = useSelector(
        state => state.users.byId[dataPost?.author?._id]
    )

    useEffect(() => {
        if (!dataUser && dataPost?.author) {
            dispatch(setUsers([dataPost.author]))
        }
    }, [dataUser, dataPost?.author])

    const { handleFocusInput } = useReply()

    const dispatch = useDispatch()

    const { user } = useSelector(state => state.auth)

    let isFollowingAuthor = dataUser?.isFollowingAuthor
    let isPostForUser = user?._id === dataPost.author._id

    const handleFollow = async () => {
        if (!isFollowingAuthor && !isPostForUser) {
            try {
                setIsLoading(true)
                await followUser(dataPost.author._id).unwrap()
                dispatch(setIsFollowing({ userId: dataUser._id, value: true }))
            } catch (error) {
                console.error('Failed to follow user:', error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleLike = async () => {
        const response = await likePost(dataPost._id).unwrap()
        setIsLiked(!isLiked)
        dispatch(setLikesForPost({ postId: dataPost._id, isLiked: !isLiked }))
    }

    const handleConfirmUnfollow = async () => {
        if (isFollowingAuthor && !isPostForUser) {
            try {
                setIsLoading(true)
                await unFollowUser(dataPost.author._id).unwrap()
                dispatch(setIsUnFollowingAuthor({ postId: dataPost?._id }))
            } catch (error) {
                console.error('Failed to unfollow user:', error)
            } finally {
                setIsLoading(false)
            }
        }
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
        <div
            className={`flex flex-grow flex-col bg-[--ig-primary-background] ${postPage ? 'w-[--media-info]' : ''}`}
        >
            {!postPage && <div className='w-[500px]'></div>}
            <HeaderRightPost
                isFollow={isFollowingAuthor}
                handleConfirmUnfollow={handleConfirmUnfollow}
                handleFollow={handleFollow}
                isLoading={isLoading}
                isPostForUser={isPostForUser}
                dataPost={dataPost}
                dataUser={dataUser}
            />
            <div className='flex min-w-[--media-info] flex-grow flex-col border-l border-[--post-separator]'>
                <PostDetail
                    isFollow={dataPost.isFollowingAuthor}
                    handleConfirmUnfollow={handleConfirmUnfollow}
                    handleFollow={handleFollow}
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
                    <span
                        onClick={handleSavePost}
                        className='group ml-auto cursor-pointer p-2'
                    >
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
                            <span className=''>{dataPost?.likes}</span>
                            {' '}likes
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
                        date={'2024-12-29T22:37:09.000Z'}
                        className='-mt-1 mr-3 inline cursor-default text-xs font-normal text-[--ig-secondary-text]'
                    />
                </div>
                <ChatComment postId={dataPost._id} />
            </div>
        </div>
    )
}

export default RightPost
