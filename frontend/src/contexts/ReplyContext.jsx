import { createContext, useContext, useRef, useState } from 'react'

const ReplyContext = createContext()

export function ReplyProvider({ children }) {
    const [replyData, setReplyData] = useState(null)
    const inputRef = useRef(null)

    const handleReply = (data) => {
        setReplyData(data)
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    const handleClearReply = () => {
        setReplyData(null)
    }

    const handleFocusInput = () => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    return (
        <ReplyContext.Provider value={{ replyData, inputRef, handleReply, handleClearReply, handleFocusInput }}>
            {children}
        </ReplyContext.Provider>
    )
}

export function useReply() {
    const context = useContext(ReplyContext)
    if (!context) {
        throw new Error('useReply must be used within a ReplyProvider')
    }
    return context
} 