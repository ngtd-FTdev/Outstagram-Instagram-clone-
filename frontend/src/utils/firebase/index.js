import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'

export const getUserById = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
            return userSnap.data()
        } else {
            console.warn(`Không tìm thấy user với ID: ${userId}`)
            return null
        }
    } catch (error) {
        console.error('Lỗi khi lấy thông tin user:', error)
        return null
    }
}
