import CloseIcon from '@/assets/icons/closeIcon.svg?react'
import SearchIcon from '@/assets/icons/searchIcon.svg?react'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useState } from 'react'
import ShareCarousel from './ShareCarousel'

function SharePost({ handleCloseButton }) {
    const [valueSearch, setValueSearch] = useState('')

    const [listShare, setListShare] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    const handleClearValueSearch = () => {
        setValueSearch('')
    }

    const handleCancelSearch = () => {
        setValueSearch('')
    }

    return (
        <div className='m-5 h-[65vh] max-h-[--full-40px] w-[548px]'>
            <div className='flex h-full max-h-[--vh-40] flex-col overflow-auto rounded-[12px] bg-[--ig-elevated-background]'>
                <div className='flex h-[71px]'>
                    <div className='w-[48px]'></div>
                    <h2 className='flex flex-grow items-center justify-center text-center text-base font-bold text-[--ig-primary-text]'>
                        Share
                    </h2>
                    <div className='p-4'>
                        <div
                            onClick={handleCloseButton}
                            className='flex cursor-pointer items-center justify-center p-2'
                        >
                            <CloseIcon className='h-[18px] w-[18px] text-[--ig-primary-text]' />
                        </div>
                    </div>
                </div>
                <div className='flex flex-grow flex-col'>
                    <div className='flex flex-grow flex-col'>
                        <div className='mb-2 flex max-h-[120px] px-6'>
                            <label className='flex flex-grow items-center rounded-[6px] bg-[--ig-secondary-background] pr-2'>
                                <div className='ml-4'>
                                    <SearchIcon className='h-4 w-4 text-[--ig-secondary-text]' />
                                </div>
                                <input
                                    placeholder='Search'
                                    spellCheck={false}
                                    value={valueSearch}
                                    onChange={e =>
                                        setValueSearch(e.target.value)
                                    }
                                    className='w-full flex-grow bg-[--ig-secondary-background] px-[9px] py-1 text-sm leading-[30px] text-[--ig-primary-text] outline-none'
                                ></input>
                            </label>
                            {valueSearch && (
                                <div className='ml-6 flex items-center justify-center'>
                                    <div
                                        onClick={handleCancelSearch}
                                        className='cursor-pointer select-none text-sm font-semibold text-[--ig-secondary-button]'
                                    >
                                        Cancel
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='relative ml-3 flex-grow overflow-x-hidden overflow-y-scroll pr-3'>
                            <div className='absolute inset-0 flex w-full max-w-[504px] flex-wrap gap-x-4 gap-y-1 pt-2'>
                                {listShare?.map((item, index) => (
                                    <div
                                        key={index}
                                        className='flex cursor-pointer select-none items-center justify-center rounded-[8px] p-2 hover:bg-[--while-255-01]'
                                    >
                                        <div className='flex h-[116px] w-[98px] flex-col items-center'>
                                            <div className='h-[74px] w-[74px] overflow-hidden rounded-full'>
                                                <Avatar>
                                                    <AvatarImage
                                                        src='https://github.com/shadcn.png'
                                                        alt='@shadcn'
                                                    />
                                                    <AvatarFallback>
                                                        CN
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div className='mt-2 line-clamp-2 flex items-center justify-center text-center text-xs font-normal text-[--ig-primary-text]'>
                                                Nguyễn Tuấn Đạt
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='border-t border-[--ig-elevated-separator]'>
                        <ShareCarousel listShare={listShare} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SharePost
