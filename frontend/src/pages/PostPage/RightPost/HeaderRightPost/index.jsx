import { useDeletePostMutation } from '@/api/slices/postApiSlice'
import { useUnFollowUserMutation } from '@/api/slices/userApiSlice'
import CircleIcon from '@/assets/icons/circleIcon.svg?react'
import LoadingIcon from '@/assets/icons/loadingIcon.svg?react'
import MoreOptionsIcon from '@/assets/icons/moreOptionsIcon.svg?react'
import VerifiedIcon from '@/assets/icons/verifiedIcon.svg?react'
import HoverCardProfile from '@/components/HoverCardProfile'
import Modal from '@/components/modal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { setIsFollowing } from '@/redux/features/user'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

function HeaderRightPost({
    isFollow,
    handleConfirmUnfollow,
    handleFollow,
    isLoading,
    isPostForUser,
    dataPost,
    dataUser,
}) {

    const isUser = dataUser?._id === dataPost?.author?._id

    const [unFollowUser, { isLoading: isUnfollowLoading }] =
        useUnFollowUserMutation()

    const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation()

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const onUnfollow = async () => {
        try {
            await unFollowUser(dataPost?.author._id).unwrap()
            dispatch(setIsFollowing({ userId: dataUser._id, value: false }))
        } catch (error) {
            toast.error('Failed to unfollow!')
        }
    }

    const onCopyLink = async () => {
        try {
            if (!navigator.clipboard) {
                throw new Error('Clipboard not supported')
            }
            const postUrl = `${window.location.origin}/p/${dataPost?._id}`
            await navigator.clipboard.writeText(postUrl)
            toast.success('Link copied to clipboard!')
        } catch (error) {
            toast.error('Failed to copy link!')
        }
    }

    const onDelete = async () => {
        try {
            await deletePost(dataPost?._id).unwrap()
            toast.success('Deleted post successfully!')
        } catch (error) {
            toast.error('Failed to delete post!')
        }
    }

    const onGoToPost = async () => {
        navigate(`/p/${dataPost?._id}`)
    }

    return (
        <div className='flex items-center justify-between border-b border-l border-[--post-separator] bg-[--ig-primary-background]'>
            <header className='flex max-w-[--full-48px] flex-shrink flex-grow items-center py-[14px] pl-4 pr-1'>
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
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                </HoverCardProfile>
                <div className='ml-[16px] flex flex-grow flex-col overflow-hidden'>
                    <div className='mb-[3px] flex items-center justify-start'>
                        <div className='flex cursor-pointer flex-row items-center p-[2px]'>
                            <HoverCardProfile
                                isFollow={isFollow}
                                handleConfirmUnfollow={handleConfirmUnfollow}
                                handleFollow={handleFollow}
                                dataUser={dataPost?.author}
                            >
                                <Link>
                                    <span className='text-sm font-semibold text-[--ig-secondary-button] hover:opacity-50'>
                                        {dataPost?.author?.username}
                                    </span>
                                </Link>
                            </HoverCardProfile>
                            {dataPost?.author?.is_verified && (
                                <div className='ml-1 mt-[1px] select-none'>
                                    <VerifiedIcon className='h-3 w-3' />
                                </div>
                            )}
                        </div>
                        {!isFollow && !isPostForUser && (
                            <div className='flex items-center'>
                                <div className='mr-[2px] flex flex-col'>
                                    <span className='mx-1 text-sm font-normal leading-[18px] text-[--ig-primary-text]'>
                                        &#8226;
                                    </span>
                                </div>
                                <button
                                    onClick={handleFollow}
                                    className='flex items-center justify-center text-[--ig-primary-button] outline-none hover:text-[--ig-link] active:opacity-70'
                                    disabled={isLoading}
                                >
                                    <div
                                        className={`text-sm font-semibold leading-[18px] ${isLoading ? 'hidden' : ''} `}
                                    >
                                        Follow
                                    </div>
                                    {isLoading && (
                                        <div className='flex flex-grow items-start justify-center'>
                                            <LoadingIcon className='h-[18px] w-[18px] animate-spin text-[--web-always-white]' />
                                        </div>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <div className='mr-2 flex cursor-pointer items-center justify-center p-2 outline-none'>
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
                    <MoreOptionsIcon className='h-6 w-6 text-[--ig-primary-text]' />
                </Modal>
            </div>
        </div>
    )
}

export default HeaderRightPost
