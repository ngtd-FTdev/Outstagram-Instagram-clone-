import { cn } from '@/lib/utils'

export function StoryNotesSkeleton() {
    return (
        <div className='mb-2 h-[140px] select-none'>
            <div className='flex w-full'>
                <div className='flex flex-grow items-center justify-start'>
                    <div className='h-[140px] flex-grow overflow-hidden'>
                        <div className='flex gap-2 px-4'>
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div
                                    key={item}
                                    className='flex h-[140px] w-24 flex-col items-center justify-end overflow-hidden'
                                >
                                    <div className='z-10 -mb-6 flex min-h-[55px] w-max min-w-[74px] max-w-24 items-start'>
                                        <div className='relative flex min-h-[42px] max-w-full items-center rounded-[14px] bg-[--ig-secondary-background] p-2'>
                                            <div className='h-4 w-16 animate-pulse rounded bg-[--ig-secondary-text]/20' />
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <div className='h-[74px] w-[74px] animate-pulse rounded-full bg-[--ig-secondary-text]/20' />
                                        <div className='mt-[2px] h-3 w-16 animate-pulse rounded bg-[--ig-secondary-text]/20' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ChatRoomSkeleton() {
    return (
        <div className='cursor-pointer select-none px-6 py-2'>
            <div className='flex items-center gap-3'>
                <div className='h-12 w-12 animate-pulse rounded-full bg-[--ig-secondary-background]' />
                <div className='flex-1'>
                    <div className='mb-1.5 h-3 w-3/4 animate-pulse rounded-full bg-[--ig-secondary-background]' />
                    <div className='h-3 w-1/2 animate-pulse rounded-full bg-[--ig-secondary-background]' />
                </div>
            </div>
        </div>
    )
}

export function ChatRoomsSkeleton() {
    return (
        <div className='flex flex-col'>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                <ChatRoomSkeleton key={item} />
            ))}
        </div>
    )
}

export function InboxSkeleton() {
    return (
        <div className='flex h-screen flex-col'>
            <div className='flex h-[60px] items-center justify-between border-b border-[--ig-separator] px-6'>
                <div className='h-4 w-32 animate-pulse rounded-full bg-[--ig-secondary-background]' />
                <div className='h-6 w-6 animate-pulse rounded-full bg-[--ig-secondary-background]' />
            </div>
            <div className='flex-1'>
                <ChatRoomsSkeleton />
            </div>
        </div>
    )
} 