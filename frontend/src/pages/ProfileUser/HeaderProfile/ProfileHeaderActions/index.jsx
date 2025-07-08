import OptionsIcon from '@/assets/icons/optionsIcon.svg?react'
import MoreOptionsIcon from '@/assets/icons/moreOptionsIcon.svg?react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setIsFollowing } from '@/redux/features/user'
import { useFollowUserMutation, useUnFollowUserMutation } from '@/api/slices/userApiSlice'
import { toast } from 'sonner'
import { useCreateGroupConversationMutation } from '@/api/slices/messageApiSlide'

function ProfileHeaderActions({ profileData }) {
    const user = useSelector(state => state.auth.user)

    const isUser = profileData?.username === user?.username

    const [followUser, { isLoading: isFollowLoading }] = useFollowUserMutation()
    const [unFollowUser, { isLoading: isUnfollowLoading }] =
        useUnFollowUserMutation()
    const [createGroupConversation, { isLoading: isCreateChatLoading }] = useCreateGroupConversationMutation()

    const dispatch = useDispatch()
    const navigate = useNavigate()


    const handleCreateChat = async () => {
        try {
            const memberIds = [profileData?._id]
            const result = await createGroupConversation({ memberIds, userId: user?._id })
            if (result?.data?.metadata?.groupId) {
                navigate(`/direct/t/${result?.data?.metadata?.groupId}`)
            }
        } catch (error) {
            console.log('error::', error)
        }
    }

    const handleFollow = async () => {
        if (!profileData?.isFollowingAuthor) {
            try {
                await followUser(profileData?._id).unwrap()
                dispatch(setIsFollowing({ userId: profileData?._id, value: true }))
            } catch (error) {
                toast.error('Failed to follow user!')
            }
        }
    }


    const onUnfollow = async () => {
        try {
            await unFollowUser(profileData?._id).unwrap()
            dispatch(setIsFollowing({ userId: profileData?._id, value: false }))
        } catch (error) {
            toast.error('Failed to unfollow!')
        }
    }

    return (
        <div className='flex items-center'>
            <div className='mr-5 flex items-start'>
                <Link>
                    <h2 className='line-clamp-1 text-xl leading-[30px] text-[--ig-primary-text]'>
                        {profileData?.username}
                    </h2>
                </Link>
            </div>
            {isUser ? (
                <div className='flex gap-2'>
                    <div>
                        <Link to='/accounts/edit' className='flex h-8 select-none items-center justify-center rounded-[8px] bg-[--ig-secondary-button-background] p-4 text-center text-sm font-semibold text-[--ig-primary-text] hover:bg-[--ig-secondary-button-hover] active:opacity-50'>
                            Edit profile
                        </Link>
                    </div>
                    {/* <div>
                        <Link className='flex h-8 select-none items-center justify-center rounded-[8px] bg-[--ig-secondary-button-background] p-4 text-center text-sm font-semibold text-[--ig-primary-text] hover:bg-[--ig-secondary-button-hover] active:opacity-50'>
                            View archive
                        </Link>
                    </div> */}
                </div>
            ) : (
                <div className='flex gap-2'>
                    {profileData?.isFollowingAuthor ? (
                        <button
                            onClick={onUnfollow}
                            disabled={isUnfollowLoading}
                            className={`flex h-8 select-none items-center justify-center rounded-[8px] bg-[--ig-secondary-button-background] p-4 text-center text-sm font-semibold text-[--ig-primary-text] hover:bg-[--ig-secondary-button-hover] active:opacity-50 ${isUnfollowLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isUnfollowLoading ? 'Unfollowing...' : 'Following'}
                        </button>
                    ) : (
                        <button
                            onClick={handleFollow}
                            disabled={isFollowLoading}
                            className={`flex h-8 select-none items-center justify-center rounded-[8px] bg-[--ig-primary-button] p-4 text-center text-sm font-semibold text-[--ig-primary-text] hover:bg-[--ig-primary-button-hover] active:opacity-50 ${isFollowLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isFollowLoading ? 'Following...' : 'Follow'}
                        </button>
                    )}
                    <button onClick={handleCreateChat} disabled={isCreateChatLoading} className={`flex h-8 select-none items-center justify-center rounded-[8px] bg-[--ig-secondary-button-background] p-4 text-center text-sm font-semibold text-[--ig-primary-text] hover:bg-[--ig-secondary-button-hover] active:opacity-50 ${isCreateChatLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {isCreateChatLoading ? 'Loading...' : 'Message'}
                    </button>
                </div>
            )}
            <div className='flex cursor-pointer items-center justify-center p-2 active:opacity-50'>
                {isUser ? (
                    // <OptionsIcon className='h-6 w-6 text-[--ig-primary-text]' />
                    <></>
                ) : (
                    <MoreOptionsIcon className='h-8 w-8 text-[--ig-primary-text]' />
                )}
            </div>
        </div>
    )
}

export default ProfileHeaderActions
