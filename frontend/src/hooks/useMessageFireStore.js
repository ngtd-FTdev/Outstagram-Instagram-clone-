import { useEffect, useRef, useState, useCallback } from 'react'
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    startAfter,
    limit,
    getDocs,
    Timestamp,
} from 'firebase/firestore'
import { db, auth } from '@/lib/firebaseConfig'
import { useDispatch } from 'react-redux'
import { setAddNewMessage } from '@/redux/features/message'

const PAGE_SIZE = 20

export const useMessagesListener = (
    conversationId,
    enabled = true,
    isAtBottom = true
) => {
    const [messages, setMessages] = useState([])
    const [loadingMore, setLoadingMore] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const lastVisibleRef = useRef(null)
    const unsubscribeRef = useRef(null)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!conversationId || !enabled) return

        const fetchInitialMessages = async () => {
            const q = query(
                collection(db, 'conversations', conversationId, 'messages'),
                orderBy('timestamp', 'desc'),
                limit(PAGE_SIZE)
            )

            const snapshot = await getDocs(q)
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))

            msgs.reverse()
            setMessages(msgs)
            lastVisibleRef.current = snapshot.docs[snapshot.docs.length - 1]
            setHasMore(snapshot.docs.length === PAGE_SIZE)
        }

        fetchInitialMessages()
    }, [conversationId, enabled])

    useEffect(() => {
        if (!conversationId || !enabled) return

        const q = query(
            collection(db, 'conversations', conversationId, 'messages'),
            orderBy('timestamp', 'desc'),
            limit(1)
        )

        unsubscribeRef.current = onSnapshot(q, snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    const message = {
                        id: change.doc.id,
                        ...change.doc.data(),
                    }

                    const msgTimestamp = message.timestamp || 0

                    if (
                        msgTimestamp >
                            messages?.[messages?.length - 1]?.timestamp ||
                        message?.length === 0
                    ) {
                        setMessages(prev => [...prev, message])
                        dispatch(
                            setAddNewMessage({
                                groupId: conversationId,
                                message,
                            })
                        )

                        const currentUserId = auth.currentUser?.uid
                        if (
                            currentUserId &&
                            isAtBottom &&
                            message.senderId !== currentUserId
                        ) {
                            markAsRead(
                                conversationId,
                                currentUserId,
                                message.id
                            )
                        }
                    }
                }
            })
        })

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current()
                unsubscribeRef.current = null
            }
        }
    }, [conversationId, enabled, isAtBottom, messages])

    const loadMore = useCallback(async () => {
        if (
            !hasMore ||
            loadingMore ||
            !conversationId ||
            !lastVisibleRef.current
        )
            return

        setLoadingMore(true)
        const q = query(
            collection(db, 'conversations', conversationId, 'messages'),
            orderBy('timestamp', 'desc'),
            startAfter(lastVisibleRef.current),
            limit(PAGE_SIZE)
        )

        const snapshot = await getDocs(q)
        const moreMsgs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }))

        moreMsgs.reverse()
        setMessages(prev => [...moreMsgs, ...prev])
        lastVisibleRef.current = snapshot.docs[snapshot.docs.length - 1]
        setHasMore(snapshot.docs.length === PAGE_SIZE)
        setLoadingMore(false)
    }, [conversationId, hasMore, loadingMore])

    return {
        messages,
        loadMore,
        hasMore,
        loadingMore,
        stop: () => {
            if (unsubscribeRef.current) unsubscribeRef.current()
        },
    }
}

const markAsRead = async (conversationId, userId, lastMsgId) => {
    try {
        await Promise.all([
            updateDoc(doc(db, 'conversations', conversationId), {
                [`readStatus.${userId}`]: lastMsgId,
            }),
            updateDoc(
                doc(db, 'user_conversations', userId, 'groups', conversationId),
                {
                    'conversationMeta.seenMessageId': lastMsgId,
                }
            ),
        ])
    } catch (err) {
        console.error('🔥 Error marking as read:', err)
    }
}
