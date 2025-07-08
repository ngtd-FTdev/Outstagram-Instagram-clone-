import SuperMessageIcon from '@/assets/icons/superMessageIcon.svg?react'
import Modal from '@/components/modal'

function DefaultMain() {
    return (
        <>
            <div className='flex flex-grow flex-col justify-center'>
                <div className='flex justify-center px-4'>
                    <SuperMessageIcon className='h-24 w-24 text-[--ig-primary-text]' />
                </div>
                <div className='flex justify-center px-4 pt-[20px]'>
                    <h2 className='text-xl font-normal leading-[15px] text-[--ig-primary-text]'>
                        Your messages
                    </h2>
                </div>
                <div className='flex justify-center px-4 pt-[11px]'>
                    <div className='max-w-[480px]'>
                        <span className='text-center text-sm leading-[11px] text-[--ig-secondary-text]'>
                            Send private photos and messages to a friend or
                            group.
                        </span>
                    </div>
                </div>
                <div className='flex justify-center px-4 pt-[18px]'>
                    <Modal
                        CloseButton={false}
                        nameModal={'New_Message'}
                        asChild={true}
                    >
                        <div
                            role='button'
                            className='flex h-8 select-none items-center justify-center rounded-[8px] bg-[--ig-primary-button] px-4 text-sm font-semibold text-white'
                        >
                            Send message
                        </div>
                    </Modal>
                </div>
            </div>
        </>
    )
}

export default DefaultMain
