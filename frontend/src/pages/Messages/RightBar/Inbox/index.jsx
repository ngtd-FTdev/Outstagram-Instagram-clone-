import ArrowIcon from '@/assets/icons/arrowIcon.svg?react'
import NewMessageIcon from '@/assets/icons/newMessageIcon.svg?react'
import { Link, useNavigate } from 'react-router-dom'
import ChatRooms from './ChatRooms'
import StoryNotes from './StoryNotes'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { ChatRoomsSkeleton } from '@/components/skeletons/MessageSkeletons'
import Modal from '@/components/modal'

function Inbox() {
    const user = useSelector(state => state.auth.user)

    const userId = useSelector(state => state.auth.user._id)
    const conversations = useSelector(state => state.message.conversations)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleNavigationChat = item => {
        navigate(`/direct/t/${item?.id}`)
    }

    if (isLoading) {
        return <ChatRoomsSkeleton />
    }

    return (
        <>
            <div className='flex h-screen flex-col'>
                <div className='flex h-[--h-mess-head-rightbar] flex-shrink-0 items-center justify-center px-6 pb-3 pt-[33px] md-lg:justify-between md-lg:pt-9'>
                    <div className='hidden min-w-0 text-[--ig-primary-text] cursor-pointer items-center md-lg:flex'>
                        <div className='flex min-w-0'>
                            <div className='h-[30px] truncate text-xl font-bold'>
                                {user?.username}
                            </div>
                        </div>
                        <div className='mb-[6px] ml-2 pt-1'>
                            <ArrowIcon className='h-3 w-3 rotate-180 transform' />
                        </div>
                    </div>
                    <div className='mb-1 ml-[1px] text-[--ig-primary-text] md-lg:mb-0 md-lg:ml-3'>
                        <Modal
                            CloseButton={false}
                            nameModal={'New_Message'}
                            asChild={true}
                        >
                            <div className='flex items-center justify-center p-2'>
                                <NewMessageIcon className='h-6 w-6' />
                            </div>
                        </Modal>
                    </div>
                </div>

                <div className='flex-grow'>
                    <div className='h-[--h-chats] overflow-y-auto overflow-x-hidden'>
                        <div className='hidden md-lg:block'>
                            <StoryNotes />
                            <div className='flex items-center justify-start px-6 pb-[10px] pt-[14px]'>
                                <div className='flex-grow'>
                                    <h1 className='text-base font-bold leading-5 text-[--ig-primary-text]'>
                                        Messages
                                    </h1>
                                </div>
                                <Link
                                    to='/direct/requests'
                                    className='text-sm font-semibold'
                                >
                                    <span className='text-[--ig-secondary-text]'>
                                        Requests
                                    </span>
                                </Link>
                            </div>
                        </div>
                        <div>
                            {conversations.length > 0 &&
                                conversations?.map((item, index) => (
                                    <ChatRooms
                                        key={index}
                                        item={item}
                                        userId={userId}
                                        handleNavigationChat={
                                            handleNavigationChat
                                        }
                                    />
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Inbox
