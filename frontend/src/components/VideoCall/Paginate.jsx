import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    hasScreenShare,
    ParticipantView,
    useParticipantViewContext,
} from '@stream-io/video-react-sdk'
import '@/components/VideoCall/index.css'

const CustomParticipantViewUI = () => null

const CustomVideoPlaceholder = ({ style }) => {
    const { participant } = useParticipantViewContext()

    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...style,
            }}
        >
            {/* Lớp nền mờ */}
            <div
                style={{
                    position: 'absolute',
                    backgroundImage: `url(${participant.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    inset: 0,
                    zIndex: 1,
                }}

                className='blur-md'
            />
            {/* Avatar */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 2,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 0 4px #fff, 0 2px 16px rgba(0,0,0,0.15)',
                    overflow: 'hidden',
                }}
            >
                {participant.image ? (
                    <img
                        src={participant.image}
                        alt={participant.id}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50%',
                        }}
                    />
                ) : (
                    <span
                        style={{
                            fontSize: 32,
                            color: '#333',
                            fontWeight: 600,
                        }}
                    >
                        {participant.name || participant.id}
                    </span>
                )}
            </div>
        </div>
    )
}

const splitParticipantsToRows = participants => {
    const count = participants.length
    if (count <= 1) return [[...participants]]
    if (count <= 6) {
        const mid = Math.ceil(count / 2)
        return [participants.slice(0, mid), participants.slice(mid)]
    } else {
        const firstRow = Math.ceil(count / 3)
        const secondRow = Math.ceil((count - firstRow) / 2)
        return [
            participants.slice(0, firstRow),
            participants.slice(firstRow, firstRow + secondRow),
            participants.slice(firstRow + secondRow),
        ]
    }
}

export const ParticipantsGrid = ({ participants }) => {
    const [viewport, setViewport] = useState({ width: 0, height: 0 })

    console.log('participants::', participants)
    useEffect(() => {
        const updateSize = () =>
            setViewport({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        updateSize()
        window.addEventListener('resize', updateSize)
        return () => window.removeEventListener('resize', updateSize)
    }, [])

    const screenShareParticipant = participants.find(p => hasScreenShare(p))
    if (screenShareParticipant) {
        return (
            <div className='flex h-full w-full items-center justify-center bg-black'>
                <ParticipantView
                    participant={screenShareParticipant}
                    ParticipantViewUI={null}
                    trackType='screenShareTrack'
                />
            </div>
        )
    }

    const rows = splitParticipantsToRows(participants)
    const rowCount = rows.length

    // Tính chiều cao mỗi dòng (dựa vào viewportHeight)
    const rowHeight = Math.floor(viewport.height / rowCount)
    const videoHeight = rowHeight - 16 // padding/margin
    const videoWidth = Math.floor((videoHeight * 16) / 9)

    return (
        <div className='z-0 flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-black p-2'>
            {rows.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className='flex w-full items-center justify-center gap-4'
                    style={{ height: `${videoHeight}px` }}
                >
                    <AnimatePresence mode='popLayout'>
                        {row.map(participant => (
                            <motion.div
                                key={participant.sessionId}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className='relative flex items-center justify-center overflow-hidden rounded-xl bg-black shadow-lg'
                                style={{
                                    width: `${videoWidth}px`,
                                    height: `${videoHeight}px`,
                                }}
                            >
                                <ParticipantView
                                    participant={participant}
                                    ParticipantViewUI={CustomParticipantViewUI}
                                    VideoPlaceholder={CustomVideoPlaceholder}
                                    className='h-full w-full'
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    )
}
