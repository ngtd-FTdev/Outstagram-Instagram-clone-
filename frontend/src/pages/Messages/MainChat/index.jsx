import InfoCircleIcon from '@/assets/icons/infoCircleIcon.svg?react'
import PhoneIcon from '@/assets/icons/phoneIcon.svg?react'
import VideoCallIcon from '@/assets/icons/videoCallIcon.svg?react'
import Conversation from './Conversation'
import InputChat from './InputChat'
import { useSelector } from 'react-redux'
import { ReplyMessageProvider } from '@/contexts/ReplyMessage'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useConversationDisplayName } from '@/hooks/useConversationDisplayName'
import { useEffect, useState } from 'react'
import { fetchConversationIfMissing } from '@/utils/fetchConversationIfMissing'

function MainChat() {
    const chatId = useSelector(state => state.message.chatId)
    const [dataConversation, setDataConversation] = useState()
    const conversations = useSelector(state => state.message.conversations)
    const currentUserId = useSelector(state => state.auth.user?._id)

    const currentConversation = conversations?.find(conv => conv.id === chatId) || dataConversation

    useEffect(() => {
        fetchConversationIfMissing({
            chatId,
            setDataConversation,
            currentUserId,
            currentConversation,
        })
    }, [chatId, currentConversation, currentUserId])

    const {
        chatName,
        username = null,
        otherUser,
    } = useConversationDisplayName(currentConversation)

    const WrapperComponent = username ? Link : 'div'
    const wrapperProps = username
        ? { to: `/${username}` }
        : { onClick: () => console.log('No username, handle default click') }

    const handleNavigateCallPage = async () => {
        if (!chatId) return
        window.open(`/call/${chatId}`, '_blank')
    }

    return (
        <ReplyMessageProvider>
            <div className='flex flex-grow flex-col justify-center overflow-hidden'>
                <div className='flex flex-grow justify-between'>
                    <div className='relative flex flex-grow flex-col overflow-hidden'>
                        <div className='z-10 flex h-[75px] min-h-[75px] select-none items-center border-b-[1px] border-b-[--ig-separator] px-4'>
                            <WrapperComponent
                                {...wrapperProps}
                                className='flex flex-grow flex-nowrap items-center justify-between'
                            >
                                <div className='cursor-pointer p-[6px]'>
                                    <Avatar className='h-11 w-11'>
                                        <AvatarImage
                                            src={otherUser?.[0]?.avatar}
                                        />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className='flex flex-grow flex-col items-start justify-center overflow-hidden p-[6px]'>
                                    <div className='flex cursor-pointer flex-col overflow-hidden'>
                                        <div className='flex items-end leading-[13px]'>
                                            <h2 className='line-clamp-1 text-base font-semibold leading-5 text-[--ig-primary-text]'>
                                                {chatName}
                                            </h2>
                                        </div>
                                        <span className='text-sm text-[--ig-secondary-text]'>
                                            <div className='leading-4'>
                                                <span className='text-xs leading-4'>
                                                    {username}
                                                </span>
                                            </div>
                                        </span>
                                    </div>
                                </div>
                            </WrapperComponent>
                            <div className='flex justify-end pl-3'>
                                <div
                                    onClick={handleNavigateCallPage}
                                    className='flex cursor-pointer items-center justify-center p-2'
                                >
                                    <PhoneIcon className='h-6 w-6 text-[--ig-primary-text]' />
                                </div>
                                <div className='flex cursor-pointer items-center justify-center p-2'>
                                    <VideoCallIcon className='h-6 w-6 text-[--ig-primary-text]' />
                                </div>
                                <div className='flex cursor-pointer items-center justify-center pl-2'>
                                    <InfoCircleIcon className='h-6 w-6 text-[--ig-primary-text]' />
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-grow'>
                            <div className='flex flex-grow flex-col'>
                                <div className='relative flex flex-grow overflow-hidden border-x-2 border-x-[--mwp-message-row-background]'>
                                    <div className='flex flex-grow flex-col overflow-y-auto overflow-x-hidden'>
                                        <Conversation dataConversation={dataConversation} />
                                    </div>
                                </div>
                                <InputChat />
                            </div>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
        </ReplyMessageProvider>
    )
}

export default MainChat
