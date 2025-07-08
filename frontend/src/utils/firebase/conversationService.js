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

export async function fetchConversationsPaginated(
    userId,
    lastDoc = null,
    pageSize = 24
) {
    const baseQuery = query(
        collection(db, `user_conversations/${userId}/groups`),
        orderBy('conversationMeta.updatedAt', 'desc'),
        ...(lastDoc ? [startAfter(lastDoc)] : []),
        limit(pageSize)
    )

    const snapshot = await getDocs(baseQuery)

    const conversations = await Promise.all(
        snapshot.docs.map(async snap => {
            const data = snap.data().conversationMeta
            const id = snap.id

            const users = await resolveUsers(data, userId)
            return { id, ...data, users }
        })
    )

    const newLastDoc = snapshot.docs[snapshot.docs.length - 1]
    const hasMore = snapshot.docs.length === pageSize

    return {
        conversations,
        lastDoc: newLastDoc,
        hasMore,
    }
}

export function listenForConversationUpdates(userId, onUpdate) {
    const q = query(
        collection(db, `user_conversations/${userId}/groups`),
        orderBy('conversationMeta.updatedAt', 'desc'),
        limit(1)
    )

    let isInitialMount = true

    const unsubscribe = onSnapshot(q, async snapshot => {
        if (isInitialMount) {
            isInitialMount = false
            return
        }

        snapshot.docChanges().forEach(async change => {
            const snap = change.doc
            const data = snap.data()?.conversationMeta
            const id = snap.id
            if (!data) return

            const users = await resolveUsers(data, userId)
            const updatedConversation = { id, ...data, users }

            onUpdate(updatedConversation)
        })
    })

    return unsubscribe
}

async function resolveUsers(data, currentUserId) {
    if (data.groupType === 'one_to_one') {
        const receiverId = data.memberIds.find(id => id !== currentUserId)
        const userDoc = await getDoc(doc(db, 'users', receiverId))
        return { [receiverId]: userDoc.data() }
    }

    const others = data.memberIds.filter(id => id !== currentUserId)
    const randomTwo = others.sort(() => 0.5 - Math.random()).slice(0, 2)
    const userDocs = await Promise.all(
        randomTwo.map(uid => getDoc(doc(db, 'users', uid)))
    )

    return Object.fromEntries(
        userDocs.map(doc => [doc.data().userId, doc.data()])
    )
}
