import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'

import CancelCircularIcon from '@/assets/icons/cancelCircularIcon.svg?react'
import SearchIcon from '@/assets/icons/searchIcon.svg?react'
import RecentSearches from './RecentSearches'
import SearchResults from './SearchResults'
import { useDebounce } from '@/hooks/useDebounce'
import { useSearchUsersQuery } from '@/api/slices/userApiSlice'

function Search() {
    const [valueSearch, setValueSearch] = useState('')
    const debouncedValueSearch = useDebounce(valueSearch, 500)

    const {
        data: searchResults,
        isLoading,
        isSuccess,
        isError,
    } = useSearchUsersQuery(
        { q: debouncedValueSearch, limit: 5 },
        {
            skip: !debouncedValueSearch || debouncedValueSearch.length < 2,
        }
    )

    console.log('searchResults::', searchResults)

    const handleClearValueSearch = () => {
        setValueSearch('')
    }

    return (
        <>
            <div className='box-shadow-share flex h-screen w-[397px] flex-col rounded-r-[16px] border-r border-r-[--ig-separator] bg-[--ig-primary-background] py-2 text-[--ig-primary-text]'>
                <div className='my-2 px-6 pb-[34px] pt-[14px]'>
                    <span className='text-start text-[24px] font-semibold text-[--ig-primary-text]'>
                        Search
                    </span>
                </div>
                <div className='flex flex-grow flex-col'>
                    <div className='mx-4'>
                        <div
                            className={`relative flex h-[--search-box-height] min-w-[125px] items-center justify-start rounded-[8px] border-none bg-[--ig-elevated-highlight-background] px-4 py-[3px] ${valueSearch ? '' : 'mb-6'}`}
                        >
                            <input
                                type='text'
                                id='inputSearch'
                                placeholder='Search'
                                className='placeholder-search peer order-2 h-full flex-grow bg-transparent text-base text-[--ig-primary-text] outline-none'
                                value={valueSearch}
                                onChange={e => setValueSearch(e.target.value)}
                            />
                            <label
                                htmlFor='inputSearch'
                                className='order-1 hidden cursor-text items-center justify-center pr-3 text-[--ig-secondary-icon] opacity-80 peer-placeholder-shown:flex peer-focus:hidden'
                            >
                                <SearchIcon className='h-4 w-4' />
                            </label>
                            {valueSearch && (
                                <div
                                    className='absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 transform cursor-pointer items-center justify-center'
                                    onClick={() => handleClearValueSearch()}
                                >
                                    <CancelCircularIcon className='h-[18px] w-[18px] text-[--ig-icon-circle]' />
                                </div>
                            )}
                        </div>
                    </div>
                    {valueSearch ? (
                        <SearchResults
                            dataSearch={searchResults?.metadata || []}
                            isLoading={isLoading}
                        />
                    ) : (
                        <RecentSearches />
                    )}
                </div>
            </div>
        </>
    )
}

export default Search
