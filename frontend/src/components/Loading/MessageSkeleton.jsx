const MessageSkeleton = () => {
    return (
        <div className='absolute inset-0 flex animate-pulse flex-col-reverse gap-8 overflow-y-hidden p-4'>
            {[1, 2, 3, 4, 5, 6].map(index => {
                return (
                    <div key={index}>
                        <div className='flex flex-row-reverse items-end gap-2'>
                            <div className='flex flex-col items-end gap-2'>
                                <div className='h-10 w-56 rounded-2xl bg-blue-200' />
                                <div className='h-10 w-32 rounded-2xl bg-blue-200' />
                            </div>
                        </div>
                        <div className='flex items-end gap-2'>
                            <div className='h-8 w-8 flex-shrink-0 rounded-full bg-gray-200' />
                            <div className='flex flex-col gap-2'>
                                <div className='h-4 w-24 rounded-full bg-gray-200' />
                                <div className='h-10 w-48 rounded-2xl bg-gray-200' />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default MessageSkeleton
