import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQueryParam, StringParam } from 'use-query-params'
import { useSelector } from 'react-redux'
import { useCallManager } from '@/hooks/useCallManager'
import { useMediaPermissions } from '@/hooks/useMediaPermissions'
import { fetchConversationIfMissing } from '@/utils/fetchConversationIfMissing'
import SetupCall from './SetupCall'
import Calling from './Calling'
import CallEnded from './CallEnded'
import CallError from './CallError'
import CallLoading from './CallLoading'

function CallPage() {
    const { id: chatId } = useParams()
    const userId = useSelector(state => state.auth.user._id)
    const [callId, setCallId] = useQueryParam('call_id', StringParam)
    const [dataConversation, setDataConversation] = useState(null)

    const [mediaSettings, setMediaSettings] = useState({
        video: false,
        audio: false,
        speaker: false,
    })

    const {
        call,
        callState,
        error,
        isLoading,
        createNewCall,
        joinCall,
        leaveCall,
        endCall,
    } = useCallManager(chatId, callId, mediaSettings)

    const {
        permissions,
        error: permissionError,
        isChecking: isCheckingPermissions,
        requestAllPermissions,
    } = useMediaPermissions()

    useEffect(() => {
        if (chatId && userId) {
            fetchConversationIfMissing({
                chatId,
                currentUserId: userId,
                setDataConversation,
            })
        }
    }, [chatId, userId])

    useEffect(() => {
        if (callState === 'ended') {
            setTimeout(() => {
                window.close()
            }, 3000)
        }
    }, [callState])

    if (isLoading || isCheckingPermissions) {
        return <CallLoading />
    }

    if (callState === 'error' || error) {
        return (
            <CallError
                error={error || 'An error occurred'}
                onRetry={() => window.location.reload()}
            />
        )
    }

    if (callState === 'ended') {
        return <CallEnded />
    }

    return (
        <div className='h-full w-full bg-black'>
            <StreamCall call={call}>
                <StreamTheme>
                    {callState === 'idle' || callState === 'setup' ? (
                        <SetupCall
                            chatId={chatId}
                            callId={callId}
                            dataConversation={dataConversation}
                            mediaSettings={mediaSettings}
                            setMediaSettings={setMediaSettings}
                            permissions={permissions}
                            permissionError={permissionError}
                            onRequestPermissions={requestAllPermissions}
                            onCreateCall={createNewCall}
                            onJoinCall={joinCall}
                            isLoading={isLoading}
                        />
                    ) : callState === 'connected' ? (
                        <Calling
                            call={call}
                            mediaSettings={mediaSettings}
                            setMediaSettings={setMediaSettings}
                            dataConversation={dataConversation}
                            onLeaveCall={leaveCall}
                            onEndCall={endCall}
                        />
                    ) : null}
                </StreamTheme>
            </StreamCall>
        </div>
    )
}

export default CallPage
