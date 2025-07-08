import { createSlice } from '@reduxjs/toolkit'

const messageSlice = createSlice({
    name: 'message',
    initialState: {
        conversations: [],
        messages: {}, // { groupId1: [ {message}, {message} ] }
        currentGroupId: null, // Group chat đang mở
        loadingMessages: false,
        error: null,
        userConversations: {}, // { groupId1: { userId: { ...userData } } }
        chatId: null,
    },
    reducers: {
        setChatId: (state, action) => {
            state.chatId = action.payload
        },
        setConversations: (state, action) => {
            state.conversations = action.payload
        },
        setAddNewMessage: (state, action) => {
            const { groupId, message } = action.payload
            state.messages[groupId].push(message)
        },
        setUserConversations: (state, action) => {
            const { groupId, userData } = action.payload
            state.userConversations[groupId] = userData
        },
        setMessages: (state, action) => {
            const { groupId, messages } = action.payload
            state.messages[groupId] = messages
        },
        addMessages: (state, action) => {
            const { groupId, message } = action.payload
            state.messages[groupId] = [...state.messages, message]
        },
        addMessage: (state, action) => {
            const { groupId, message } = action.payload
            if (!state.messages[groupId]) state.messages[groupId] = []
            state.messages[groupId].push(message)
        },
        appendMessages: (state, action) => {
            const { groupId, messages: olderMessages } = action.payload;
            if (!state.messages[groupId]) {
                state.messages[groupId] = olderMessages;
            } else {
                state.messages[groupId] = [...olderMessages, ...state.messages[groupId]];
            }
        },
        setCurrentGroup: (state, action) => {
            state.currentGroupId = action.payload
        },
        setLoadingMessages: (state, action) => {
            state.loadingMessages = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        clearMessagesForGroup: (state, action) => {
            const groupId = action.payload
            if (state.messages[groupId]) {
                delete state.messages[groupId]
            }
        },
    }
})

export const {
    setConversations,
    setUserConversations,
    setMessages,
    addMessage,
    appendMessages,
    setAddNewMessage,
    setCurrentGroup,
    setLoadingMessages,
    setError,
    setChatId,
    clearMessagesForGroup,
} = messageSlice.actions

export default messageSlice.reducer
