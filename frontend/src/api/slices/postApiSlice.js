import { baseApi } from '@/api/rtkApi'

export const postApiSlice = baseApi.injectEndpoints({
    endpoints: builder => ({
        getPost: builder.mutation({
            query: postID => ({
                url: `/post/getPost/${postID}`,
                method: 'GET',
                userIdHeader: true,
            }),
        }),
        getListPosts: builder.mutation({
            query: (page = 1) => ({
                url: `/post/getListPosts?page=${page}`,
                method: 'GET',
                userIdHeader: true,
            }),
        }),
        getListPostsForExplore: builder.mutation({
            query: ({ page = 1, firstPostId = null, lastPostId = null, limit = 10 } = {}) => {
                const params = { page };
                if (firstPostId) params.firstPostId = firstPostId;
                if (lastPostId) params.lastPostId = lastPostId;
                if (limit) params.limit = limit;
                return {
                    url: '/post/getListPostsForExplore',
                    method: 'GET',
                    params,
                    userIdHeader: true,
                };
            },
        }),
        likePost: builder.mutation({
            query: postID => ({
                url: `/post/likePost/${postID}`,
                method: 'POST',
                userIdHeader: true,
            }),
        }),
        savePost: builder.mutation({
            query: postID => ({
                url: `/post/savePost/${postID}`,
                method: 'POST',
                userIdHeader: true,
            }),
        }),
        getComments: builder.mutation({
            query: ({ postId, parentId = null, page = 1 }) => ({
                url: `/post/getComments/${postId}?parentId=${parentId}&page=${page}`,
                method: 'GET',
                userIdHeader: true,
            }),
        }),
        addComment: builder.mutation({
            query: ({ postId, text, parentId = null }) => ({
                url: `/post/commentPost/${postId}`,
                method: 'POST',
                data: {
                    text,
                    parentId,
                },
                userIdHeader: true,
            }),
        }),
        likeComment: builder.mutation({
            query: commentId => ({
                url: `/post/likeComment/${commentId}`,
                method: 'POST',
                userIdHeader: true,
            }),
        }),
        getLikesComment: builder.mutation({
            query: ({ commentId, page = 1 }) => ({
                url: `/post/getLikesComment/${commentId}?page=${page}`,
                method: 'GET',
                userIdHeader: true,
            }),
        }),
        getTagUsers: builder.mutation({
            query: query => ({
                url: `/post/createPost/getTagUser/${query}`,
                method: 'GET',
                userIdHeader: true,
            }),
        }),
        createNewPost: builder.mutation({
            query: postData => ({
                url: '/post/createPost',
                method: 'POST',
                data: postData,
                userIdHeader: true,
            }),
        }),
        getExplorePosts: builder.mutation({
            query: (limit = 10) => ({
                url: `/post/explore/random?limit=${limit}`,
                method: 'GET',
                userIdHeader: true,
            }),
        }),
        getListPosts2: builder.mutation({
            query: ({ page = 1, firstPostId = null, lastPostId = null, limit = 10 } = {}) => {
                const params = { page };
                if (firstPostId && page !== 1) params.firstPostId = firstPostId;
                if (lastPostId && page !== 1) params.lastPostId = lastPostId;
                if (limit) params.limit = limit;
                return {
                    url: '/post/getListPosts2',
                    method: 'GET',
                    params,
                    userIdHeader: true,
                };
            },
        }),
        getListReels: builder.mutation({
            query: ({ page = 1, firstPostId = null, lastPostId = null, limit = 10 } = {}) => {
                const params = { page };
                if (firstPostId && page !== 1) params.firstPostId = firstPostId;
                if (lastPostId && page !== 1) params.lastPostId = lastPostId;
                if (limit) params.limit = limit;
                return {
                    url: '/post/getListReels',
                    method: 'GET',
                    params,
                    userIdHeader: true,
                };
            },
        }),
        getPostsByUsername: builder.mutation({
            query: ({ userName, page = 1, limit = 12, lastPostId = null }) => {
                const params = { page, limit };
                if (lastPostId && page !== 1) params.lastPostId = lastPostId;
                return {
                    url: `/post/getPostsByUsername/${userName}`,
                    method: 'GET',
                    params,
                    userIdHeader: true,
                };
            },
        }),
        getReelByUsername: builder.mutation({
            query: ({ userName, page = 1, limit = 12, lastPostId = null }) => {
                const params = { page, limit };
                if (lastPostId && page !== 1) params.lastPostId = lastPostId;
                return {
                    url: `/post/getReelByUsername/${userName}`,
                    method: 'GET',
                    params,
                    userIdHeader: true,
                };
            },
        }),
        deletePost: builder.mutation({
            query: postId => ({
                url: `/post/deletePost/${postId}`,
                method: 'DELETE',
                userIdHeader: true,
            }),
        }),
    }),
});

export const {
    useGetPostMutation,
    useGetListPostsMutation,
    useGetTagUsersMutation,
    useCreateNewPostMutation,
    useLikePostMutation,
    useSavePostMutation,
    useGetCommentsMutation,
    useAddCommentMutation,
    useLikeCommentMutation,
    useGetLikesCommentMutation,
    useGetListPostsForExploreMutation,
    useGetExplorePostsMutation,
    useGetListPosts2Mutation,
    useGetListReelsMutation,
    useGetPostsByUsernameMutation,
    useGetReelByUsernameMutation,
    useDeletePostMutation,
} = postApiSlice;
