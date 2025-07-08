import { isOnlyEmojisAndSpaces } from '@/utils/algorithms'
import VoiceMessage from './VoiceMessage'

/* eslint-disable indent */
const MessageContent = ({ message, isCurrentUser }) => {
    if (message.messageType === 'text') {
        const isOnlyEmoji = isOnlyEmojisAndSpaces(message?.text)

        if (isOnlyEmoji) {
            return (
                <div
                    className={`max-w-[564px] px-[12px] py-[7px] shadow-sm ${
                        isCurrentUser ? 'order-2' : ''
                    }`}
                >
                    <span className='text-[50px] leading-[60px]'>
                        {message.text}
                    </span>
                </div>
            )
        }

        let styleCl = ''
        if (message.isFirstMessage) {
            styleCl = isCurrentUser
                ? 'rounded-l-[18px] rounded-br-[4px] rounded-tr-[18px]'
                : 'rounded-r-[18px] rounded-bl-[4px] rounded-tl-[18px]'
        } else if (message.isLastMessage) {
            styleCl = isCurrentUser
                ? 'rounded-l-[18px] rounded-br-[18px] rounded-tr-[4px]'
                : 'rounded-r-[18px] rounded-bl-[18px] rounded-tl-[4px]'
        } else if (message.isOnly) {
            styleCl = 'rounded-[18px]'
        } else {
            styleCl = isCurrentUser
                ? 'rounded-l-[18px] rounded-r-[4px]'
                : 'rounded-r-[18px] rounded-l-[4px]'
        }

        return (
            <div
                className={`max-w-[564px] px-[12px] py-[7px] shadow-sm ${
                    isCurrentUser
                        ? 'order-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                        : 'bg-[--ig-highlight-background] text-[--ig-primary-text]'
                } ${styleCl}`}
            >
                <p className='whitespace-pre-wrap break-words text-[15px] leading-5'>
                    {message.text}
                </p>
            </div>
        )
    }

    if (message.messageType === 'system') {
        return (
            <div className='text-center text-sm italic text-gray-500'>
                {message.system_type === 'user_joined' &&
                    'User joined the conversation'}
                {message.system_type === 'user_left' &&
                    'User left the conversation'}
                {message.system_type === 'name_changed' &&
                    'Conversation name was changed'}
                {message.system_type === 'other' && message.message}
            </div>
        )
    }

    if (message.messageType === 'voice') {
        return (
            <VoiceMessage
                audioUrl={message?.audioUrl}
                isCurrentUser={isCurrentUser}
            />
        )
    }

    return (
        <>
            {message.messageType === 'image' && (
                <div
                    className={`relative max-h-[--max-h-media-message] max-w-[--max-w-media-message] ${isCurrentUser ? 'order-2' : ''}`}
                >
                    <img
                        src={
                            message.mediaUrl || 'https://github.com/shadcn.png'
                        }
                        alt='Media content'
                        loading='lazy'
                        className='max-w-full rounded-lg'
                        onError={e => {
                            e.target.src = '/default-image.png'
                        }}
                    />
                </div>
            )}
            {message.messageType === 'gif' && (
                <div
                    className={`relative max-h-[--max-h-media-message] max-w-[--max-w-media-message] ${isCurrentUser ? 'order-2' : ''}`}
                >
                    <img
                        src={
                            message.gifUrl || 'https://github.com/shadcn.png'
                        }
                        alt='Media content'
                        loading='lazy'
                        className='max-w-full rounded-lg'
                        onError={e => {
                            e.target.src = '/default-image.png'
                        }}
                    />
                </div>
            )}
            {message.messageType === 'video' && (
                <div
                    className={`relative max-h-[--max-h-media-message] max-w-[--max-w-media-message] ${isCurrentUser ? 'order-2' : ''}`}
                >
                    <video
                        src={message.mediaUrl}
                        controls
                        className='max-w-full rounded-lg'
                    />
                </div>
            )}
        </>
    )
}

export default MessageContent
