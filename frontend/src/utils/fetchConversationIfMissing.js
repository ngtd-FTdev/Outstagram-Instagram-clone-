import { db } from '@/lib/firebaseConfig'
import { getDoc, doc } from 'firebase/firestore'
import { toast } from 'sonner'

export const fetchConversationIfMissing = async ({
    chatId,
    currentConversation,
    currentUserId,
    setDataConversation
}) => {
    if (!chatId || currentConversation || !currentUserId) return
    try {
        const snap = await getDoc(
            doc(db, `user_conversations/${currentUserId}/groups`, chatId)
        )

        const data = snap.data()?.conversationMeta
        if (!data) {
            toast.error('Conversation not found or invalid')
            return
        }

        let users = {}

        if (data.groupType === 'one_to_one') {
            const receiverId = data.memberIds.find(uid => uid !== currentUserId)
            const userDoc = await getDoc(doc(db, 'users', receiverId))
            users = { [receiverId]: userDoc.data() }
        } else {
            const others = data.memberIds.filter(uid => uid !== currentUserId)
            const randomTwo = others.sort(() => 0.5 - Math.random()).slice(0, 2)
            const userDocs = await Promise.all(
                randomTwo.map(uid => getDoc(doc(db, 'users', uid)))
            )
            users = Object.fromEntries(
                userDocs.map(doc => [doc.data().userId, doc.data()])
            )
        }

        const conversation = { id: chatId, ...data, users }
        setDataConversation(conversation)
    } catch (err) {
        console.error('🔥 Failed to fetch single conversation:', err)
        toast.error('Failed to fetch conversation')
    }
}
