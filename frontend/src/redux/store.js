import { baseApi } from '@/api/rtkApi'
import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // Dùng localStorage để lưu trữ

import authReducer from './features/auth'
import chatSocketReducer from './features/chatSocket'
import counterReducer from './features/counter'
import createPostReducer from './features/createPost'
import isWideReducer from './features/isWideSlice'
import postFeedReducer from './features/post'
import searchUserReducer from './features/search'
import sidebarOptionsReducer from './features/sidebar'
import messageReducer from './features/message'
import suggestedUsersReducer from './features/suggestedUsers'
import usersReducer from './features/user'

const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['user', 'token'],
}

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer)

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        auth: persistedAuthReducer,
        counter: counterReducer,
        isWide: isWideReducer,
        sidebarOptions: sidebarOptionsReducer,
        createPost: createPostReducer,
        searchUser: searchUserReducer,
        postFeed: postFeedReducer,
        chatSocket: chatSocketReducer,
        message: messageReducer,
        suggestedUsers: suggestedUsersReducer,
        users: usersReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(baseApi.middleware),
    devTools: true,
})

export const persistor = persistStore(store)
