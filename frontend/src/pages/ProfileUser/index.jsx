import GridIcon from '@/assets/icons/gridIcon.svg?react'
import ReelIcon from '@/assets/icons/reelIcon.svg?react'
import SaveIcon from '@/assets/icons/saveIcon.svg?react'
import UserPinIcon from '@/assets/icons/userPinIcon.svg?react'
import FooterPage from '@/components/footerPage'
import { NavLink, Outlet, useParams } from 'react-router-dom'
import HeaderProfile from './HeaderProfile'
import { useDispatch, useSelector } from 'react-redux'
import { useGetUserProfileMutation } from '@/api/slices/userApiSlice'
import { useEffect, useState, createContext } from 'react'
import NotFoundPage from '../NotFoundPage'
import env from '@/configs/environment'
import { setUsers } from '@/redux/features/user'

export const PostsContext = createContext()

function ProfileUser() {
    const { userName } = useParams()
    const user = useSelector(state => state.auth.user)
    const [userId, setUserIs] = useState({})
    const [posts, setPosts] = useState([])

    const isCurrentUser = userName === user?.username

    const [getUserProfile, { isLoading, error, isError }] =
        useGetUserProfileMutation()

    const dispatch = useDispatch()

    const profileData = useSelector(
        state => state.users.byId[userId]
    )

    const fetchProfileUser = async () => {
        try {
            const result = await getUserProfile(userName).unwrap()
            setUserIs(result?.metadata?._id)
            dispatch(setUsers(result?.metadata))
        } catch (error) {
            if (env.BUILD_MODE === 'dev') {
                console.log('error::', error)
            }
        }
    }

    useEffect(() => {
        if (userName) {
            fetchProfileUser();
        }
    }, [userName]);

    if (isError) {
        return <NotFoundPage />
    }

    if (isLoading && !profileData?.username) {
        return <></>
    }

    return (
        <PostsContext.Provider value={{ posts, setPosts, userName }}>
            <section className='flex h-full min-h-screen w-full flex-grow flex-col'>
                <main className='flex h-full w-full flex-grow flex-col justify-center'>
                    <div className='mx-auto w-[--full-40px] max-w-[--polaris-site-width-wide] flex-grow pt-[--polaris-site-padding-top]'>
                        {/* <div className='w-[--polaris-site-width-wide]'></div> */}
                        <HeaderProfile profileData={profileData} />
                        <div className='flex items-center justify-center gap-[60px] border-t border-[--ig-separator] font-semibold tracking-[1px] text-[--grey-5]'>
                            <NavLink
                                to={''}
                                end
                                className={({ isActive }) =>
                                    `relative flex h-[52px] items-center justify-center text-xs font-semibold uppercase ${isActive ? 'text-[--ig-primary-text] after:absolute after:left-0 after:right-0 after:top-0 after:h-[1px] after:bg-[--ig-primary-text] after:content-[""]' : ''}`
                                }
                            >
                                <div className='flex items-center gap-[6px]'>
                                    <GridIcon className='h-3 w-3' />
                                    <span>Posts</span>
                                </div>
                            </NavLink>
                            {isCurrentUser && (
                                <NavLink
                                    to={'saved'}
                                    className={({ isActive }) =>
                                        `relative flex h-[52px] items-center justify-center text-xs font-semibold uppercase ${isActive ? 'text-[--ig-primary-text] after:absolute after:left-0 after:right-0 after:top-0 after:h-[1px] after:bg-[--ig-primary-text] after:content-[""]' : ''}`
                                    }
                                >
                                    <div className='flex items-center gap-[6px]'>
                                        <SaveIcon className='h-3 w-3' />
                                        <span>Saved</span>
                                    </div>
                                </NavLink>
                            )}
                            {!isCurrentUser && profileData?.reelsCount > 0 && (
                                <NavLink
                                    to={'reels'}
                                    className={({ isActive }) =>
                                        `relative flex h-[52px] items-center justify-center text-xs font-semibold uppercase ${isActive ? 'text-[--ig-primary-text] after:absolute after:left-0 after:right-0 after:top-0 after:h-[1px] after:bg-[--ig-primary-text] after:content-[""]' : ''}`
                                    }
                                >
                                    <div className='flex items-center gap-[6px]'>
                                        <ReelIcon className='h-3 w-3' />
                                        <span>Reels</span>
                                    </div>
                                </NavLink>
                            )}
                            <NavLink
                                to={'tagged'}
                                className={({ isActive }) =>
                                    `relative flex h-[52px] items-center justify-center text-xs font-semibold uppercase ${isActive ? 'text-[--ig-primary-text] after:absolute after:left-0 after:right-0 after:top-0 after:h-[1px] after:bg-[--ig-primary-text] after:content-[""]' : ''}`
                                }
                            >
                                <div className='flex items-center gap-[6px]'>
                                    <UserPinIcon className='h-3 w-3' />
                                    <span>Tagged</span>
                                </div>
                            </NavLink>
                        </div>
                        <Outlet />
                    </div>
                </main>
                <FooterPage />
            </section>
        </PostsContext.Provider>
    )
}

export default ProfileUser
