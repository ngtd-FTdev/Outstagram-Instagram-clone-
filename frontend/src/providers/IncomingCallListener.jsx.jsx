import { useCalls, CallingState } from '@stream-io/video-react-sdk'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import PhoneCallIcon from '@/assets/icons/phoneIcon.svg?react'
import VideoCallIcon from '@/assets/icons/videoCallIcon.svg?react'
import CloseIcon from '@/assets/icons/closeIcon.svg?react'

const IncomingCallListener = () => {
    const calls = useCalls()
    const [isHandled, setIsHandled] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    const incoming = calls.find(
        call =>
            !call.isCreatedByMe &&
            call.state.callingState === CallingState.RINGING
    )

    useEffect(() => {
        if (!incoming) {
            setIsHandled(false)
            setIsProcessing(false)
        }
    }, [incoming])

    if (!incoming || isHandled) return null

    const customData = incoming.state.custom
    const chatId = customData?.chatId
    const callerId = incoming.state.createdBy?.id
    const callerName = incoming.state.createdBy?.name || 'Unknown'
    const callerImage = incoming.state.createdBy?.image

    const handleAccept = async () => {
        if (isProcessing) return
        
        try {
            setIsProcessing(true)
            setIsHandled(true)

            await incoming.accept()

            window.open(`/call/${chatId}/?call_id=${incoming.id}`, '_blank')
        } catch (error) {
            console.error('Failed to accept call:', error)
            setIsHandled(false)
            setIsProcessing(false)
        }
    }

    const handleDecline = async () => {
        if (isProcessing) return

        try {
            setIsProcessing(true)
            setIsHandled(true)

            await incoming.leave({ reject: true, reason: 'decline' })
        } catch (error) {
            console.error('Failed to decline call:', error)
            setIsHandled(false)
            setIsProcessing(false)
        }
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
            <div className='mx-4 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl'>
                <div className='text-center'>
                    <div className='mb-6'>
                        <Avatar className='mx-auto mb-4 h-20 w-20'>
                            <AvatarImage src={callerImage} alt={callerName} />
                            <AvatarFallback>
                                {callerName?.charAt(0) || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <h3 className='mb-1 text-xl font-semibold text-gray-900'>
                            {callerName}
                        </h3>
                        <p className='text-sm text-gray-500'>
                            Incoming call...
                        </p>
                    </div>

                    <div className='mb-6 flex items-center justify-center'>
                        <VideoCallIcon className='mr-2 h-6 w-6 text-blue-500' />
                        <span className='text-gray-600'>Video Call</span>
                    </div>

                    <div className='flex gap-3'>
                        <Button
                            onClick={handleAccept}
                            disabled={isProcessing}
                            className='h-12 flex-1 rounded-full bg-green-500 text-white hover:bg-green-600'
                        >
                            <PhoneCallIcon className='mr-2 h-5 w-5' />
                            Accept
                        </Button>

                        <Button
                            onClick={handleDecline}
                            disabled={isProcessing}
                            variant='outline'
                            className='h-12 flex-1 rounded-full border-red-500 text-red-500 hover:bg-red-50'
                        >
                            <CloseIcon className='mr-2 h-5 w-5' />
                            Decline
                        </Button>
                    </div>

                    {isProcessing && (
                        <div className='mt-4 text-sm text-gray-500'>
                            Processing...
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default IncomingCallListener
