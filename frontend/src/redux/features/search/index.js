import { createSlice } from '@reduxjs/toolkit'

const searchUser = createSlice({
    name: 'searchUser',
    initialState: {
        recentSearches: [],
    },
    reducers: {
        setRecentSearches: (state, action) => {
            const newUser = action.payload.user;
            const existingIndex = state.recentSearches.findIndex(
                user => user._id === newUser._id
            );
            
            if (existingIndex !== -1) {
                state.recentSearches.splice(existingIndex, 1);
                state.recentSearches.unshift(newUser);
            } else {
                state.recentSearches.unshift(newUser);
            }
        },
        clearRecentSearches: state => {
            state.recentSearches = []
        },
        deleteUserRecentSearch: (state, action) => {
            state.recentSearches = state.recentSearches.filter(
                user => user._id !== action.payload.userId
            );
        }
    },
})

export const {
    setRecentSearches,
    clearRecentSearches,
    deleteUserRecentSearch,
} = searchUser.actions
export default searchUser.reducer
