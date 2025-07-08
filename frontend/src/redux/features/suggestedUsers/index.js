import { createSlice } from '@reduxjs/toolkit'

const suggestedUsersOptions = createSlice({
    name: 'sidebarOptions',
    initialState: {
        suggestedUsers: []
    },
    reducers: {
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload
        },
    },
})

export const { setSuggestedUsers } = suggestedUsersOptions.actions
export default suggestedUsersOptions.reducer
