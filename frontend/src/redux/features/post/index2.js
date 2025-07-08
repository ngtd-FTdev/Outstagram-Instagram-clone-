import { createSlice } from '@reduxjs/toolkit'

const postFeed = createSlice({
    name: 'postFeed',
    initialState: {
        postsData: {},
        firstPostId: '',
        lastPostId: '',
        comments: {},
        explore: [],
        firstPostExploreId: '',
        lastPostExploreId: '',
        pageExplore: 1,
        pagePost: 1,
        pageReel: 1,
        firstReelId: '',
        lastReelId: '',
        reels: [],
    },
    reducers: {
        setPostsData: (state, action) => {
            const { postsArray = [], page = 1 } = action.payload
            for (const post of postsArray) {
                state.postsData[post._id] = post
            }

            if (postsArray[0]?._id) {
                if (page === 1) {
                    state.firstPostId = postsArray[0]._id
                }
                state.lastPostId = postsArray[postsArray?.length - 1]?._id
            }
        },
        setCommentsForPost: (state, action) => {
            const { postId, data } = action.payload
            state.comments[postId] = [...data]
        },
        setLikesForPost: (state, action) => {
            const { postId, isLiked } = action.payload
            if (state.postsData[postId]) {
                state.postsData[postId] = {
                    ...state.postsData[postId],
                    isLiked: isLiked,
                    likes: isLiked
                        ? state.postsData[postId].likes + 1
                        : state.postsData[postId].likes - 1,
                }
            }
        },
        setSavedForPost: (state, action) => {
            const { postId, isSaved } = action.payload
            if (state.postsData[postId]) {
                state.postsData[postId] = {
                    ...state.postsData[postId],
                    isSaved: isSaved,
                }
            }
        },
        addCommentToPost: (state, action) => {
            const { postId, comment } = action.payload
            if (state.comments[postId]) {
                state.comments[postId] = [
                    comment,
                    ...(state.comments[postId] || []),
                ]
                if (state.postsData[postId])
                    state.postsData[postId].comments =
                        state.postsData[postId].comments + 1
            }
        },
        setReplyComment: (state, action) => {
            const { postId } = action.payload
            if (state.comments[postId]) {
                state.comments[postId].comments_child = 1
            }
        },
        setExplore: (state, action) => {
            const { dataExplore, page } = action.payload
            if (page === 1) {
                state.explore = dataExplore
            } else {
                state.explore = [...state.explore, ...dataExplore]
            }

            // if (dataExplore[0]?._id) {
            //     if (page === 1) {
            //         state.firstPostExploreId = dataExplore[0]._id
            //     }
            //     state.lastPostExploreId = dataExplore[dataExplore?.length - 1]?._id
            // }
        },
        setFirstPostExploreId: (state, action) => {
            state.firstPostExploreId = action.payload
        },
        setLastPostExploreId: (state, action) => {
            state.lastPostExploreId = action.payload
        },
        setFirstReelId: (state, action) => {
            state.firstPostExploreId = action.payload
        },
        setLastReelId: (state, action) => {
            state.lastPostExploreId = action.payload
        },
        setReels: (state, action) => {
            const { dataReel, page } = action.payload
            if (page === 1) {
                state.reels = dataReel
            } else {
                state.reels = [...state.reels, ...dataReel]
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
            state.pageExplore += 1
        },
        resetPageReel: state => {
            state.pageExplore = 1
        },
    },
})

export const {
    setPostsData,
    addCommentToPost,
    setReplyComment,
    setCommentsForPost,
    setLikesForPost,
    setSavedForPost,
    setExplore,
    setFirstPostExploreId,
    setLastPostExploreId,
    setFirstReelId,
    setLastReelId,
    setReels,
    incrementPagePost,
    resetPagePost,
    incrementPageExplore,
    resetPageExplore,
    incrementPageReel,
    resetPageReel,
} = postFeed.actions
export default postFeed.reducer
