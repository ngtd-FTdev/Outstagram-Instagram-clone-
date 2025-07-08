import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
    },
    reducers: {
        setUser: (state, action) => {
            const { user, token } = action.payload

            if (user && token) {
                state.user = user
                state.token = token
            }
        },
        logout: state => {
            state.user = null
        },
        setCredentials: (state, action) => {
            const { user } = action.payload
            state.user = user
        },
        setAvatar: (state, action) => {
            if (action.payload) {
                state.user.profile_pic_url = action.payload
            }
        },
        editUserProfile: (state, action) => {
            const { biography, gender } = action.payload
            if (state.user) {
                if (biography !== undefined) state.user.biography = biography
                if (gender !== undefined) state.user.gender = gender
            }
        }
    },
})

export const { logout, setCredentials, setUser, setAvatar, editUserProfile } = authSlice.actions

export default authSlice.reducer

export const selectCurrentAuth = state => state.auth
