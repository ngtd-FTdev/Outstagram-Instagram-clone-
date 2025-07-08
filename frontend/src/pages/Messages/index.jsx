import DefaultMain from './DefaultMain'
import MainChat from './MainChat'
import RightBar from './RightBar'
import {
    setChatId,
} from '@/redux/features/message'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import { useRealtimeConversationsPaginated } from '@/hooks/useRealtimeConversationsPaginated'
import { setConversations } from '@/redux/features/message'
import { Helmet } from 'react-helmet-async'

function MessagesPage() {
    const dispatch = useDispatch()
    const chatId = useSelector(state => state.message.chatId)
    const location = useLocation()
    const param = useParams()
    const { messageId } = param

    const currentUserId = useSelector(state => state.auth.user._id)
    const defaultConversations = useSelector(
        state => state.message.conversations
    )

    const handleSetConversations = conversations => {
        dispatch(setConversations(conversations))
    }

    const { conversations, loadMore, hasMore } =
        useRealtimeConversationsPaginated({
            currentUserId,
            defaultConversations
        })

    useEffect(() => {
        if (conversations) {
            handleSetConversations(conversations)
        }
    }, [conversations])

    useEffect(() => {
        if (messageId) {
            dispatch(setChatId(messageId))
        } else {
            dispatch(setChatId(null))
        }
    }, [location.pathname])

    return (
        <>
            <Helmet>
                <title>{messageId ? 'Direct • Outstagram' : 'Inbox • Direct'}</title>
            </Helmet>
            <section className='flex h-screen min-h-screen w-full flex-grow flex-col'>
                <main className='flex h-full w-full flex-grow flex-col justify-center bg-[--ig-primary-background]'>
                    <section className='flex h-full max-h-full w-full flex-grow flex-col justify-start'>
                        <div className='flex flex-grow flex-nowrap justify-start'>
                            <div className='w-max max-w-[--max-w-sidebar-mess] border-r-[1px] border-r-[--ig-separator] bg-[--ig-primary-background]'>
                                <RightBar />
                            </div>
                            <div className='flex flex-grow flex-col'>
                                {chatId ? <MainChat /> : <DefaultMain />}
                            </div>
                        </div>
                    </section>
                </main>
            </section>
        </>
    )
}

export default MessagesPage
