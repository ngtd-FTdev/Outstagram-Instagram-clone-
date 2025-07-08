import MessageSkeleton from '@/components/Loading/MessageSkeleton'
import { useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import MessageGroup from './MessageGroup'
import { useDispatch, useSelector } from 'react-redux'
import { setMessages } from '@/redux/features/message'
import {
    collection,
    doc,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
} from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'
import { toast } from 'sonner'
import CloseIcon from '@/assets/icons/closeIcon.svg?react'
import { useMessagesListener } from '@/hooks/useMessageFireStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useConversationDisplayName } from '@/hooks/useConversationDisplayName'
import { Link, useParams } from 'react-router-dom'
import SpinnerIn from '@/components/SpinnerIn'

const Conversation = ({ dataConversation }) => {
    const containerRef = useRef(null)
    const prevScrollHeight = useRef(0)
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [hasMounted, setHasMounted] = useState(false)

    const dispatch = useDispatch()

    const { messageId: chatId } = useParams()

    const messages = useSelector(state => state.message.messages[chatId])
    const conversations = useSelector(state => state.message.conversations)

    const currentConversation = conversations?.find(conv => conv.id === chatId)

    const { messages: messageData } = useMessagesListener(chatId, !!chatId)

    const { chatName, otherUser } = useConversationDisplayName(
        currentConversation || dataConversation
    )

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (containerRef.current) {
                containerRef.current.scrollTop =
                    containerRef.current.scrollHeight
            }
        }, 0)

        return () => clearTimeout(timeout)
    }, [containerRef.current])

    useEffect(() => {
        if (chatId) {
            handleGetConversation(chatId)
        }
    }, [chatId])

    const handleGetConversation = async conversationId => {
        try {
            const conversationRef = doc(db, 'conversations', conversationId)
            const messagesRef = collection(conversationRef, 'messages')
            const q = query(
                messagesRef,
                orderBy('timestamp', 'desc'),
                limit(20)
            )
            const messagesSnap = await getDocs(q)
            const messages = messagesSnap.docs.map(doc => doc.data()).reverse()
            if (messages.length < 20) {
                setHasMore(false)
            }
            dispatch(setMessages({ groupId: conversationId, messages }))
        } catch (error) {
            toast.error('Something went wrong!', {
                icon: (
                    <CloseIcon className='overflow-hidden rounded-full bg-green-300 p-[2px] text-base' />
                ),
            })
        }
    }

    const loadMoreMessages = async () => {
        if (isLoading || !chatId || !messages || messages.length === 0) return
        setIsLoading(true)

        const container = containerRef.current
        prevScrollHeight.current = container?.scrollHeight || 0

        try {
            const conversationRef = doc(db, 'conversations', chatId)
            const messagesRef = collection(conversationRef, 'messages')
            const oldestMessage = messages[0]
            let q

            if (oldestMessage?.timestamp) {
                q = query(
                    messagesRef,
                    orderBy('timestamp', 'desc'),
                    startAfter(oldestMessage.timestamp),
                    limit(20)
                )
            } else {
                q = query(messagesRef, orderBy('timestamp', 'desc'), limit(20))
            }

            const messagesSnap = await getDocs(q)
            const newMessages = messagesSnap.docs
                .map(doc => ({
                    messageId: doc.id,
                    ...doc.data(),
                }))
                .reverse()

            if (newMessages.length === 0) {
                setHasMore(false)
            } else {
                dispatch(
                    setMessages({
                        groupId: chatId,
                        messages: [...newMessages, ...messages],
                    })
                )

                if (newMessages.length < 20) {
                    setHasMore(false)
                }
            }
        } catch (err) {
            toast.error('Failed to load older messages')
        } finally {
            setIsLoading(false)
        }
    }

    if (!currentConversation && !dataConversation) {
        return (
            <div className='absolute inset-0 h-full overflow-y-auto'>
                <div className='mx-auto max-w-4xl'>
                    <MessageSkeleton />
                </div>
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className='scrollbar-color absolute inset-0 flex h-full flex-col overflow-y-auto'
        >
            {!hasMore && (
                <div className='mt-5 flex flex-col items-center justify-center'>
                    <div className='py-4'>
                        <Avatar className='h-[96px] w-[96px]'>
                            <AvatarImage
                                src={otherUser?.[0]?.avatar}
                                alt='@shadcn'
                            />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='px-[14px] text-[20px] font-semibold text-[--ig-primary-text]'>
                        {chatName}
                    </div>
                    {(currentConversation || dataConversation)?.groupType ===
                        'one_to_one' && (
                        <>
                            <div className='px-[14px] pt-1 text-sm text-[--ig-secondary-text]'>
                                {otherUser?.[0]?.username} · Instagram
                            </div>
                            <Link
                                to={`/${otherUser?.[0]?.username}`}
                                className='mt-4'
                            >
                                <div className='flex h-[32px] items-center justify-center rounded-[8px] bg-[--ig-secondary-button-background] px-4 text-sm font-semibold text-[--ig-primary-text] hover:bg-[--ig-secondary-button-hover] active:opacity-50'>
                                    View profile
                                </div>
                            </Link>
                        </>
                    )}
                </div>
            )}
            <div className='px-4 py-6'>
                <InfiniteScroll
                    pageStart={1}
                    loadMore={loadMoreMessages}
                    hasMore={hasMore}
                    isReverse={true}
                    useWindow={false}
                    initialLoad={false}
                    getScrollParent={() => containerRef.current}
                    loader={
                        <div className='flex items-center justify-center space-x-2 p-4'>
                            <SpinnerIn
                                key='loader'
                                classname='h-6 w-6 text-[--ig-primary-text]'
                            />
                        </div>
                    }
                >
                    <div className='flex flex-col'>
                        <MessageGroup />
                    </div>
                </InfiniteScroll>
            </div>
        </div>
    )
}

export default Conversation
