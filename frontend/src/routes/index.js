import DefaultLayout from '@/layouts/DefaultLayout'
import SettingsLayout from '@/layouts/SettingsLayout'
import Loading from '@/pages/Loading'
import NotFoundPage from '@/pages/NotFoundPage'
import SettingsPage from '@/pages/SettingsPage'
import { lazy } from 'react'

const Explore = lazy(() => import('@/pages/Explore'))
const Home = lazy(() => import('@/pages/Home'))
const SignUp = lazy(() => import('@/pages/Home/SignUp'))
const Login = lazy(() => import('@/pages/Home/Access'))
const MessagesPage = lazy(() => import('@/pages/Messages'))
const CallPage = lazy(() => import('@/pages/Call'))
const ReelsPage = lazy(() => import('@/pages/Reels'))
const ProfileUser = lazy(() => import('@/pages/ProfileUser'))
const PostPage = lazy(() => import('@/pages/PostPage'))

const PostsProfile = lazy(
    () => import('@/pages/ProfileUser/BodyProfile/PostsProfile')
)
const SavedProfile = lazy(
    () => import('@/pages/ProfileUser/BodyProfile/SavedProfile')
)
const TaggedProfile = lazy(
    () => import('@/pages/ProfileUser/BodyProfile/TaggedProfile')
)
const ReelsProfile = lazy(
    () => import('@/pages/ProfileUser/BodyProfile/ReelsProfile')
)

const PasswordSettings = lazy(() => import('@/pages/SettingsPage/Password'))
const NotificationsSettings = lazy(() => import('@/pages/SettingsPage/Notifications'))
const AccountPrivacySettings = lazy(() => import('@/pages/SettingsPage/AccountPrivacy'))
const CloseFriendsSettings = lazy(() => import('@/pages/SettingsPage/CloseFriends'))
const BlockedAccountsSettings = lazy(() => import('@/pages/SettingsPage/BlockedAccounts'))
const MessagesAndStoryReplies = lazy(() => import('@/pages/SettingsPage/MessagesAndStoryReplies'))
const CommentsSettings = lazy(() => import('@/pages/SettingsPage/Comments'))
const LanguageSettings = lazy(() => import('@/pages/SettingsPage/LanguageSetting'))

const publicRoutes = [
    {
        name: '*',
        path: '*',
        component: NotFoundPage,
        requireAuth: true,
        layout: DefaultLayout,
    },
    {
        name: 'SignUp',
        path: '/accounts/signup',
        component: SignUp,
    },
    {
        name: 'Login',
        path: '/accounts/login',
        component: Login,
    },
    {
        name: 'Home',
        path: '/',
        component: Home,
        requireAuth: true,
        layout: DefaultLayout,
    },
    {
        name: 'ProfileUser',
        path: '/:userName',
        component: ProfileUser,
        layout: DefaultLayout,
        requireAuth: true,
        children: [
            {
                name: 'PostsProfile',
                path: '',
                component: PostsProfile,
            },
            {
                name: 'SavedProfile',
                path: 'saved',
                component: SavedProfile,
            },
            {
                name: 'UserTagged',
                path: 'tagged',
                component: TaggedProfile,
            },
            {
                name: 'ReelsProfile',
                path: 'reels',
                component: ReelsProfile,
            },
        ],
    },
    {
        name: 'Explore',
        path: '/explore',
        component: Explore,
        layout: DefaultLayout,
        requireAuth: true,
    },
    {
        name: 'Explore',
        path: '/explore/people',
        component: Explore,
        layout: DefaultLayout,
        requireAuth: true,
    },
    {
        name: 'Reels',
        path: '/reels',
        component: ReelsPage,
        layout: DefaultLayout,
        requireAuth: true,
    },
    {
        name: 'Reels',
        path: '/reels/:id',
        component: ReelsPage,
        layout: DefaultLayout,
        requireAuth: true,
    },
    {
        name: 'Reel',
        path: '/reel/:id',
        component: ReelsPage,
        layout: DefaultLayout,
        requireAuth: true,
    },
    {
        name: 'Direct',
        path: '/direct',
        component: MessagesPage,
        layout: DefaultLayout,
        collapseSideBar: true,
        requireAuth: true,
    },
    {
        name: 'Direct',
        path: '/direct/inbox',
        component: MessagesPage,
        layout: DefaultLayout,
        collapseSideBar: true,
        requireAuth: true,
    },
    {
        name: 'Direct',
        path: '/direct/t/:messageId',
        component: MessagesPage,
        layout: DefaultLayout,
        collapseSideBar: true,
        requireAuth: true,
    },
    {
        name: 'Direct',
        path: '/direct/requests',
        component: MessagesPage,
        layout: DefaultLayout,
        collapseSideBar: true,
        requireAuth: true,
    },
    {
        name: 'Call',
        path: '/call/:id',
        component: CallPage,
        requireAuth: true,
    },
    {
        name: 'Post',
        path: '/p/:postId',
        component: PostPage,
        layout: DefaultLayout,
        requireAuth: true,
    },
    {
        name: 'Stories',
        path: '/stories/:id',
        component: Explore,
        layout: DefaultLayout,
        requireAuth: true,
    },
    {
        name: 'Stories',
        path: '/stories/highlights/:id',
        component: Explore,
        requireAuth: true,
    },
    {
        name: 'Setting',
        path: '/accounts/edit',
        component: SettingsPage,
        layout: SettingsLayout,
        requireAuth: true,
        children: [
            {
                name: 'Edit Profile',
                path: '',
                component: SettingsPage,
            },
            {
                name: 'Password',
                path: 'password',
                component: PasswordSettings,
            },
            {
                name: 'Notifications',
                path: 'notifications',
                component: NotificationsSettings,
            },
            {
                name: 'AccountPrivacy',
                path: 'account_privacy',
                component: AccountPrivacySettings,
            },
            {
                name: 'Close Friends',
                path: 'close_friends',
                component: CloseFriendsSettings,
            },
            {
                name: 'Blocked Accounts',
                path: 'blocked_accounts',
                component: BlockedAccountsSettings,
            },
            {
                name: 'Messages and story replies',
                path: 'messages_and_story_replies',
                component: MessagesAndStoryReplies,
            },
            {
                name: 'Comments',
                path: 'comments',
                component: CommentsSettings,
            },
            {
                name: 'Language',
                path: 'language/preferences',
                component: LanguageSettings,
            },
        ]
    },
    {
        name: 'Loading',
        path: '/loading',
        component: Loading,
    },
]

const privateRoutes = []

export { privateRoutes, publicRoutes }
