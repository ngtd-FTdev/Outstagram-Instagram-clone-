import { createSlice } from '@reduxjs/toolkit'

const postFeed = createSlice({
    name: 'postFeed',
    initialState: {
        postsById: {},
        comments: {},

        // Trang cụ thể chỉ chứa ID để render
        homeIds: [],
        exploreIds: [],
        reelIds: [],

        pagePost: 1,
        pageExplore: 1,
        pageReel: 1,

        firstPostId: '',
        lastPostId: '',
        firstPostExploreId: '',
        lastPostExploreId: '',
        firstReelId: '',
        lastReelId: '',
    },

    reducers: {
        setPostsData: (state, action) => {
            const {
                postsArray = [],
                page = 1,
                target = 'home',
            } = action.payload

            const ids = postsArray.reduce((acc, post) => {
                state.postsById[post._id] = post
                acc.push(post._id)
                return acc
            }, [])

            if (target === 'home') {
                state.homeIds = page === 1 ? ids : [...state.homeIds, ...ids]
                if (ids[0]) {
                    state.firstPostId = page === 1 ? ids[0] : state.firstPostId
                    state.lastPostId = ids[ids.length - 1]
                }
            }

            if (target === 'explore') {
                state.exploreIds =
                    page === 1 ? ids : [...state.exploreIds, ...ids]
                if (ids[0]) {
                    state.firstPostExploreId =
                        page === 1 ? ids[0] : state.firstPostExploreId
                    state.lastPostExploreId = ids[ids.length - 1]
                }
            }

            if (target === 'reel') {
                state.reelIds = page === 1 ? ids : [...state.reelIds, ...ids]
                if (ids[0]) {
                    state.firstReelId = page === 1 ? ids[0] : state.firstReelId
                    state.lastReelId = ids[ids.length - 1]
                }
            }
        },

        setLikesForPost: (state, action) => {
            const { postId, isLiked } = action.payload
            const post = state.postsById[postId]
            if (post) {
                post.isLiked = isLiked
                post.likes += isLiked ? 1 : -1
            }
        },

        setSavedForPost: (state, action) => {
            const { postId, isSaved } = action.payload
            const post = state.postsById[postId]
            if (post) {
                post.isSaved = isSaved
            }
        },

        setCommentsForPost: (state, action) => {
            const { postId, data } = action.payload
            state.comments[postId] = [...data]
        },

        addCommentToPost: (state, action) => {
            const { postId, comment } = action.payload
            if (!state.comments[postId]) {
                state.comments[postId] = []
            }
            state.comments[postId].unshift(comment)

            const post = state.postsById[postId]
            if (post) {
                post.comments = (post.comments || 0) + 1
            }
        },

        setReplyComment: (state, action) => {
            const { postId } = action.payload
            if (state.comments[postId]) {
                state.comments[postId].comments_child = 1
            }
        },

        incrementPagePost: state => {
            state.pagePost += 1
        },
        resetPagePost: state => {
            state.pagePost = 1
        },

        incrementPageExplore: state => {
            state.pageExplore += 1
        },
        resetPageExplore: state => {
            state.pageExplore = 1
        },

        incrementPageReel: state => {
            state.pageReel += 1
        },
        resetPageReel: state => {
            state.pageReel = 1
        },

        setIsFollowingAuthor: (state, action) => {
            const { postId } = action.payload
            if (state.postsById?.[postId]) {
                state.postsById[postId].isFollowingAuthor = true
            }
        },
        setIsUnFollowingAuthor: (state, action) => {
            const { postId } = action.payload
            if (state.postsById?.[postId]) {
                state.postsById[postId].isFollowingAuthor = false
            }
        },
    },
})

export const {
    setPostsData,
    setLikesForPost,
    setSavedForPost,
    setCommentsForPost,
    addCommentToPost,
    setReplyComment,
    incrementPagePost,
    resetPagePost,
    incrementPageExplore,
    resetPageExplore,
    incrementPageReel,
    resetPageReel,
    setIsFollowingAuthor,
    setIsUnFollowingAuthor
} = postFeed.actions

export default postFeed.reducer
