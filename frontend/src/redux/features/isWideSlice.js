import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isWide: window.innerWidth > 1265,
    isMobile: window.innerWidth < 767,
}

const isWideSlice = createSlice({
    name: 'isWide',
    initialState,
    reducers: {
        setIsWide(state, action) {
            state.isWide = action.payload
        },
        setIsMobile(state, action) {
            state.isMobile = action.payload
        },
    },
})

export const { setIsWide, setIsMobile } = isWideSlice.actions
export default isWideSlice.reducer
