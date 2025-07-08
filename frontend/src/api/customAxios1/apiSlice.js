import { logout, setCredentials } from '@/redux/features/auth'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie'

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://api.example.com',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        return headers
    },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.originalStatus === 403) {
        const refreshToken = Cookies.get('refreshToken')

        if (refreshToken) {
            const refreshHeaders = new Headers()
            refreshHeaders.set('r-token', refreshToken)

            const refreshResult = await baseQuery(
                {
                    url: '/refresh',
                    method: 'POST',
                    headers: refreshHeaders,
                },
                api,
                extraOptions
            )

            // Nếu refresh token thành công
            if (refreshResult?.data) {
                const user = api.getState().auth.user

                // Cập nhật token mới vào Redux state
                api.dispatch(setCredentials({ ...refreshResult.data, user }))

                // Gửi lại yêu cầu ban đầu với token mới
                result = await baseQuery(args, api, extraOptions)
            } else {
                // Nếu refresh token thất bại, đăng xuất người dùng
                api.dispatch(logout())
            }
        } else {
            // Nếu không có refresh token, đăng xuất
            api.dispatch(logout())
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({}),
})

export default baseQueryWithReauth
