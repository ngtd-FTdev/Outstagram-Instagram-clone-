import { baseApi } from '@/api/rtkApi'

export const authApiSlice = baseApi.injectEndpoints({
    endpoints: builder => ({
        followUser: builder.mutation({
            query: targetUserId => ({
                url: `/user/followUser/${targetUserId}`,
                method: 'PATCH',
                userIdHeader: true,
            }),
        }),
        unFollowUser: builder.mutation({
            query: targetUserId => ({
                url: `/user/unFollowUser/${targetUserId}`,
                method: 'PATCH',
                userIdHeader: true,
            }),
        }),
        blockUser: builder.mutation({
            query: targetUserId => ({
                url: `/user/blockUser/${targetUserId}`,
                method: 'PATCH',
                userIdHeader: true,
            }),
        }),
        unBlockUser: builder.mutation({
            query: targetUserId => ({
                url: `/user/unblockUser/${targetUserId}`,
                method: 'PATCH',
                userIdHeader: true,
            }),
        }),
        getSuggestedUsers: builder.mutation({
            query: (limit = 5) => ({
                url: `/user/suggested/?limit=${limit}`,
                method: 'GET',
                userIdHeader: true,
            }),
        }),
        searchUsers: builder.query({
            query: ({ q, limit = 10 }) => ({
                url: '/user/search',
                method: 'GET',
                params: { q, limit },
                userIdHeader: true,
            }),
        }),
        getUserProfile: builder.mutation({
            query: (otherUserId) => ({
                url: `/user/profile/${otherUserId}`,
                method: 'GET',
                userIdHeader: true,
            }),
        }),
        getUserProfilePublic: builder.query({
            query: (otherUserId) => ({
                url: `/user/profile/${otherUserId}/public`,
                method: 'GET',
            }),
        }),
        getSuggestedChat: builder.mutation({
            query: (limit = 10) => ({
                url: `/user/following/conversation${limit ? `?limit=${limit}` : ''}`,
                method: 'GET',
                userIdHeader: true,
            }),
        }),
        editProfilePicture: builder.mutation({
            query: (formData) => ({
                url: '/user/profile/editProfilePic',
                method: 'PATCH',
                data: formData,
                userIdHeader: true,
            }),
        }),
        editUserProfile: builder.mutation({
            query: (body) => ({
                url: '/user/profile/editProfile',
                method: 'PATCH',
                data: body,
                userIdHeader: true,
            }),
        }),
    }),
})

export const {
    useFollowUserMutation,
    useUnFollowUserMutation,
    useBlockUserMutation,
    useUnBlockUserMutation,
    useGetSuggestedUsersMutation,
    useSearchUsersQuery,
    useGetUserProfileMutation,
    useGetUserProfilePublicQuery,
    useEditProfilePictureMutation,
    useEditUserProfileMutation,
    useGetSuggestedChatMutation,
} = authApiSlice
