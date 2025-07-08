import { useGetUserProfileMutation, useEditProfilePictureMutation, useEditUserProfileMutation } from '@/api/slices/userApiSlice'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { setAvatar, editUserProfile } from '@/redux/features/auth'
import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function SettingsPage() {
    const user = useSelector(state => state.auth.user)
    const [getUserProfile, { isLoading }] = useGetUserProfileMutation()
    const [editProfilePicture, { isLoading: editProfilePictureLoading }] = useEditProfilePictureMutation()
    const [editUserProfileApi, { isLoading: editProfileLoading }] = useEditUserProfileMutation()

    const [userData, setUserData] = useState(null)
    const [bio, setBio] = useState('')
    const [website, setWebsite] = useState('')
    const [gender, setGender] = useState('')
    const [showThreadsBadge, setShowThreadsBadge] = useState(false)
    const [showAccountSuggestions, setShowAccountSuggestions] = useState(true)

    const fileInputRef = useRef(null)

    const dispatch = useDispatch()

    const [initialBio, setInitialBio] = useState('')
    const [initialGender, setInitialGender] = useState('')

    const fetchProfileUser = async () => {
        if (!user?.username) return
        try {
            const result = await getUserProfile(user.username).unwrap()
            const metadata = result?.metadata
            setUserData(metadata)
            setBio(metadata?.biography || '')
            setWebsite(metadata?.website || '')
            setGender(metadata?.gender || '')
            setInitialBio(metadata?.biography || '')
            setInitialGender(metadata?.gender || '')
        } catch (err) {
            console.error('Failed to fetch user profile:', err)
        }
    }

    useEffect(() => {
        fetchProfileUser();
    }, [user?.username]);

    const handleChangePhotoClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        const formData = new FormData()
        formData.append('avatar', file)
        try {
            const result = await editProfilePicture(formData).unwrap()
            dispatch(setAvatar(result?.metadata?.profilePicUrl))
        } catch (err) {
            console.log('error::', err);
        }
    }
    
    const isFormChanged = bio !== initialBio || gender !== initialGender

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!isFormChanged) return
        try {
            const result = await editUserProfileApi({ biography: bio, gender }).unwrap()
            setInitialBio(result?.metadata?.biography || '')
            setInitialGender(result?.metadata?.gender || '')
        } catch (err) {
            console.log('error::', err);
        }
    }

    return (
        <div className='mx-auto max-w-[700px] px-12 py-12'>
            <div className='mb-12'>
                <h2 className='text-[20px] font-bold text-[--ig-primary-text]'>Edit profile</h2>
            </div>

            <div className='space-y-8'>
                <div className='flex items-center gap-8 rounded-[20px] bg-[--ig-highlight-background] p-4'>
                    <div className='flex items-center'>
                        <div className='h-[56px] w-[56px] overflow-hidden rounded-full'>
                            <Avatar className='h-[56px] w-[56px]'>
                                <AvatarImage
                                    src={user?.profile_pic_url || ''}
                                    alt={user?.username || 'User Avatar'}
                                />
                                <AvatarFallback>{user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className='flex flex-col px-4'>
                            <span className='text-base font-bold text-[--ig-primary-text]'>
                                {user?.username}
                            </span>
                            <span className='text-sm text-[--ig-secondary-text]'>
                                {user?.full_name}
                            </span>
                        </div>
                    </div>
                    <button
                        className='ml-auto h-8 rounded-[8px] bg-[--ig-primary-button] px-4 text-sm font-semibold hover:bg-[--ig-primary-button-hover] active:opacity-50'
                        onClick={handleChangePhotoClick}
                        disabled={editProfilePictureLoading}
                    >
                        {editProfilePictureLoading ? 'Uploading...' : 'Change photo'}
                    </button>
                    <input
                        type='file'
                        accept='image/*'
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>

                <form onSubmit={handleSubmit} className='space-y-8'>
                    <div className='space-y-2'>
                        <h2 className='py-2 text-base font-semibold text-[--ig-primary-text]'>
                            Website
                        </h2>
                        <input
                            type='text'
                            value={website}
                            onChange={e => setWebsite(e.target.value)}
                            className='w-full cursor-not-allowed rounded-[12px] bg-[--ig-highlight-background] px-4 py-3 text-[15px] text-[--ig-secondary-text]'
                            placeholder='Website'
                            disabled
                        />
                        <p className='text-xs text-[--ig-secondary-text]'>
                            Editing your links is only available on mobile. Visit the Instagram app and edit your profile to change the websites in your bio.
                        </p>
                    </div>

                    <div className='space-y-2'>
                        <h2 className='py-2 text-base font-semibold text-[--ig-primary-text]'>Bio</h2>
                        <div className='relative'>
                            <textarea
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                                className='h-[62px] w-full resize-none rounded-[12px] border border-[--ig-text-input-border-prism] bg-[--ig-primary-background] px-4 py-3 text-[15px] text-[--ig-primary-text]'
                                placeholder='Bio'
                                maxLength={150}
                            />
                            <div className='absolute bottom-3 right-3 text-xs text-[--ig-secondary-text]'>
                                {bio.length}/150
                            </div>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <h2 className='text-base font-semibold text-[--ig-primary-text]'>Show Threads badge</h2>
                        <div className='flex items-center justify-between rounded-[12px] border border-[--ig-text-input-border-prism] bg-[--ig-primary-background] px-4 py-3'>
                            <span className='text-[15px] text-[--ig-primary-text]'>
                                Show Threads badge
                            </span>
                            <label className='relative inline-flex cursor-pointer items-center'>
                                <input
                                    type='checkbox'
                                    checked={showThreadsBadge}
                                    onChange={e => setShowThreadsBadge(e.target.checked)}
                                    className='peer sr-only'
                                />
                                <div className="peer h-6 w-11 rounded-full bg-[#262626] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#0095F6] peer-checked:after:translate-x-full"></div>
                            </label>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <h2 className='text-base font-semibold text-[--ig-primary-text]'>Gender</h2>
                        <select
                            value={gender}
                            onChange={e => setGender(e.target.value)}
                            className='w-full appearance-none rounded-[12px] border border-[--ig-text-input-border-prism] bg-[--ig-primary-background] px-4 py-3 text-[15px] text-[--ig-primary-text]'
                        >
                            <option value='female'>Female</option>
                            <option value='male'>Male</option>
                            <option value='secret'>Prefer not to say</option>
                        </select>
                        <p className='text-sm text-[#A8A8A8]'>This won&apos;t be part of your public profile.</p>
                    </div>

                    <div className='space-y-2'>
                        <h2 className='text-base font-semibold text-[--ig-primary-text]'>Show account suggestions on profiles</h2>
                        <div className='flex items-center justify-between rounded-[12px] border border-[--ig-text-input-border-prism] bg-[--ig-primary-background] px-4 py-3'>
                            <div className='flex flex-col'>
                                <span className='text-[15px] text-[--ig-primary-text]'>
                                    Show account suggestions on profiles
                                </span>
                                <span className='text-sm text-[#A8A8A8]'>
                                    Choose whether people can see similar account suggestions on your profile, and whether your account can be suggested on other profiles.
                                </span>
                            </div>
                            <label className='relative inline-flex cursor-pointer items-center'>
                                <input
                                    type='checkbox'
                                    checked={showAccountSuggestions}
                                    onChange={e => setShowAccountSuggestions(e.target.checked)}
                                    className='peer sr-only'
                                />
                                <div className="peer h-6 w-11 rounded-full bg-[#262626] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#0095F6] peer-checked:after:translate-x-full"></div>
                            </label>
                        </div>
                    </div>

                    <p className='text-xs text-[--ig-secondary-text]'>
                        Certain profile info, like your name, bio and links, is visible to everyone.{' '}
                        <a
                            href='#'
                            className='text-[--ig-colors-button-borderless-text] hover:text-[--ig-colors-button-borderless-text--pressed] hover:underline active:text-[--ig-colors-button-borderless-text--pressed] active:underline active:opacity-50'
                        >
                            See what profile info is visible
                        </a>
                    </p>

                    <div className='flex flex-grow justify-end'>
                        <button
                            className='h-[44px] w-[253px] rounded-[8px] bg-[--ig-primary-button] px-4 py-2 text-sm font-semibold text-white hover:bg-[--ig-primary-button-hover] disabled:opacity-30 active:opacity-50'
                            disabled={!isFormChanged || editProfileLoading}
                            type='submit'
                        >
                            {editProfileLoading ? 'Saving...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SettingsPage
