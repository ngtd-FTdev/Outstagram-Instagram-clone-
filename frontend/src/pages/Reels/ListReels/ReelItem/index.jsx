import MutedIcon from '@/assets/icons/mutedIcon.svg?react'
import UnMutedIcon from '@/assets/icons/unmutedIcon.svg?react'
import AudioImgIcon from '@/assets/icons/AudioImgIcon.svg?react'
import formatCaption from '@/helpers/formatCaption'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer' // Import thư viện
import { Link, useNavigate } from 'react-router-dom'
import ButtonReel from './ButtonReell'
import { useSelector } from 'react-redux'
import VerifiedIcon from '@/assets/icons/verifiedIcon.svg?react'
import RenderFormattedText from '@/components/RenderFormattedText'

function ReelItem({ isMute, id, data }) {
    const { user } = useSelector(state => state.auth)
    const dataUser = useSelector(state => state.users.byId[data?.author?._id])

    let isPostForUser = user?._id === data?.author?._id
    const [ísCaptionShort, setIsCCaptionShort] = useState(false)
    const [caption, setCaption] = useState(false)
    const [a, setA] = useState('')
    const videoRef = useRef(null)
    const [isMuted, setIsMuted] = useState(isMute)

    const navigate = useNavigate()

    const { ref, inView } = useInView({
        threshold: 0.5,
    })

    const [showFullCaption, setShowFullCaption] = useState(false)
    const MAX_LENGTH = 30
    const SHORT_CAPTION_LENGTH = 13
    const captionText = data?.caption || ''
    const isLongCaption = captionText.length > MAX_LENGTH
    const shortCaption = isLongCaption
        ? captionText.slice(0, SHORT_CAPTION_LENGTH) + '...'
        : captionText

    const handleVideoClick = () => {
        if (showFullCaption) {
            setShowFullCaption(false)
        } else {
            const video = videoRef.current
            if (video) {
                if (video.paused) {
                    video.play()
                } else {
                    video.pause()
                }
            }
        }
    }

    useEffect(() => {
        setCaption(formatCaption(a))
    }, [a])

    useEffect(() => {
        const videoElement = videoRef.current
        if (videoElement) {
            if (inView) {
                if (videoElement.paused) {
                    videoElement.play().catch(error => {
                        console.log('Video play error:', error)
                    })
                }
            } else {
                videoElement.pause()
            }
        }
    }, [inView, videoRef.current])

    const handleToggleMute = e => {
        e.stopPropagation()
        setIsMuted(prev => !prev)
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted
        }
    }

    return (
        <div className='scroll-snap-align-center flex h-fit w-full justify-center px-8'>
            <div className='flex h-[90vh] justify-center'>
                <div
                    onClick={handleVideoClick}
                    className='relative flex aspect-[9/16] overflow-hidden shadow-xl/30 items-center justify-center rounded'
                >
                    <video
                        className='absolute h-full w-[110%] max-w-[110%] border-none object-cover opacity-30 blur-[30px] filter duration-300'
                        src={data?.media?.[0]?.url_media}
                        alt=''
                    />
                    <div
                        className='relative h-full w-full overflow-hidden rounded-[4px]'
                        ref={ref}
                    >
                        <video
                            ref={el => {
                                videoRef.current = el
                            }}
                            className='h-full w-full'
                            src={data?.media?.[0]?.url_media}
                            preload='metadata'
                            muted={isMuted}
                            loop
                            // autoPlay
                            loading='lazy'
                        ></video>
                    </div>
                    <div className='absolute inset-0 flex h-full w-full cursor-pointer flex-col justify-between'>
                        <div className='mr-2 mt-2 flex flex-col items-end'>
                            <div
                                className='flex h-8 w-8 items-center justify-center rounded-full bg-[--grey-2-2] hover:bg-[--grey-2-3]'
                                onClick={e => handleToggleMute(e)}
                                style={{ cursor: 'pointer' }}
                            >
                                {isMuted ? (
                                    <MutedIcon className='h-4 w-4' />
                                ) : (
                                    <UnMutedIcon className='h-4 w-4' />
                                )}
                            </div>
                        </div>
                        <div className='flex w-full flex-grow flex-row items-end justify-start p-4'>
                            <div
                                className={`mr-2 flex flex-grow flex-col overflow-y-hidden ${ísCaptionShort ? 'max-h-[112px]' : 'max-h-[50%]'}`}
                            >
                                <div className='flex items-center justify-start'>
                                    <Link to={`/${dataUser?.username}`}>
                                        <div className='flex items-center justify-start'>
                                            <div className='mr-3 h-8 w-8 overflow-hidden rounded-full bg-[--ig-secondary-background]'>
                                                <span>
                                                    <img
                                                        className='h-full w-full object-cover'
                                                        src={
                                                            dataUser
                                                                ?.profile_pic_url
                                                        }
                                                        alt={
                                                            dataUser
                                                                ?.username
                                                        }
                                                    />
                                                </span>
                                            </div>
                                            <span className='whitespace-pre-line break-words text-sm font-semibold text-[--web-always-white]'>
                                                {dataUser?.username}
                                            </span>
                                        </div>
                                    </Link>
                                    {!isPostForUser && (
                                        <div className='flex items-center justify-start'>
                                            <span className='mx-[6px] text-sm text-[--web-always-white]'>
                                                &#8226;
                                            </span>
                                            <div className='flex h-8 w-auto items-center justify-center rounded-lg border-[1px] border-[--ig-stroke] border-opacity-50 px-[6px] text-center text-sm text-[--web-always-white]'>
                                                {dataUser?.isFollowingAuthor
                                                    ? 'Follow'
                                                    : 'Follwing'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {captionText && (
                                    <div className='mt-4 inline-block max-w-full overflow-y-auto leading-4'>
                                        <div className='mr-1 inline-block'>
                                            <Link
                                                to={`/${dataUser?.username}`}
                                                className='flex flex-row'
                                            >
                                                <span className='text-sm font-semibold leading-[18px] text-[--web-always-white]'>
                                                    {dataUser?.username}
                                                </span>
                                                <div className='ml-1 flex items-center leading-[18px]'>
                                                    <VerifiedIcon className='h-3 w-3' />
                                                </div>
                                            </Link>
                                        </div>
                                        <span className='text-sm leading-[18px] text-[--web-always-white]'>
                                            <span
                                                className='text-sm leading-none'
                                                dir='auto'
                                            >
                                                <RenderFormattedText
                                                    text={
                                                        showFullCaption
                                                            ? captionText
                                                            : shortCaption
                                                    }
                                                />
                                                {isLongCaption &&
                                                    !showFullCaption && (
                                                        <span
                                                            className='cursor-pointer text-[--ig-secondary-text]'
                                                            onClick={e => {
                                                                e.stopPropagation()
                                                                setShowFullCaption(
                                                                    true
                                                                )
                                                            }}
                                                        >
                                                            more
                                                        </span>
                                                    )}
                                            </span>
                                        </span>
                                    </div>
                                )}
                                <div className='mt-4 flex flex-grow cursor-pointer items-center overflow-hidden'>
                                    <Link
                                        className='flex-grow'
                                        to='/reels/audio/id'
                                    >
                                        <div className='flex flex-grow items-center justify-center gap-1 overflow-hidden rounded-[20px] border border-[--border-reels-audio] bg-[--bg-reels-audio] px-[10px] py-[5px] text-sm text-[--ig-text-on-media] backdrop-blur-[16px]'>
                                            <div className='h-3 w-3'>
                                                <AudioImgIcon className='h-3 w-3' />
                                            </div>
                                            <div className='flex-grow text-sm text-white'>
                                                codacothitt · Original audio
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mb-1 ml-3 flex w-[60px] flex-col items-center justify-end'>
                    <ButtonReel data={data} />
                </div>
            </div>
        </div>
    )
}

export default ReelItem
