import { NAV_COMPONENT, NAV_ITEMS } from '@/constants/navigationConstants'

import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import ButtonNav from './ButtonNav'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

function SidebarNav({ isMobile, collapseSideBar }) {
    const isWide = useSelector(state => state.isWide.isWide)
    const sidebarOptions = useSelector(state => state.sidebarOptions)
    const user = useSelector(state => state.auth.user)

    return (
        <>
            {NAV_ITEMS.map((value, index) => {
                if (isMobile && !value.showOnMobile) return null

                return (
                    <div
                        key={index}
                        className={`group cursor-pointer transition-colors duration-300 ease-in-out ${isMobile ? `mx-2 order-[${value.mobileOrder || 99}]` : 'my-1 rounded-lg hover:bg-[--ig-hover-overlay] active:bg-[--ig-active-overlay]'}`}
                    >
                        <ButtonNav
                            value={value}
                            isMobile={isMobile}
                            collapseSideBar={collapseSideBar}
                        />
                    </div>
                )
            })}

            <div
                className={`group cursor-pointer transition-colors duration-300 ease-in-out ${isMobile ? 'order-[999] mx-2' : 'my-1 rounded-lg hover:bg-[--ig-hover-overlay] active:bg-[--ig-active-overlay]'}`}
            >
                <NavLink
                    to={`/${user?.username}`}
                    className={({ isActive }) =>
                        `${isActive ? 'text-base font-bold text-[--ig-primary-text]' : 'bg-transparent'}`
                    }
                >
                    {({ isActive }) => (
                        <div className='flex select-none flex-row items-center justify-start p-3 transition-colors duration-300 ease-in-out group-active:text-[--ig-active-text]'>
                            <div className='relative h-6 w-6'>
                                {isActive && (
                                    <div className='absolute left-1/2 top-1/2 z-50 h-7 w-7 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-2 border-[--ig-primary-text]'></div>
                                )}
                                <div className='overflow-hidden rounded-full'>
                                    <Avatar className='h-6 w-6'>
                                        <AvatarImage
                                            src={user?.profile_pic_url}
                                            alt={user?.username}
                                        />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                            {isWide &&
                                !sidebarOptions.isOpenDrawer &&
                                !collapseSideBar && (
                                    <span className='pl-4 text-[--ig-primary-text]'>Profile</span>
                                )}
                        </div>
                    )}
                </NavLink>
            </div>
        </>
    )
}

export default SidebarNav
