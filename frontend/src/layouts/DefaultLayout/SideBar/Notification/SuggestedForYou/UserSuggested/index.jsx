import { useFollowUserMutation, useUnFollowUserMutation } from '@/api/slices/userApiSlice'
import LoadingIcon from '@/assets/icons/loadingIcon.svg?react'
import HoverCardProfile from '@/components/HoverCardProfile'
import Modal from '@/components/modal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CloseDrawer } from '@/redux/features/sidebar'
import { setIsFollowing } from '@/redux/features/user'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

function UserSuggested({ userId }) {
    const userData = useSelector(state => state.users.byId[userId])

    const [followUser, { isLoading }] = useFollowUserMutation()
    const [unFollowUser, { isLoading: isUnfollowLoading }] =
        useUnFollowUserMutation()


    const dispatch = useDispatch()

    const handleClick = () => {
        dispatch(CloseDrawer())
    }

    const handleFollow = async () => {
        if (!userData?.isFollowingAuthor) {
            try {
                await followUser(userData?._id).unwrap()
                dispatch(setIsFollowing({ userId: userData?._id, value: true }))
            } catch (error) {
                toast.error('Failed to follow user!')
            }
        }
    }

    const handleConfirmUnfollow = async () => {
        if (userData?.isFollowingAuthor) {
            try {
                await unFollowUser(userData._id).unwrap()
                dispatch(setIsFollowing({ userId: userData._id, value: false }))
            } catch (error) {
                toast.error('Failed to unfollow!')
            }
        }
    }

    return (
        <div className='flex flex-grow flex-col px-4 py-2'>
            <div className='flex flex-nowrap items-center justify-start gap-3'>
                <HoverCardProfile
                    handleCloseDrawer={handleClick}
                    isFollow={userData?.isFollowingAuthor}
                    handleConfirmUnfollow={handleConfirmUnfollow}
                    handleFollow={handleFollow}
                >
                    <Link to={userData?.username} onClick={handleClick}>
                        <div>
                            <Avatar className='h-11 w-11'>
                                <AvatarImage
                                    src={userData?.profile_pic_url}
                                    alt={userData?.username}
                                />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>
                    </Link>
                </HoverCardProfile>
                <div className='flex flex-grow'>
                    <div className='flex flex-grow flex-col'>
                        <HoverCardProfile
                            handleCloseDrawer={handleClick}
                            isFollow={userData?.isFollowingAuthor}
                            handleConfirmUnfollow={handleConfirmUnfollow}
                            handleFollow={handleFollow}
                        >
                            <Link
                                to='/ngtd'
                                className='text-[--ig-link]'
                                onClick={handleClick}
                            >
                                <div>
                                    <span className='text-sm font-semibold leading-[18px] text-[--ig-primary-text]'>
                                        {userData?.username}
                                    </span>
                                </div>
                            </Link>
                        </HoverCardProfile>
                        <span className='text-sm font-normal leading-[18px] text-[--ig-secondary-text]'>
                            <span className='line-clamp-1'>{userData?.full_name}</span>
                        </span>
                        <span className='text-xs font-normal leading-4 text-[--ig-secondary-text]'>
                            <span className='line-clamp-1'>
                                Suggested for you
                            </span>
                        </span>
                    </div>
                </div>
                <div className=''>
                    {userData?.isFollowingAuthor ? (
                        <Modal
                            CloseButton={false}
                            handleConfirmUnfollow={handleConfirmUnfollow}
                            nameModal={'Confirm_Unfollow'}
                        >
                            <div className='relative cursor-pointer rounded-[8px] bg-[--ig-secondary-button-background] px-5 py-[7px] hover:bg-[--ig-secondary-button-hover]'>
                                <span className='text-sm font-semibold leading-[18px] text-[--web-always-white]'>
                                    Following
                                </span>
                                {isLoading && (
                                    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform'>
                                        <LoadingIcon className='h-[18px] w-[18px] animate-spin text-[--web-always-white]' />
                                    </div>
                                )}
                            </div>
                        </Modal>
                    ) : (
                        <button
                            className='relative rounded-[8px] bg-[--ig-primary-button] px-5 py-[7px] hover:bg-[--ig-primary-button-hover]'
                            onClick={isLoading ? null : handleFollow}
                        >
                            <span className='text-sm font-semibold leading-[18px] text-[--web-always-white]'>
                                Follow
                            </span>
                            {isLoading && (
                                <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform'>
                                    <LoadingIcon className='h-[18px] w-[18px] animate-spin text-[--web-always-white]' />
                                </div>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserSuggested
