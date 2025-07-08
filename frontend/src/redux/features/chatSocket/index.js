import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    socket: null,
    isConnected: false,
    error: null,
}

const chatSocketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        socketConnected: (state, action) => {
            state.socket = action.payload
            state.isConnected = true
            state.error = null
        },
        connectionFailed: (state, action) => {
            state.isConnected = false
            state.error = action.payload
        },
        resetSocket: state => {
            state.socket = null
            state.isConnected = false
            state.error = null
        },
        disconnectSocket: state => {
            state.isConnected = false
            state.error = null
        },
    },
})

export const {
    socketConnected,
    connectionFailed,
    resetSocket,
    disconnectSocket,
} = chatSocketSlice.actions
export default chatSocketSlice.reducer
