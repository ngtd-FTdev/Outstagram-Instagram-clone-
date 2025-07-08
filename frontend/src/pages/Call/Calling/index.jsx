import FullScreenIcon from '@/assets/icons/FullScreenIcon.svg?react'
import SettingCallIcon from '@/assets/icons/SettingCallIcon.svg?react'
import ShareScreenIcon from '@/assets/icons/ShareScreenIcon.svg?react'
import VideoCallOffIcon from '@/assets/icons/VideoCallOffIcon.svg?react'
import VideoCallOnIcon from '@/assets/icons/VideoCallOnIcon.svg?react'
import VoiceCallOnIcon from '@/assets/icons/VoiceCallOnIcon.svg?react'
import VoiceCallOffIcon from '@/assets/icons/VoiceCallOffIcon.svg?react'
import PhoneCallIcon from '@/assets/icons/phoneIcon.svg?react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState } from 'react'
import useMouseStop from '@/hooks/useMouseStop'
import { motion } from 'framer-motion'
import { CallingState, useCallStateHooks } from '@stream-io/video-react-sdk'
import { ParticipantsGrid } from '@/components/VideoCall/Paginate'
import { useConversationDisplayName } from '@/hooks/useConversationDisplayName'

function Calling({
    call,
    mediaSettings,
    setMediaSettings,
    dataConversation,
    onLeaveCall,
    onEndCall,
}) {
    const {
        useCameraState,
        useMicrophoneState,
        useCallCallingState,
        useParticipants,
        useCallEndedAt,
        useIsCallLive,
    } = useCallStateHooks()

    const { camera, isMute: isCameraMute } = useCameraState()
    const { microphone, isMute: isMicMute } = useMicrophoneState()
    const callingState = useCallCallingState()
    const endedAt = useCallEndedAt()
    const isLive = useIsCallLive()
    const remoteParticipants = useParticipants()
    const [hidenLayout, setHidenLayout] = useState(false)
    const [isEnding, setIsEnding] = useState(false)
    const divRef = useRef(null)

    const { chatName, avatar } = useConversationDisplayName(dataConversation)

    useMouseStop(
        divRef,
        () => setHidenLayout(false),
        () => setHidenLayout(true),
        1500
    )

    const handleToggleCamera = () => {
        camera.toggle()
        setMediaSettings(prev => ({ ...prev, video: !isCameraMute }))
    }

    const handleToggleMicrophone = () => {
        microphone.toggle()
        setMediaSettings(prev => ({ ...prev, audio: !isMicMute }))
    }

    const handleEndCall = async () => {
        if (isEnding) return

        try {
            setIsEnding(true)

            if (call && callingState !== CallingState.LEFT) {
                if (remoteParticipants.length === 0) {
                    await onEndCall()
                } else {
                    await onLeaveCall()
                }
            }
        } catch (error) {
            console.error('Failed to end call:', error)
        } finally {
            setIsEnding(false)
        }
    }

    const handleShareScreen = async () => {
        try {
            console.log('Screen sharing not implemented yet')
        } catch (error) {
            console.error('Failed to share screen:', error)
        }
    }

    const handleFullScreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen()
        } else {
            document.documentElement.requestFullscreen()
        }
    }

    if (endedAt) {
        return (
            <div className='flex h-screen items-center justify-center bg-black text-white'>
                <div className='text-center'>
                    <h2 className='mb-2 text-2xl font-bold'>Call Ended</h2>
                    <p className='text-gray-400'>The call has ended</p>
                </div>
            </div>
        )
    }

    if (!isLive && remoteParticipants.length === 0) {
        return (
            <div className='flex h-screen items-center justify-center bg-black text-white'>
                <div className='text-center'>
                    <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-white'></div>
                    <p>Connecting...</p>
                </div>
            </div>
        )
    }

    return (
        <div
            ref={divRef}
            className='relative flex h-full flex-col bg-black text-white'
        >
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: hidenLayout ? 0 : 1 }}
                transition={{ duration: 0.5 }}
                className='absolute left-0 right-0 top-0 z-10 flex items-center justify-between bg-black/20 p-4 backdrop-blur-sm'
            >
                <div className='flex items-center space-x-3'>
                    <Avatar className='h-10 w-10'>
                        <AvatarImage src={avatar} alt={chatName} />
                        <AvatarFallback>
                            {chatName?.charAt(0) || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <span className='font-semibold text-white'>
                            {chatName}
                        </span>
                        <div className='text-sm text-gray-300'>
                            {remoteParticipants.length > 0
                                ? `${remoteParticipants.length} participant(s)`
                                : 'Connecting...'}
                        </div>
                    </div>
                </div>

                <div className='flex items-center space-x-2'>
                    <Button
                        onClick={handleShareScreen}
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-white hover:bg-white/20'
                    >
                        <ShareScreenIcon className='h-6 w-6' />
                    </Button>
                    <Button
                        onClick={handleFullScreen}
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-white hover:bg-white/20'
                    >
                        <FullScreenIcon className='h-6 w-6' />
                    </Button>
                    <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-white hover:bg-white/20'
                    >
                        <SettingCallIcon className='h-6 w-6' />
                    </Button>
                </div>
            </motion.div>
            <div className='flex flex-1 flex-col items-center justify-center'>
                {remoteParticipants.length === 0 ? (
                    <div className='text-center'>
                        <div className='m-4 flex items-center justify-center rounded-full bg-gray-700 p-8'>
                            <Avatar className='h-[100px] w-[100px]'>
                                <AvatarImage src={avatar} alt={chatName} />
                                <AvatarFallback>
                                    {chatName?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className='mt-4'>
                            <h1 className='text-center text-2xl font-bold text-white'>
                                {chatName}
                            </h1>
                            <p className='my-2 text-[13px] text-gray-400'>
                                Calling...
                            </p>
                        </div>
                    </div>
                ) : (
                    <ParticipantsGrid participants={remoteParticipants} />
                )}
            </div>
            <div className='absolute bottom-0 left-0 right-0 grid grid-cols-3 p-4'>
                <div></div>

                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: hidenLayout ? 0 : 1 }}
                    transition={{ duration: 0.5 }}
                    className='flex items-center justify-center space-x-4'
                >
                    <Button
                        onClick={handleShareScreen}
                        variant='ghost'
                        size='icon'
                        className='flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600'
                    >
                        <ShareScreenIcon className='h-6 w-6 text-white' />
                    </Button>

                    <Button
                        onClick={handleToggleCamera}
                        variant='ghost'
                        size='icon'
                        className='flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600'
                    >
                        {isCameraMute ? (
                            <VideoCallOffIcon className='h-8 w-8 text-white' />
                        ) : (
                            <VideoCallOnIcon className='h-8 w-8 text-white' />
                        )}
                    </Button>

                    <Button
                        onClick={handleToggleMicrophone}
                        variant='ghost'
                        size='icon'
                        className='flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600'
                    >
                        {isMicMute ? (
                            <VoiceCallOffIcon className='h-6 w-6 text-white' />
                        ) : (
                            <VoiceCallOnIcon className='h-6 w-6 text-white' />
                        )}
                    </Button>

                    <Button
                        onClick={handleEndCall}
                        disabled={isEnding}
                        variant='ghost'
                        size='icon'
                        className='flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-red-500 hover:bg-red-600 disabled:opacity-50'
                    >
                        <PhoneCallIcon className='h-8 w-8 text-white' />
                    </Button>
                </motion.div>

                {/* <div className='flex justify-end'>
                    <div className='h-24 w-24 overflow-hidden rounded-lg border-2 border-white/20'>
                        <Avatar className='h-full w-full'>
                            <AvatarImage
                                src={localParticipant?.image}
                                alt='You'
                            />
                            <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                        <ParticipantView
                            participant={participant}
                            ParticipantViewUI={CustomParticipantViewUI}
                            VideoPlaceholder={CustomVideoPlaceholder}
                            className='h-full w-full'
                        />
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default Calling
