import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

function ConfirmUnfollow({ handleConfirmUnfollow, setOpenModal }) {
    return (
        <>
            <div className='m-5 flex max-h-[--max-h-40] w-[--width-vw-88] min-w-[260px] max-w-[400px] flex-col rounded-[--modal-border-radius] bg-[--ig-elevated-background]'>
                <div className='flex flex-col items-center justify-center p-8'>
                    <div className='mb-8 self-center'>
                        <Avatar className='h-[90px] w-[90px]'>
                            <AvatarImage
                                src='https://github.com/shadcn.png'
                                alt='@shadcn'
                            />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                    <span className='text-center text-sm font-normal leading-[18px] text-[--ig-primary-text]'>
                        Unfollow @bella.meilk?
                    </span>
                </div>
                <button
                    className='flex min-h-12 flex-grow items-center justify-center border-t border-t-[--ig-elevated-separator] px-2 py-1 text-sm font-bold text-[--ig-error-or-destructive] active:bg-[--ig-bg-active-secondary]'
                    onClick={() => handleConfirmUnfollow()}
                >
                    Unfollow
                </button>
                <button
                    className='flex min-h-12 flex-grow items-center justify-center border-t border-t-[--ig-elevated-separator] text-sm text-[--ig-primary-text] active:bg-[--ig-bg-active-secondary]'
                    onClick={() => setOpenModal(false)}
                >
                    Cancel
                </button>
            </div>
        </>
    )
}

export default ConfirmUnfollow