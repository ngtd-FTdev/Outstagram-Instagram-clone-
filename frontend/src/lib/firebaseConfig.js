import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import env from '@/configs/environment'

const firebaseConfig = {
    apiKey: env?.API_KEY_CHAT,
    authDomain: 'outstagram-db-chat.firebaseapp.com',
    databaseURL:
        'https://outstagram-db-chat-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'outstagram-db-chat',
    storageBucket: 'outstagram-db-chat.firebasestorage.app',
    messagingSenderId: '574643164269',
    appId: '1:574643164269:web:471b26343f744c1a3adb64',
    measurementId: 'G-KFD71GJ7C7',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export const auth = getAuth(app)
export const db = getFirestore(app)
