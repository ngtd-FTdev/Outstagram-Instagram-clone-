import { createSlice } from '@reduxjs/toolkit'

const sidebarOptions = createSlice({
    name: 'sidebarOptions',
    initialState: {
        isOpenDrawer: false,
        isOpenSearch: false,
        isOpenNoti: false,
        nameModal: 'Create',
    },
    reducers: {
        ToggleSearchDrawer: state => {
            state.isOpenSearch = !state.isOpenSearch
            state.isOpenDrawer = state.isOpenSearch
            if (state.isOpenNoti) {
                state.isOpenNoti = false
            }
        },
        ToggleNotiDrawer: state => {
            state.isOpenNoti = !state.isOpenNoti
            state.isOpenDrawer = state.isOpenNoti
            if (state.isOpenSearch) {
                state.isOpenSearch = false
            }
        },
        CloseDrawer: state => {
            state.isOpenSearch = false
            state.isOpenNoti = false
            state.isOpenDrawer = false
        },
    },
})

export const { ToggleSearchDrawer, ToggleNotiDrawer, CloseDrawer } =
    sidebarOptions.actions
export default sidebarOptions.reducer
