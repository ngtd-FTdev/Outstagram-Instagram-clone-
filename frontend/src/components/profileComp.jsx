import {
    useFollowUserMutation,
    useUnFollowUserMutation,
} from '@/api/slices/userApiSlice'
import VerifiedIcon from '@/assets/icons/verifiedIcon.svg?react'
import HoverCardProfile from '@/components/HoverCardProfile'
import { setIsFollowing } from '@/redux/features/user'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

function ProfileComp({ userId }) {
    const [followUser, { isLoading: isFollowLoading }] = useFollowUserMutation()
    const [unFollowUser, { isLoading: isUnfollowLoading }] =
        useUnFollowUserMutation()

    const user = useSelector(state => state.users.byId[userId])

    const dispatch = useDispatch()

    const handleFollow = async () => {
        if (!user?.isFollowingAuthor) {
            try {
                await followUser(user?._id).unwrap()
                dispatch(setIsFollowing({ userId: user?._id, value: true }))
            } catch (error) {
                toast.error('Failed to follow user!')
            }
        }
    }

    const handleUnfollow = async () => {
        if (user?.isFollowingAuthor) {
            try {
                await unFollowUser(user._id).unwrap()
                dispatch(setIsFollowing({ userId: user._id, value: false }))
            } catch (error) {
                toast.error('Failed to unfollow!')
            }
        }
    }

    return (
        <>
            <div className='flex flex-1 items-center px-4 py-2'>
                <div className='mr-3 h-11 w-11 overflow-hidden rounded-full'>
                    <HoverCardProfile>
                        <Link to={`/${user.username}`}>
                            <img
                                src={user.profile_pic_url}
                                alt=''
                                className='h-full w-full object-cover'
                            />
                        </Link>
                    </HoverCardProfile>
                </div>
                <div className='flex flex-1 flex-col leading-3'>
                    <div>
                        <HoverCardProfile>
                            <Link
                                to={`/${user.username}`}
                                className='flex items-center text-sm font-semibold leading-[18px] text-[--ig-primary-text]'
                            >
                                <span>{user.username}</span>
                                {user.is_verified && (
                                    <div className='ml-1'>
                                        <VerifiedIcon className='h-3 w-3' />
                                    </div>
                                )}
                            </Link>
                        </HoverCardProfile>
                    </div>
                    <div className='text-xs leading-[18px] text-[--ig-secondary-text]'>
                        Suggested for you
                    </div>
                </div>
                <div className='ml-3 select-none text-xs font-semibold hover:text-[--ig-link] active:opacity-70'>
                    {user?.isFollowingAuthor ? (
                        <button onClick={handleUnfollow} className='text-[--ig-secondary-button]'>Following</button>
                    ) : (
                        <button
                            onClick={handleFollow}
                            className='text-[--ig-primary-button]'
                        >
                            Follow
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}

export default ProfileComp
