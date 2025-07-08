import CloseIcon from '@/assets/icons/closeIcon.svg?react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    clearRecentSearches,
    deleteUserRecentSearch,
} from '@/redux/features/search'
import { CloseDrawer } from '@/redux/features/sidebar'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function RecentSearches() {
    const recentSearches = useSelector(state => state.searchUser.recentSearches)
    const dispatch = useDispatch()

    const handleClickUser = () => {
        dispatch(CloseDrawer())
    }

    const handleClearRecent = () => {
        dispatch(clearRecentSearches())
    }

    const handleDeleteRecentSearch = (e, userId) => {
        e.stopPropagation()
        e.preventDefault()
        if (userId) {
            dispatch(deleteUserRecentSearch({ userId }))
        }
    }

    return (
        <>
            <span className='h-[1px] w-full bg-[--ig-separator]'></span>
            <div className='flex flex-grow flex-col overflow-y-auto overflow-x-hidden pt-3'>
                <div className='mx-6 mb-2 mt-[6px] flex items-center justify-between pt-1'>
                    <span className='text-base font-semibold leading-5 text-[--ig-primary-text]'>
                        Recent
                    </span>
                    <div
                        role='button'
                        className='cursor-pointer select-none text-center text-sm font-semibold leading-[18px] text-[--ig-primary-button] hover:text-[--ig-link] active:opacity-70'
                        onClick={handleClearRecent}
                    >
                        Clear all
                    </div>
                </div>
                {recentSearches.length === 0 ? (
                    <div className='flex flex-grow flex-col items-center justify-center'>
                        <span className='text-center text-sm font-semibold text-[--ig-secondary-text]'>
                            No recent searches.
                        </span>
                    </div>
                ) : (
                    <ul className='my-2'>
                        {recentSearches?.map((data, index) => {
                            return (
                                <Link
                                    key={index}
                                    to={`/${data?.username}`}
                                    className='flex cursor-pointer select-none list-none flex-col outline-none hover:bg-[--ig-hover-overlay] active:opacity-50'
                                    onClick={handleClickUser}
                                >
                                    <div className='flex flex-grow flex-col px-6 py-2'>
                                        <div className='flex flex-nowrap items-center justify-between'>
                                            <div className='mr-3'>
                                                <Avatar className='h-11 w-11'>
                                                    <AvatarImage
                                                        src={
                                                            data?.profile_pic_url
                                                        }
                                                        alt={data?.username}
                                                    />
                                                    <AvatarFallback>
                                                        CN
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div className='flex flex-grow items-center justify-between'>
                                                <div className='flex flex-grow flex-col'>
                                                    <div className='flex items-center'>
                                                        <span className='text-sm font-semibold leading-[18px] text-[--ig-primary-text]'>
                                                            {data?.username}
                                                        </span>
                                                    </div>
                                                    <span className='max-w-full text-sm leading-[18px] text-[--ig-secondary-text]'>
                                                        <span className='line-clamp-1'>
                                                            {data?.full_name}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className='ml-3 flex items-center justify-center p-2'
                                                onClick={e =>
                                                    handleDeleteRecentSearch(
                                                        e,
                                                        data._id
                                                    )
                                                }
                                            >
                                                <CloseIcon className='h-4 w-4 text-[--ig-secondary-text]' />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </ul>
                )}
            </div>
        </>
    )
}

export default RecentSearches
