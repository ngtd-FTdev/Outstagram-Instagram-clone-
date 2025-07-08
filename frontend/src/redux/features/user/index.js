import { createSlice } from '@reduxjs/toolkit'

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        byId: {}, // userId -> user info
    },
    reducers: {
        setUsers: (state, action) => {
            const usersArray = action.payload
            usersArray.forEach(user => {
                if (user?._id && !state.byId[user._id]?._id) {
                    state.byId[user._id] = {
                        ...state.byId[user._id],
                        ...user,
                    }
                }
            })
        },
        setIsFollowing: (state, action) => {
            const { userId, value } = action.payload
            if (state.byId[userId]) {
                state.byId[userId].isFollowingAuthor = value
            }
        },
    },
})

export const { setUsers, setIsFollowing } = usersSlice.actions
export default usersSlice.reducer
