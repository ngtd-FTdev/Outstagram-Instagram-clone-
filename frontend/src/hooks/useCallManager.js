import { useState, useEffect, useRef, useCallback } from 'react'
import { useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useCreateCallMutation } from '@/api/slices/callAPISlice'
import { useNavigate } from 'react-router-dom'

export const useCallManager = (chatId, callId, mediaSettings) => {
    const [call, setCall] = useState(null)
    const [callState, setCallState] = useState('idle')
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    
    const client = useStreamVideoClient()
    const [createCall] = useCreateCallMutation()
    const navigate = useNavigate()
    
    const callRef = useRef(null)
    const cleanupRef = useRef(null)

    const cleanup = useCallback(() => {
        if (cleanupRef.current) {
            cleanupRef.current()
            cleanupRef.current = null
        }
        if (callRef.current) {
            callRef.current = null
        }
    }, [])

    const initializeCall = useCallback(async (newCallId) => {
        if (!client || !newCallId) return

        try {
            setIsLoading(true)
            setError(null)
            setCallState('connecting')

            const { calls } = await client.queryCalls({
                filter_conditions: { id: newCallId }
            })

            if (calls.length === 0) {
                throw new Error('Call not found')
            }

            const foundCall = calls[0]
            callRef.current = foundCall
            setCall(foundCall)
            setCallState('setup')

            const handleCallEnded = () => {
                setCallState('ended')
                cleanup()
            }

            const handleCallRejected = (event) => {
                console.error('Call was rejected event:', event)
                setCallState('ended')
                setError('Call was rejected')
            }

            const handleCallAccepted = () => {
                setCallState('connected')
            }

            foundCall.on('call.ended', handleCallEnded)
            foundCall.on('call.rejected', handleCallRejected)
            foundCall.on('call.accepted', handleCallAccepted)

            cleanupRef.current = () => {
                foundCall.off('call.ended', handleCallEnded)
                foundCall.off('call.rejected', handleCallRejected)
                foundCall.off('call.accepted', handleCallAccepted)
            }

        } catch (err) {
            console.error('Failed to initialize call:', err)
            setError(err.message)
            setCallState('error')
        } finally {
            setIsLoading(false)
        }
    }, [client, cleanup])

    const createNewCall = useCallback(async () => {
        if (!chatId) return

        try {
            setIsLoading(true)
            setError(null)
            setCallState('connecting')

            const result = await createCall({ groupId: chatId }).unwrap()
            const newCallId = result?.metadata?.callId

            if (!newCallId) {
                throw new Error('Failed to create call')
            }

            navigate(`/call/${chatId}/?call_id=${newCallId}`, { replace: true })

        } catch (err) {
            console.error('Failed to create call:', err)
            setError(err.message || 'Failed to create call')
            setCallState('error')
        } finally {
            setIsLoading(false)
        }
    }, [chatId, createCall, navigate])

    const joinCall = useCallback(async (mediaSettings = {}) => {
        if (!callRef.current) return

        try {
            setCallState('connecting')

            await callRef.current.get()

            if (mediaSettings.video !== undefined) {
                mediaSettings.video
                    ? callRef.current.camera.enable()
                    : callRef.current.camera.disable()
            }
            if (mediaSettings.audio !== undefined) {
                mediaSettings.audio
                    ? callRef.current.microphone.enable()
                    : callRef.current.microphone.disable()
            }

            await callRef.current.join()
            setCallState('connected')

        } catch (err) {
            console.error('Failed to join call:', err)
            setError(err.message)
            setCallState('error')
        }
    }, [])

    const leaveCall = useCallback(async () => {
        if (!callRef.current) return

        try {
            await callRef.current.leave()
            setCallState('ended')
            cleanup()
        } catch (err) {
            console.error('Failed to leave call:', err)
        }
    }, [cleanup])

    const endCall = useCallback(async () => {
        if (!callRef.current) return

        try {
            await callRef.current.endCall()
            setCallState('ended')
            cleanup()
        } catch (err) {
            console.error('Failed to end call:', err)
        }
    }, [cleanup])

    useEffect(() => {
        const run = async () => {
            if (callId) {
                await initializeCall(callId)
                await joinCall(mediaSettings)
            } else {
                cleanup()
                setCall(null)
                setCallState('idle')
            }
        }

        run()

        return cleanup
    }, [callId, initializeCall, joinCall, cleanup])

    return {
        call,
        callState,
        error,
        isLoading,
        createNewCall,
        joinCall,
        leaveCall,
        endCall,
        cleanup
    }
}
