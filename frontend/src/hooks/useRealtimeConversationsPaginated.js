import { useEffect, useState, useRef } from 'react'
import {
    collection,
    query,
    orderBy,
    startAfter,
    limit,
    getDocs,
    getDoc,
    doc,
    onSnapshot,
} from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'
import { toast } from 'sonner'
import { logout } from '@/redux/features/auth'
import { useDispatch } from 'react-redux'
import { playNotificationSound } from '@/utils/playSound'

export const useRealtimeConversationsPaginated = ({
    currentUserId,
    pageSize = 24,
    defaultConversations = [],
}) => {
    const [conversations, setConversations] = useState(defaultConversations)
    const [lastDoc, setLastDoc] = useState(null)
    const [hasMore, setHasMore] = useState(true)

    const previousConversationsRef = useRef([])
    const unsubscribeRef = useRef(null)
    const isInitialMount = useRef(true)

    const dispatch = useDispatch()

    const fetchConversations = async (isInitial = false) => {
        try {
            if (!currentUserId) return

            const baseQuery = query(
                collection(db, `user_conversations/${currentUserId}/groups`),
                orderBy('conversationMeta.updatedAt', 'desc'),
                ...(lastDoc && !isInitial ? [startAfter(lastDoc)] : []),
                limit(pageSize)
            )

            const snapshot = await getDocs(baseQuery)

            const convList = await Promise.all(
                snapshot.docs
                    .map(snap => {
                        const data = snap.data().conversationMeta
                        const id = snap.id

                        if (!data || !data.lastMessage) return null

                        return { id, data }
                    })
                    .filter(Boolean)
                    .map(async ({ id, data }) => {
                        let users = {}

                        if (data.groupType === 'one_to_one') {
                            const receiverId = data.memberIds.find(
                                uid => uid !== currentUserId
                            )
                            const userDoc = await getDoc(
                                doc(db, 'users', receiverId)
                            )
                            users = { [receiverId]: userDoc.data() }
                        } else {
                            const others = data.memberIds.filter(
                                uid => uid !== currentUserId
                            )
                            const randomTwo = others
                                .sort(() => 0.5 - Math.random())
                                .slice(0, 2)
                            const userDocs = await Promise.all(
                                randomTwo.map(uid =>
                                    getDoc(doc(db, 'users', uid))
                                )
                            )
                            users = Object.fromEntries(
                                userDocs.map(doc => [
                                    doc.data().userId,
                                    doc.data(),
                                ])
                            )
                        }

                        return { id, ...data, users }
                    })
            )

            const newLastDoc = snapshot.docs[snapshot.docs.length - 1]
            if (isInitial) {
                setConversations(convList)
                setLastDoc(newLastDoc)
            } else {
                setConversations(prev => [...prev, ...convList])
                setLastDoc(newLastDoc)
            }

            if (snapshot.docs.length < pageSize) setHasMore(false)
        } catch (err) {
            console.log('🔥 Error fetching conversations:', err)
            toast.error('Session expired, please login again.')
            dispatch(logout())
        }
    }

    const listenForUpdates = () => {
        const q = query(
            collection(db, `user_conversations/${currentUserId}/groups`),
            orderBy('conversationMeta.updatedAt', 'desc'),
            limit(1)
        )

        unsubscribeRef.current = onSnapshot(q, async snapshot => {
            if (isInitialMount.current) {
                isInitialMount.current = false
                return
            }

            snapshot.docChanges().forEach(async change => {
                const snap = change.doc
                const data = snap.data()?.conversationMeta
                const id = snap.id

                if (!data || !data.lastMessage) return

                let users = {}

                if (data.groupType === 'one_to_one') {
                    const receiverId = data.memberIds.find(
                        uid => uid !== currentUserId
                    )
                    const userDoc = await getDoc(doc(db, 'users', receiverId))
                    users = { [receiverId]: userDoc.data() }
                } else {
                    const others = data.memberIds.filter(
                        uid => uid !== currentUserId
                    )
                    const randomTwo = others
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 2)
                    const userDocs = await Promise.all(
                        randomTwo.map(uid => getDoc(doc(db, 'users', uid)))
                    )
                    users = Object.fromEntries(
                        userDocs.map(doc => [doc.data().userId, doc.data()])
                    )
                }

                const updatedConversation = { id, ...data, users }

                setConversations(prev => {
                    const index = prev.findIndex(conv => conv.id === id)

                    let updatedList = []

                    if (index !== -1) {
                        const newList = [...prev]
                        newList.splice(index, 1)
                        updatedList = [updatedConversation, ...newList]
                    } else {
                        updatedList = [updatedConversation, ...prev]
                    }

                    const prevConv = previousConversationsRef.current.find(
                        c => c.id === id
                    )
                    const isNew =
                        !prevConv ||
                        updatedConversation.updatedAt > prevConv.updatedAt

                    if (isNew) playNotificationSound()

                    previousConversationsRef.current = updatedList

                    return updatedList
                })
            })
        })
    }

    useEffect(() => {
        if (!currentUserId) return

        if (conversations.length === 0) {
            fetchConversations(true)
        }

        listenForUpdates()

        return () => {
            if (unsubscribeRef.current) unsubscribeRef.current()
        }
    }, [currentUserId])

    const loadMore = () => {
        if (hasMore) fetchConversations(false)
    }

    return {
        conversations,
        loadMore,
        hasMore,
    }
}
