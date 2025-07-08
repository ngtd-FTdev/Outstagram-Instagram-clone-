import { createContext, useContext, useState } from 'react'

const ReplyMessageContext = createContext()

export function ReplyMessageProvider({ children }) {
    const [replyMessage, setReplyMessage] = useState({
        id: null,
        type: null,
        content: null,
        originalSender: null,
        fullname: null
    })

    const setReply = (message) => {
        setReplyMessage(message)
    }

    const clearReply = () => {
        setReplyMessage({
            id: null,
            type: null,
            content: null,
            originalSender: null,
            fullname: null
        })
    }

    return (
        <ReplyMessageContext.Provider value={{ replyMessage, setReply, clearReply }}>
            {children}
        </ReplyMessageContext.Provider>
    )
}

export function useReplyMessage() {
    const context = useContext(ReplyMessageContext)
    if (!context) {
        throw new Error('Something went wrong!')
    }
    return context
}
