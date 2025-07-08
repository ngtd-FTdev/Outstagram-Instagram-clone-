import { Link } from 'react-router-dom'
import ArrowIcon from '@/assets/icons/arrowIcon.svg?react'
import SearchIcon from '@/assets/icons/searchIcon.svg?react'

function CloseFriendsSettings() {
    return (
        <div className='min-h-screen max-w-[935px] bg-black text-white'>
            <div className='border-b border-[#262626] p-4'>
                <div className='flex items-center gap-4'>
                    <Link to='/settings'>
                        <ArrowIcon className='h-6 w-6 -rotate-90' />
                    </Link>
                    <h1 className='text-xl font-semibold'>Close friends</h1>
                </div>
            </div>

            <div className='p-4'>
                <div className='mb-6 flex items-center gap-2 text-sm text-[#A8A8A8]'>
                    <p>
                        We don&apos;t send notifications when you edit your
                        close friends list.
                    </p>
                    <Link to='#' className='text-[#0095F6]'>
                        How it works.
                    </Link>
                </div>

                <div className='relative mb-6'>
                    <SearchIcon className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform text-[#A8A8A8]' />
                    <input
                        type='text'
                        placeholder='Search'
                        className='w-full rounded-lg bg-[#262626] py-2 pl-12 pr-4 text-sm text-white placeholder-[#A8A8A8]'
                    />
                </div>

                <div className='space-y-4'>
                    {/* Example user items */}
                    <UserItem
                        username='vanhh_2004'
                        fullName='Vann Anhh'
                        avatar='/path-to-avatar.jpg'
                    />
                    <UserItem
                        username='b.nqoc_'
                        fullName='Nguyễn Bích Ngọc'
                        avatar='/path-to-avatar.jpg'
                    />
                    <UserItem
                        username='i_mfinethankyouandziu'
                        fullName='Linhchi'
                        avatar='/path-to-avatar.jpg'
                    />
                </div>
            </div>
        </div>
    )
}

function UserItem({ username, fullName, avatar }) {
    return (
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
                <div className='h-11 w-11 overflow-hidden rounded-full bg-[#262626]'>
                    <img
                        src={avatar}
                        alt={username}
                        className='h-full w-full object-cover'
                    />
                </div>
                <div>
                    <p className='text-sm font-medium'>{username}</p>
                    <p className='text-sm text-[#A8A8A8]'>{fullName}</p>
                </div>
            </div>
            <div className='h-5 w-5 rounded-full border border-[#A8A8A8]'></div>
        </div>
    )
}

export default CloseFriendsSettings
