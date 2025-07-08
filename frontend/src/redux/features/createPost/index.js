import { createSlice } from '@reduxjs/toolkit'

const createPost = createSlice({
    name: 'createPost',
    initialState: {
        isOpenCreatePost: false,
        mediaPosts: [],
        aspectRatio: 1 / 1,
        caption: '',
        indexSelectedMedia: 0,
        allowedCommenterType: 'everyone',
        advancedSettings: {
            hideLikeAndView: false,
            turnOffCommenting: false,
        },
        collaborators: [],
        location: '',
    },
    reducers: {
        setOpenCreatePost: (state, action) => {
            state.isOpenCreatePost = action.payload
        },
        setMediaPosts: (state, action) => {
            if (state.mediaPosts.length < 10) {
                state.mediaPosts = [...state.mediaPosts, ...action.payload]
            }
        },
        setIndexSelectedMedia: (state, action) => {
            state.indexSelectedMedia = action.payload
        },
        setMediaGallery: (state, action) => {
            state.mediaPosts = action.payload
        },
        removeMediaGallery: (state, action) => {
            state.mediaPosts = state.mediaPosts.filter(
                (_, i) => i !== action.payload
            )
        },
        setTrimVideo: (state, action) => {
            const { mediaIndex, trim } = action.payload
            if (state.mediaPosts[mediaIndex]) {
                state.mediaPosts[mediaIndex].edit.Trim = trim
            }
        },
        setCropMedias: (state, action) => {
            const { mediaIndex, crop } = action.payload
            if (state.mediaPosts[mediaIndex]) {
                state.mediaPosts[mediaIndex].cropSettings.crop = crop
            }
        },
        setAdvancedSettings: (state, action) => {
            state.advancedSettings = action.payload
        },
        setCollaborators: (state, action) => {
            state.collaborators = action.payload
        },
        setLocation: (state, action) => {
            state.location = action.payload
        },
        setZoomMedias: (state, action) => {
            const { mediaIndex, zoom } = action.payload
            if (state.mediaPosts[mediaIndex]) {
                state.mediaPosts[mediaIndex].cropSettings.zoom = zoom
            }
        },
        setAdjustments: (state, action) => {
            const { mediaIndex, adjustments } = action.payload
            if (state.mediaPosts[mediaIndex]) {
                state.mediaPosts[mediaIndex].edit.Adjustments = adjustments
            }
        },
        setFilter: (state, action) => {
            const { mediaIndex, filter } = action.payload
            if (state.mediaPosts[mediaIndex]) {
                state.mediaPosts[mediaIndex].edit.filter = filter
            }
        },
        setAspectRatio: (state, action) => {
            state.aspectRatio = action.payload
        },
        setCaptionPost: (state, action) => {
            state.caption = action.payload
        },
        setThumbnail: (state, action) => {
            const { mediaIndex, thumbnail } = action.payload
            if (state.mediaPosts[mediaIndex]) {
                state.mediaPosts[mediaIndex].thumbnail = thumbnail
            }
        },
        setSoundOn: (state, action) => {
            const { mediaIndex, isSoundOn } = action.payload
            if (state.mediaPosts[mediaIndex]) {
                state.mediaPosts[mediaIndex].edit.soundOn = isSoundOn
            }
        },
        setCroppedAreaPixels: (state, action) => {
            const { mediaIndex, croppedAreaPixels } = action.payload
            if (state.mediaPosts[mediaIndex]) {
                state.mediaPosts[mediaIndex].cropSettings.croppedAreaPixels =
                    croppedAreaPixels
            }
        },
        clearCreatePost: state => {
            state.mediaPosts = []
            state.aspectRatio = 1 / 1
            state.caption = ''
            state.indexSelectedMedia = 0
            state.advancedSettings = {
                hideLikeAndView: false,
                turnOffCommenting: false,
            }
            state.collaborators = []
            state.location = ''
        },
    },
})

export const {
    setOpenCreatePost,
    setMediaPosts,
    setCaptionPost,
    setAspectRatio,
    setZoomMedias,
    setCropMedias,
    setAdvancedSettings,
    setCollaborators,
    setLocation,
    setFilter,
    setTrimVideo,
    setSoundOn,
    setThumbnail,
    removeMediaGallery,
    setMediaGallery,
    setIndexSelectedMedia,
    clearCreatePost,
    setCroppedAreaPixels,
    setAdjustments,
} = createPost.actions
export default createPost.reducer
