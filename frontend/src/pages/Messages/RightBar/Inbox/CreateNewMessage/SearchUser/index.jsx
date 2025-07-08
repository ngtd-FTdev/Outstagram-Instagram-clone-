import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import CheckIcon from '@/assets/icons/checkIcon.svg?react'

function SearchUser({ data = [], selectedUsers, handleSelect }) {
    const isSelected = user => selectedUsers.some(u => u._id === user._id)

    return (
        <>
            <div className='mt-4 max-h-72'>
                {data.map(user => (
                    <div
                        key={user._id}
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

export default SearchUser
