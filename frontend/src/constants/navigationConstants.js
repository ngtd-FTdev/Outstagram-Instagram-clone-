import { ToggleNotiDrawer, ToggleSearchDrawer } from '@/redux/features/sidebar'

import Notifications from '@/layouts/DefaultLayout/SideBar/Notification'
import Search from '@/layouts/DefaultLayout/SideBar/Search'

import Home from '@/pages/Home'

import DirectIcon from '@/assets/icons/directIcon.svg?react'
import DirectIconSolid from '@/assets/icons/directIconSolid.svg?react'
import ExploreIcon from '@/assets/icons/exploreIcon.svg?react'
import ExploreIconSolid from '@/assets/icons/exploreIconSolid.svg?react'
import HeartIcon from '@/assets/icons/heartIcon.svg?react'
import HeartIconSolid from '@/assets/icons/heartIconSolid.svg?react'
import HomeIcon from '@/assets/icons/homeIcon.svg?react'
import HomeIconSolid from '@/assets/icons/homeIconSolid.svg?react'
import ReelIcon from '@/assets/icons/reelIcon.svg?react'
import ReelIconSolid from '@/assets/icons/reelIconSolid.svg?react'
import SearchIcon from '@/assets/icons/searchIcon.svg?react'
import SearchIconBold from '@/assets/icons/searchIconBold.svg?react'
import SquarePlusIcon from '@/assets/icons/squarePlusIcon.svg?react'
import CreatePost from '@/pages/CreatePost/CreatePost'

export const NAV_ITEMS = [
    {
        name: 'Home',
        path: '/',
        icon: HomeIcon,
        iconActive: HomeIconSolid,
        showOnMobile: true,
        mobileOrder: 1
    },
    {
        name: 'Search',
        icon: SearchIcon,
        iconActive: SearchIconBold,
        handler: ToggleSearchDrawer,
        drawer: 'Drawer',
        active: 'isOpenSearch',
    },
    {
        name: 'Explore',
        path: '/explore',
        icon: ExploreIcon,
        iconActive: ExploreIconSolid,
        showOnMobile: true,
        mobileOrder: 2
    },
    {
        name: 'Reels',
        path: '/reels',
        icon: ReelIcon,
        iconActive: ReelIconSolid,
        showOnMobile: true,
        mobileOrder: 3
    },
    {
        name: 'Messages',
        path: '/direct/inbox',
        icon: DirectIcon,
        iconActive: DirectIconSolid,
        showOnMobile: true,
        mobileOrder: 5
    },
    {
        name: 'Notifications',
        icon: HeartIcon,
        iconActive: HeartIconSolid,
        drawer: 'Drawer',
        handler: ToggleNotiDrawer,
        active: 'isOpenNoti',
    },
    {
        name: 'Create',
        icon: SquarePlusIcon,
        modal: CreatePost,
        showOnMobile: true,
        mobileOrder: 4
    },
]

export const NAV_COMPONENT = {
    Search: Search,
    Notifications: Notifications,
    Create: CreatePost,
}
