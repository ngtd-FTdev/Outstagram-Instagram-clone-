import env from '@/configs/environment'
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk'
import { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useGetTokenMutation } from '@/api/slices/callAPISlice'
import IncomingCallListener from './IncomingCallListener.jsx'

const apiKey = env?.VITE_PUBLIC_GETSTREAM_API_KEY || ''

const StreamVideoProvider = ({ children }) => {
    const [videoClient, setVideoClient] = useState(null)
    const [isInitializing, setIsInitializing] = useState(false)
    const [error, setError] = useState(null)
    const [retryCount, setRetryCount] = useState(0)
    
    const user = useSelector(state => state.auth.user)
    const [getToken] = useGetTokenMutation()

    const handleGetToken = useCallback(async () => {
        try {
            const token = await getToken().unwrap()
            return token?.metadata
        } catch (err) {
            console.error('Failed to get token:', err)
            throw new Error('Failed to get authentication token')
        }
    }, [getToken])

    const initializeClient = useCallback(async () => {
        if (!apiKey) {
            throw new Error('Stream API key is missing')
        }

        if (!user?._id) {
            throw new Error('User not authenticated')
        }

        try {
            // setIsInitializing(true)
            setError(null)

            const token = await handleGetToken()

            const client = StreamVideoClient.getOrCreateInstance({
                apiKey,
                user: {
                    id: user._id,
                    fullName: user.full_name || 'Anonymous',
                    username: user.username || user._id,
                    image: user.profile_pic_url,
                },
                tokenProvider: handleGetToken,
                timeout: 20000, // 20 giây
            })

            setVideoClient(client)
            setRetryCount(0)
            
        } catch (err) {
            console.error('Stream Video Client initialization failed:', err)
            setError(err.message)
            
            if (retryCount < 3) {
                setTimeout(() => {
                    setRetryCount(prev => prev + 1)
                }, 2000 * (retryCount + 1))
            }
        } finally {
            setIsInitializing(false)
        }
    }, [apiKey, user, handleGetToken, retryCount])

    useEffect(() => {
        if (user?._id) {
            initializeClient()
        } else {
            setVideoClient(null)
            setIsInitializing(false)
        }
    }, [user?._id, initializeClient])

    useEffect(() => {
        if (error && retryCount < 3) {
            const timer = setTimeout(() => {
                initializeClient()
            }, 2000 * (retryCount + 1))
            
            return () => clearTimeout(timer)
        }
    }, [error, retryCount, initializeClient])

    if (isInitializing) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Initializing video call service...</p>
                    {retryCount > 0 && (
                        <p className="text-sm text-gray-400 mt-2">
                            Retry attempt {retryCount}/3
                        </p>
                    )}
                </div>
            </div>
        )
    }

    if (error && retryCount >= 3) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
                        <p className="text-gray-400 mb-6">
                            {error}
                        </p>
                    </div>
                    
                    <button
                        onClick={() => {
                            setRetryCount(0)
                            setError(null)
                            initializeClient()
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (!videoClient || !user?._id) {
        return null
    }

    return (
        <StreamVideo client={videoClient}>
            <IncomingCallListener />
            {children}
        </StreamVideo>
    )
}

export default StreamVideoProvider
