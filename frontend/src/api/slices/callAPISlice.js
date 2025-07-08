import { baseApi } from '@/api/rtkApi'

export const callApiSlice = baseApi.injectEndpoints({
    endpoints: builder => ({
        getToken: builder.mutation({
            query: credentials => ({
                url: '/stream/getToken',
                method: 'GET',
                userIdHeader: true,
            }),
        }),
        createCall: builder.mutation({
            query: ({ groupId }) => ({
                url: '/stream/createCall',
                method: 'POST',
                data: { groupId },
                userIdHeader: true,
            }),
        }),
    }),
})

export const { useGetTokenMutation, useCreateCallMutation } = callApiSlice
