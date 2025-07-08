import env from '@/configs/environment'
import {
    connectionFailed,
    disconnectSocket,
    socketConnected,
} from '@/redux/features/socket'
import { store } from '@/redux/store'
import { io } from 'socket.io-client'

class ChatSocket {
    constructor() {
        this.socket = null
        this.initializeSocket()
        this.subscribeAuthToken()
    }

    initializeSocket() {
        const { user } = store.getState().auth
        this.socket = io(env.SOCKET_CHAT_URL, {
            auth: { 'x-client-id': user?._id },
            transports: ['websocket'],
            autoConnect: false,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 5000,
        })

        this.registerEvents()
    }

    registerEvents() {
        this.socket.on('connect', () => {
            store.dispatch(socketConnected(this.socket))
            console.info('Socket connected, id:', this.socket.id)
        })

        this.socket.on('connect_error', err => {
            store.dispatch(connectionFailed(err.message))
            console.error('Socket connection error:', err.message)
        })

        this.socket.on('disconnect', reason => {
            console.warn('Socket disconnected:', reason)
            store.dispatch(disconnectSocket())
        })
    }

    subscribeAuthToken() {
        this.unsubscribe = store.subscribe(() => {
            const newToken = store.getState().auth.token
            if (newToken && this.socket) {
                this.socket.auth.token = `Bearer ${newToken}`
            }
        })
    }

    connect() {
        if (!this.socket.connected) {
            this.socket.connect()
        }
    }

    disconnect() {
        if (this.socket && this.socket.connected) {
            this.socket.disconnect()
            if (this.unsubscribe) {
                this.unsubscribe()
            }
        }
    }

    getSocket() {
        return this.socket
    }
}

const chatSocketInstance = new ChatSocket()

export const connectChatSocket = () => {
    chatSocketInstance.connect()
    return chatSocketInstance.getSocket()
}

export const disconnectChatSocket = () => {
    chatSocketInstance.disconnect()
}

export const getChatSocket = () => chatSocketInstance.getSocket()
