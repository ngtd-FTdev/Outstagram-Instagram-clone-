import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: 0,
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1
        },
        decrement: (state) => {
            if (state.value > 0) {
                state.value -= 1
            }
        },
        reset: (state) => {
            state.value = 0
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(incrementAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(incrementAsync.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.userData = action.payload
            })
            .addCase(incrementAsync.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    },
})

export const incrementAsync = createAsyncThunk(
    'counter/incrementAsync',
    async (amount) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return amount
    }
)

export const { increment, decrement, reset } = counterSlice.actions

export default counterSlice.reducer
