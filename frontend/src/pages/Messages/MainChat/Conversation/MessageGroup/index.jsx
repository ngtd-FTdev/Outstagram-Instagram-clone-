/* eslint-disable indent */
import MessageSending from '@/components/Loading/MessageSending'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import MessageContent from './MessageChat'
import ShowTimeMessage from '@/components/showTimeMessage'
import { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useReplyMessage } from '@/contexts/ReplyMessage'
import { useToggleReactionMutation } from '@/api/slices/messageApiSlide'

import EmojiIcon from '@/assets/icons/emojiIcon.svg?react'
import ReplyIcon from '@/assets/icons/ReplyIcon.svg?react'
import MoreOptionsIcon from '@/assets/icons/moreOptionsIcon.svg?react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import PopoverCom from '@/components/PopoverCom'
import AddEmoji from '@/components/AddEmoji'

const MessageGroup = () => {
    const userId = useSelector(state => state.auth.user._id)
    const chatId = useSelector(state => state.message.chatId)
    const messages = useSelector(state => state.message.messages[chatId])
    const [isEmojiOpen, setIsEmojiOpen] = useState(false)
    const [selectedMessageId, setSelectedMessageId] = useState(null)
    const { setReply } = useReplyMessage()
    const [toggleReaction] = useToggleReactionMutation()

    const conversations = useSelector(state => state.message.conversations)

    const currentConversation = conversations?.find(conv => conv.id === chatId)
    const userData = currentConversation?.users

    const handleEmojiSelect = async emoji => {
        if (!selectedMessageId || !chatId) return;
        try {
            await toggleReaction({ conversationId: chatId, messageId: selectedMessageId, emoji, isAdd: true }).unwrap();
        } catch (err) {
            console.error('Toggle reaction error:', err);
        }
        setIsEmojiOpen(false)
    }

    const handleReply = message => {
        setReply({
            id: message.messageId,
            type: message.messageType,
            content: message?.text,
            originalSender: message.from,
            fullname:
                userData?.[message.from]?.full_name ||
                userData?.[message.from]?.username,
        })
    }

    const groupMessages = useCallback(messages => {
        if (!Array.isArray(messages) || messages.length === 0) return []

        const groups = []
        let currentGroup = []
        const TEN_MINUTES = 10 * 60 * 1000

        messages.forEach((message, index, arr) => {
            let prevMessage = arr[index - 1]

            const newMessage = {
                ...message,
                isFirstMessage: false,
                isLastMessage: false,
                showTimestamp: false,
                isOnly: false,
            }

            const currentTimestamp = newMessage.timestamp
                ? new Date(newMessage.timestamp).getTime()
                : null
            const prevTimestamp = prevMessage?.timestamp
                ? new Date(prevMessage.timestamp).getTime()
                : null

            if (prevMessage && currentTimestamp && prevTimestamp) {
                const timeDiff = currentTimestamp - prevTimestamp
                if (timeDiff >= TEN_MINUTES) {
                    newMessage.showTimestamp = true
                }
            } else {
                newMessage.showTimestamp = true
            }

            const shouldStartNewGroup = () => {
                if (!prevMessage) return true

                if (!currentTimestamp || !prevTimestamp) return true

                const timeDiff = currentTimestamp - prevTimestamp
                return (
                    prevMessage.from !== newMessage.from ||
                    timeDiff >= TEN_MINUTES
                )
            }

            if (shouldStartNewGroup()) {
                if (currentGroup.length > 0) {
                    if (currentGroup.length === 1) {
                        currentGroup[0] = { ...currentGroup[0], isOnly: true }
                    } else {
                        currentGroup[0] = {
                            ...currentGroup[0],
                            isFirstMessage: true,
                        }
                        currentGroup[currentGroup.length - 1] = {
                            ...currentGroup[currentGroup.length - 1],
                            isLastMessage: true,
                        }
                    }
                    groups.push([...currentGroup])
                }
                currentGroup = [newMessage]
            } else {
                currentGroup.push(newMessage)
            }
        })

        if (currentGroup.length > 0) {
            if (currentGroup.length === 1) {
                currentGroup[0] = { ...currentGroup[0], isOnly: true }
            } else {
                currentGroup[0] = { ...currentGroup[0], isFirstMessage: true }
                currentGroup[currentGroup.length - 1] = {
                    ...currentGroup[currentGroup.length - 1],
                    isLastMessage: true,
                }
            }
            groups.push(currentGroup)
        }

        return groups
    }, [])

    const messageGroups = useMemo(() => groupMessages(messages), [messages])

    return (
        <div className='flex flex-col gap-4'>
            {messageGroups.map((group, groupIndex) => {
 
                if (group[0].type === 'system') {
                    return (
                        <div key={group[0]._id} className='my-2'>
                            {group[0]?.showTimestamp && (
                                <ShowTimeMessage value={group[0].createdAt} />
                            )}
                            {MessageContent({ message: group[0] })}
                        </div>
                    )
                }

                return (
                    <div
                        key={`group-${group[0].messageId || groupIndex}`}
                        className='flex flex-grow'
                    >
                        <div className='flex flex-grow flex-col gap-[1px]'>
                            {group.map((message, messageIndex) => {
                                const isCurrentUser = message.from === userId
                                return (
                                    <div
                                        key={`message-${message.messageId || message.messageId || messageIndex}`}
                                        className='flex flex-grow flex-col'
                                    >
                                        {message.showTimestamp && (
                                            <ShowTimeMessage
                                                value={message.timestamp}
                                            />
                                        )}

                                        {message?.forwarded && (
                                            <div
                                                className={`mb-1 flex flex-grow pl-[50px] pr-[14px] pt-[10px] text-sm text-xs font-normal leading-[16px] text-[--ig-secondary-text] ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                            >
                                                {isCurrentUser
                                                    ? 'You'
                                                    : userData?.[message.from]
                                                          ?.full_name}{' '}
                                                forwarded a message
                                            </div>
                                        )}

                                        {message.messageType ===
                                        'system_call' ? (
                                            <div className='text-center text-xs px-5 py-[10px] text-[--placeholder-text]'>
                                                {isCurrentUser
                                                    ? 'You'
                                                    : userData?.[message.from]
                                                          ?.username ||
                                                      'Unknown User'}{' '}
                                                started an audio call
                                            </div>
                                        ) : (
                                            <>
                                                {(message.isFirstMessage ||
                                                    message.isOnly) &&
                                                !message?.forwarded &&
                                                !isCurrentUser ? (
                                                    <div className='mb-1 pl-12 text-sm text-xs font-normal leading-[16px] text-[--ig-secondary-text]'>
                                                        {userData?.[
                                                            message.from
                                                        ]?.full_name ||
                                                            'Unknown User'}
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                                <div
                                                    className={`flex items-end gap-2 ${
                                                        isCurrentUser
                                                            ? 'flex-row-reverse'
                                                            : 'flex-row'
                                                    }`}
                                                >
                                                    {!isCurrentUser && (
                                                        <div className='w-8 flex-shrink-0'>
                                                            {(message.isLastMessage ||
                                                                message.isOnly) && (
                                                                <Avatar className='h-8 w-8'>
                                                                    <AvatarImage
                                                                        src={
                                                                            userData?.[
                                                                                message
                                                                                    .from
                                                                            ]
                                                                                ?.avatar ||
                                                                            '/default-avatar.png'
                                                                        }
                                                                        alt={
                                                                            'User avatar'
                                                                        }
                                                                        className='h-8 w-8 rounded-full border-2 border-white object-cover shadow-sm'
                                                                    />
                                                                    <AvatarFallback>
                                                                        CN
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div
                                                        className={`group flex flex-grow ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        {MessageContent({
                                                            message,
                                                            isCurrentUser,
                                                        })}

                                                        {message.messageType !==
                                                        'system' ? (
                                                            <div
                                                                className={`flex items-center opacity-0 group-hover:opacity-100 ${selectedMessageId === message.messageId ? 'opacity-100' : ''}`}
                                                            >
                                                                <PopoverCom
                                                                    BodyPop={() => (
                                                                        <AddEmoji
                                                                            insertText={
                                                                                handleEmojiSelect
                                                                            }
                                                                            className='h-[325px] w-[333px]'
                                                                        />
                                                                    )}
                                                                    side='bottom'
                                                                    align='end'
                                                                    // asChild={true}
                                                                    classTrigger={
                                                                        isCurrentUser
                                                                            ? 'order-3'
                                                                            : ''
                                                                    }
                                                                    sideOffset={
                                                                        5
                                                                    }
                                                                    open={
                                                                        isEmojiOpen &&
                                                                        selectedMessageId ===
                                                                            message.messageId
                                                                    }
                                                                    onOpenChange={open => {
                                                                        if (
                                                                            !open &&
                                                                            selectedMessageId ===
                                                                                message.messageId
                                                                        ) {
                                                                            setIsEmojiOpen(
                                                                                false
                                                                            )
                                                                            setSelectedMessageId(
                                                                                null
                                                                            )
                                                                        } else if (
                                                                            open
                                                                        ) {
                                                                            setIsEmojiOpen(
                                                                                true
                                                                            )
                                                                            setSelectedMessageId(
                                                                                message.messageId
                                                                            )
                                                                        }
                                                                    }}
                                                                    className='z-50'
                                                                    ArrowPop={
                                                                        true
                                                                    }
                                                                >
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger
                                                                                asChild
                                                                            >
                                                                                <div
                                                                                    className={`rounded-full p-1 hover:bg-[--press-overlay] ${isCurrentUser ? 'mr-1' : 'ml-1'}`}
                                                                                >
                                                                                    <EmojiIcon className='h-4 w-4 text-[--ig-primary-text]' />
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent className='bg-[--ig-banner-background]'>
                                                                                <p>
                                                                                    React
                                                                                </p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                </PopoverCom>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger
                                                                            asChild
                                                                        >
                                                                            <div
                                                                                className={`rounded-full p-1 hover:bg-[--press-overlay] ${
                                                                                    isCurrentUser
                                                                                        ? 'order-2'
                                                                                        : ''
                                                                                }`}
                                                                                onClick={() =>
                                                                                    handleReply(
                                                                                        message
                                                                                    )
                                                                                }
                                                                            >
                                                                                <ReplyIcon className='h-4 w-4 text-[--ig-primary-text]' />
                                                                            </div>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent className='bg-[--ig-banner-background]'>
                                                                            <p>
                                                                                Reply
                                                                            </p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger
                                                                            asChild
                                                                        >
                                                                            <div
                                                                                className={`rounded-full p-1 hover:bg-[--press-overlay] ${isCurrentUser ? 'order-1' : ''}`}
                                                                            >
                                                                                <MoreOptionsIcon className='h-4 w-4 rotate-90 text-[--ig-primary-text]' />
                                                                            </div>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent className='bg-[--ig-banner-background]'>
                                                                            <p>
                                                                                More
                                                                            </p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </div>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default MessageGroup
