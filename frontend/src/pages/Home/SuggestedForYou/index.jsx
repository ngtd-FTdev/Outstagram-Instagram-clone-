import { useGetSuggestedUsersMutation } from '@/api/slices/userApiSlice'
import ProfileComp from '@/components/profileComp'
import { setSuggestedUsers } from '@/redux/features/suggestedUsers'
import { setUsers } from '@/redux/features/user'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function SuggestedForYou() {
    const dispatch = useDispatch()
    const suggestedUsers = useSelector(
        state => state.suggestedUsers.suggestedUsers
    )
    const [getSuggestedUsers, { isLoading, isError }] =
        useGetSuggestedUsersMutation(20)

    useEffect(() => {
        const fetchSuggestedUser = async () => {
            const result = await getSuggestedUsers()
            const dtUser = result?.data?.metadata
            if (dtUser?.length > 0) {
                const userIds = dtUser.map(user => user._id)
                dispatch(setUsers(dtUser))
                dispatch(setSuggestedUsers(userIds))
            }
        }

        if (suggestedUsers.length === 0) {
            fetchSuggestedUser()
        }
    }, [])

    if (isLoading) {
        return (
            <div className='mb-3 flex w-full flex-1 flex-col'>
                <div className='flex w-full items-center px-4 py-1 leading-[18px]'>
                    <div className='flex flex-1'>
                        <span className='text-sm font-semibold leading-4 text-[--ig-secondary-text]'>
                            Suggested for you
                        </span>
                    </div>
                    <Link
                        to='/explore/people'
                        className='leading-4 hover:opacity-50'
                    >
                        <span className='text-xs font-semibold text-[--ig-primary-text]'>See All</span>
                    </Link>
                </div>
                <div className='mb-1 ml-1 py-2'>
                    <div className='animate-pulse'>
                        {[1, 2, 3].map(i => (
                            <div
                                key={i}
                                className='mb-3 flex items-center gap-3'
                            >
                                <div className='h-11 w-11 rounded-full bg-gray-200'></div>
                                <div className='flex-1'>
                                    <div className='mb-1 h-4 w-20 rounded bg-gray-200'></div>
                                    <div className='h-3 w-16 rounded bg-gray-200'></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className='mb-3 flex w-full flex-1 flex-col'>
                <div className='flex w-full items-center px-4 py-1 leading-[18px]'>
                    <div className='flex flex-1'>
                        <span className='text-sm font-semibold leading-4 text-[--ig-secondary-text]'>
                            Suggested for you
                        </span>
                    </div>
                    <Link
                        to='/explore/people'
                        className='leading-4 hover:opacity-50'
                    >
                        <span className='text-xs font-semibold text-[--ig-primary-text]'>See All</span>
                    </Link>
                </div>
                <div className='mb-1 ml-1 py-2'>
                    <p className='text-sm text-gray-500'>
                        Unable to load suggestions
                    </p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className='mb-3 flex w-full flex-1 flex-col'>
                <div className='flex w-full items-center px-4 py-1 leading-[18px]'>
                    <div className='flex flex-1'>
                        <span className='text-sm font-semibold leading-4 text-[--ig-secondary-text]'>
                            Suggested for you
                        </span>
                    </div>
                    <Link
                        to='/explore/people'
                        className='leading-4 hover:opacity-50'
                    >
                        <span className='text-xs font-semibold text-[--ig-primary-text]'>See All</span>
                    </Link>
                </div>
                <div className='mb-1 ml-1 py-2'>
                    {suggestedUsers?.slice(0, 5).map(id => (
                        <ProfileComp key={id} userId={id} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default SuggestedForYou
