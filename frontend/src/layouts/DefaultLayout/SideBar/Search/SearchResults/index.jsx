import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { setRecentSearches } from '@/redux/features/search'
import { useDispatch } from 'react-redux'
import { CloseDrawer } from '@/redux/features/sidebar'

function SearchResults({ dataSearch, isLoading }) {
    const dispatch = useDispatch()

    if (isLoading) {
        return (
            <div className='flex flex-grow pt-3'>
                <div className='flex flex-grow items-center justify-center p-[15px] text-sm text-[--ig-secondary-text]'>
                    Searching...
                </div>
            </div>
        )
    }

    const handleAddRecentSearches = (user) => {
        dispatch(setRecentSearches({ user }))
        dispatch(CloseDrawer())
    }

    return (
        <>
            <div className='flex flex-grow pt-3'>
                {!dataSearch || dataSearch.length === 0 ? (
                    <div className='flex flex-grow items-center justify-center p-[15px] text-sm text-[--ig-secondary-text]'>
                        No results found.
                    </div>
                ) : (
                    <div className='w-full'>
                        {dataSearch?.map((user, index) => (
                            <Link
                                key={user._id || index}
                                to={`/${user.username}`}
                                className='flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[--ig-elevated-highlight-background]'
                                onClick={() => handleAddRecentSearches(user)}
                            >
                                <Avatar className='h-11 w-11'>
                                    <AvatarImage
                                        src={user.profile_pic_url}
                                        alt={user.full_name}
                                    />
                                    <AvatarFallback>
                                        {user.full_name
                                            ?.charAt(0)
                                            ?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>

                                <div className='flex min-w-0 flex-1 flex-col'>
                                    <div className='flex items-center gap-2'>
                                        <span className='truncate text-sm font-semibold text-[--ig-primary-text]'>
                                            {user.username}
                                        </span>
                                        {user.is_verified && (
                                            <Badge
                                                variant='secondary'
                                                className='px-1 py-0 text-xs'
                                            >
                                                ✓
                                            </Badge>
                                        )}
                                    </div>
                                    <span className='truncate text-sm text-[--ig-secondary-text]'>
                                        {user.full_name}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default SearchResults
