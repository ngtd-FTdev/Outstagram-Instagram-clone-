import ActivityOnYourPostsIcon from '@/assets/icons/ActivityOnYourPostsIcon.svg?react'
import { CloseDrawer } from '@/redux/features/sidebar'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedForYou from './SuggestedForYou'

function Notifications() {
    const dispatch = useDispatch()

    const handleClick = () => {
        dispatch(CloseDrawer())
    }

    return (
        <>
            <div className='box-shadow-share flex h-screen w-[397px] flex-col overflow-y-auto overscroll-contain rounded-r-[16px] border-r border-r-[--ig-separator] bg-[--ig-primary-background] py-2 text-[--ig-primary-text]'>
                <div>
                    <div className='flex items-center justify-between px-6 pb-5 pt-3'>
                        <span className='text-2xl font-bold leading-[30px] text-[-ig-primary-text]'>
                            Notifications
                        </span>
                    </div>
                    <div className='flex flex-col items-center justify-center px-10 text-center'>
                        <div className='flex justify-center'>
                            <ActivityOnYourPostsIcon className='h-[62px] w-[62px] text-[--ig-primary-text]' />
                        </div>
                        <h2 className='mt-4'>
                            <span className='text-sm leading-[18px] text-[--ig-primary-text]'>
                                Activity On Your Posts
                            </span>
                        </h2>
                        <h3 className='mt-4'>
                            <span className='text-sm leading-[18px] text-[--ig-primary-text]'>
                                When someone likes or comments on one of your
                                posts, you&apos;ll see it here.
                            </span>
                        </h3>
                    </div>
                    <div className='mt-11 px-2'>
                        <div className='mb-2 mt-2 px-3'>
                            <span className='text-base font-semibold text-[--ig-primary-text]'>
                                Suggested for you
                            </span>
                        </div>
                        <div className='flex flex-col justify-start py-2'>
                            <SuggestedForYou />
                        </div>
                        <div className='flex items-center justify-center px-4 py-3'>
                            <Link
                                to='/explore/people/'
                                className='cursor-pointer select-none text-center text-sm font-semibold leading-[18px] text-[--ig-primary-button] hover:text-[--ig-link] active:opacity-70'
                                onClick={handleClick}
                            >
                                See All Suggestions
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Notifications
