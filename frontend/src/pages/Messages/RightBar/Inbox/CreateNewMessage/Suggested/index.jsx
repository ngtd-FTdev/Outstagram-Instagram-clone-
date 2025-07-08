import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import CheckIcon from '@/assets/icons/checkIcon.svg?react'

const SUGGESTED_USERS = [
    {
        _id: 1,
        full_name: 'Vann Anhh',
        profile_pic_url: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
        _id: 2,
        full_name: 'dexnguyen',
        profile_pic_url: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
        _id: 3,
        full_name: 'Nguyễn Bích Ngọc',
        profile_pic_url: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    {
        _id: 4,
        full_name: 'Sammy Đào',
        profile_pic_url: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    {
        _id: 5,
        full_name: 'Phuong Pham',
        profile_pic_url: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
    {
        _id: 6,
        full_name: 'SALE UPTO 70% ALL ITEMS',
        profile_pic_url: 'https://randomuser.me/api/portraits/men/6.jpg',
    },
    {
        _id: 7,
        full_name: 'huynhphuc',
        profile_pic_url: 'https://randomuser.me/api/portraits/men/7.jpg',
    },
    {
        _id: 8,
        full_name: 'Goc pass đồ của @sang_hiiiii',
        profile_pic_url: 'https://randomuser.me/api/portraits/men/8.jpg',
    },
]

function Suggested({ selectedUsers, suggested = [], handleSelect }) {
    const isSelected = user => selectedUsers.some(u => u?._id === user?._id)

    return (
        <>
            <div className='mx-4 mt-3 text-sm font-semibold text-[--ig-primary-text]'>
                Suggested
            </div>
            <div className='mt-4 max-h-72'>
                {suggested.map(user => (
                    <div
                        key={user?._id}
                        className='flex cursor-pointer items-center px-4 py-2 hover:bg-[--ig-hover-overlay]'
                        onClick={() => handleSelect(user)}
                    >
                        <Avatar className='mr-3 h-11 w-11'>
                            <AvatarImage src={user?.profile_pic_url} alt={user?.username} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span className='flex-1 truncate text-sm text-[--ig-primary-text]'>
                            {user?.full_name}
                        </span>
                        <span className='ml-2'>
                            {isSelected(user) ? (
                                <span className='flex h-6 w-6 items-center justify-center rounded-full bg-[--ig-toggle-background-on-prism]'>
                                    <CheckIcon className='h-[14px] w-[14px] text-[--ig-stroke-prism]' />
                                </span>
                            ) : (
                                <span className='block h-6 w-6 rounded-full border border-[-ig-toggle-outline-prism]' />
                            )}
                        </span>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Suggested
