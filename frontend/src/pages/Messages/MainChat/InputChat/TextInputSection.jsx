import EmojiPicker from '@/components/EmojiPicker'
import VoiceClipIcon from '@/assets/icons/VoiceClipIcon.svg?react'
import ChooseAnEmojiIcon from '@/assets/icons/ChooseAnEmojiIcon.svg?react'
import AddMedia from '@/assets/icons/AddMedia.svg?react'
import ChooseAGIFOrSticker from '@/assets/icons/ChooseAGIFOrSticker.svg?react'
import HeartIcon from '@/assets/icons/heartIcon.svg?react'
import { useEffect, useRef, useState } from 'react'
import GifStickerPicker from '@/components/GifStickerPicker'
import { useSendMessageMutation } from '@/api/slices/messageApiSlide'

const TextInputSection = ({
    chatId,
    value,
    onChange,
    onVoiceClick,
    onMediaClick,
    onSend,
    showSendButton,
    onGifStickerSelect,
    replyMessage,
    disabled = false,
}) => {
    const [isScrollHidden, setIsScrollHidden] = useState(false)
    const [sendMessage, { isLoading }] = useSendMessageMutation()

    const inputChatRef = useRef()

    const handleInput = e => {
        e.target.style.height = '20px'
        const scHeight = e.target.scrollHeight
        if (e.target.style.height !== `${scHeight}px`) {
            e.target.style.height = `${scHeight}px`
        }

        setIsScrollHidden(scHeight <= 90)

        onChange(e.target.value)
    }

    const onSendMessageHeart = async () => {
        if (isLoading) return
        await sendMessage({
            dataChat: {
                text: '❤️',
            },
            conversationId: chatId,
        })
    }

    useEffect(() => {
        if (!value) {
            const textarea = inputChatRef.current
            if (textarea) textarea.style.height = '20px'
        }
    }, [value])

    const handleEmojiSelect = emoji => {
        onChange(value + emoji)
    }

    const handleGifStickerSelect = async item => {
        await sendMessage({
            dataChat: { gifUrl: item.url },
            conversationId: chatId,
        })
    }

    return (
        <div className='flex w-full items-end'>
            <div className='flex flex-1 items-end'>
                <EmojiPicker onEmojiClick={handleEmojiSelect}>
                    <div className='mb-[6px] cursor-pointer self-end p-1 active:opacity-50'>
                        <ChooseAnEmojiIcon
                            className='h-[24px] w-[24px] text-[--ig-primary-text]'
                            aria-label='Choose an emoji'
                        />
                    </div>
                </EmojiPicker>

                <div className='my-3 ml-2 mr-1 flex flex-grow self-end'>
                    <textarea
                        ref={inputChatRef}
                        placeholder='Message...'
                        className={`order-1 h-[20px] max-h-[140px] min-h-[20px] w-full flex-1 resize-none overflow-auto bg-[--ig-primary-background] text-[15px] leading-[18px] text-[--ig-primary-text] placeholder-[--ig-secondary-text] focus:outline-none ${
                            isScrollHidden ? 'scroll-bar-0' : ''
                        }`}
                        value={value}
                        onChange={handleInput}
                        aria-label='Message input'
                        disabled={disabled}
                    />
                </div>
            </div>

            {showSendButton ? (
                <button
                    onClick={onSend}
                    className='mb-[13px] self-end font-medium text-[#0095F6]'
                    aria-label='Send message'
                    disabled={disabled}
                >
                    Send
                </button>
            ) : (
                <div className='flex items-center'>
                    <button
                        onClick={onVoiceClick}
                        className='p-2 text-[--ig-primary-text] active:opacity-50'
                        aria-label='Voice message'
                        disabled={disabled}
                    >
                        <VoiceClipIcon className='h-[24px] w-[24px]' />
                    </button>
                    {!replyMessage?.id && (
                        <>
                            <button
                                onClick={onMediaClick}
                                className='p-2 text-[--ig-primary-text] active:opacity-50'
                                aria-label='Add photo or video'
                                disabled={disabled}
                            >
                                <AddMedia className='h-[24px] w-[24px]' />
                            </button>
                            <GifStickerPicker onSelect={handleGifStickerSelect}>
                                <button
                                    className='p-2 text-[--ig-primary-text] active:opacity-50'
                                    aria-label='Choose a GIF or sticker'
                                    disabled={disabled}
                                >
                                    <ChooseAGIFOrSticker className='h-[24px] w-[24px]' />
                                </button>
                            </GifStickerPicker>
                        </>
                    )}
                    <button
                        onClick={onSendMessageHeart}
                        className='p-2 text-[--ig-primary-text] active:opacity-50'
                        aria-label='Like'
                        disabled={disabled || isLoading}
                    >
                        <HeartIcon className='h-[24px] w-[24px]' />
                    </button>
                </div>
            )}
        </div>
    )
}

export default TextInputSection
