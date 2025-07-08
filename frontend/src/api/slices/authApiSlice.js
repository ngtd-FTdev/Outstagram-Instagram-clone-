import { baseApi } from '@/api/rtkApi'

export const authApiSlice = baseApi.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/access/user/login',
                method: 'POST',
                data: { ...credentials },
            }),
        }),
        signUp: builder.mutation({
            query: credentials => ({
                url: '/access/user/signup',
                method: 'POST',
                data: { ...credentials },
            }),
        }),
        checkAuth: builder.mutation({
            query: credentials => ({
                url: '/access/user/checkAuth',
                method: 'POST',
                userIdHeader: true,
                data: { ...credentials },
            }),
        }),
        changePassword: builder.mutation({
            query: ({ oldPassword, newPassword }) => ({
                url: '/access/user/changePassword',
                method: 'POST',
                data: { oldPassword, newPassword },
                userIdHeader: true,
            }),
        }),
    }),
})

export const { useLoginMutation, useSignUpMutation, useCheckAuthMutation, useChangePasswordMutation } = authApiSlice
