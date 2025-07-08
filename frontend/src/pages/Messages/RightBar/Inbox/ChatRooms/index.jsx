import TimeAgo from '@/components/TimeAgo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useConversationDisplayName } from '@/hooks/useConversationDisplayName'

function ChatRooms({ item, userId, handleNavigationChat }) {
    const isReadMessage =
        item?.lastMessage?.id === item?.seenMessageId ||
        item?.lastMessage?.senderId === userId

    const { chatName, otherUser } =
        useConversationDisplayName(item)

    return (
        <>
            <div
                className='cursor-pointer select-none px-6 py-2 hover:bg-[--ig-secondary-background]'
                onClick={() => handleNavigationChat(item)}
            >
                <div className='flex flex-nowrap items-center justify-between md-lg:w-[350px]'>
                    <div className='md-lg:pr-3'>
                        <div className='h-14 w-14 overflow-hidden rounded-full'>
                            <span className='overflow-hidden rounded-full'>
                                <Avatar className='h-14 w-14'>
                                    <AvatarImage src={otherUser?.[0]?.avatar} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </span>
                        </div>
                    </div>
                    <div className='hidden flex-grow flex-col md-lg:flex'>
                        <div className='relative mt-[-7px] flex w-[244px] items-center justify-start'>
                            <span className='truncate text-sm font-semibold leading-[--line-heigh] text-[--ig-primary-text]'>
                                {chatName}
                            </span>
                        </div>
                        <div className='h-1'></div>
                        <div className='flex h-[18px] w-full items-center justify-start'>
                            <span
                                className={`line-clamp-1 text-xs ${isReadMessage ? 'text-[--ig-secondary-text]' : 'font-bold text-[--ig-primary-text]'}`}
                            >
                                {item?.lastMessage?.text}
                            </span>
                            <span className='mx-1 text-[--ig-secondary-text]'>
                                &middot;
                            </span>
                            <div className='text-xs text-[--ig-secondary-text]'>
                                <TimeAgo date={item?.lastMessage?.timestamp} />
                            </div>
                        </div>
                    </div>
                    {!isReadMessage && (
                        <div className='ml-3 mr-2 hidden md-lg:block'>
                            <span className='flex h-2 w-2 rounded-full bg-[--ig-primary-button]'></span>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ChatRooms
