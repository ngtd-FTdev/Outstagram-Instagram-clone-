import Modal from '@/components/modal'
import { NAV_COMPONENT } from '@/constants/navigationConstants'
import { CloseDrawer } from '@/redux/features/sidebar'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

function ButtonNav({ value, isMobile, collapseSideBar }) {
    const isWide = useSelector(state => state.isWide.isWide)
    const sidebarOptions = useSelector(state => state.sidebarOptions)

    let IconActive = value.iconActive
    let Icon = value.icon

    const dispatch = useDispatch()

    if (value.modal) {
        let ComModel = Modal
        if (NAV_COMPONENT[value.name]) {
            ComModel = NAV_COMPONENT[value.name]
        }

        return (
            <>
                <ComModel>
                    <div
                        className={`${sidebarOptions.isOpenDrawer ? 'w-full text-base font-bold text-[--ig-primary-text]' : 'w-full bg-transparent'}`}
                    >
                        <div className='flex select-none flex-row items-center justify-start p-[12px] transition-colors text-[--ig-primary-text] duration-300 ease-in-out group-active:text-[--ig-active-text]'>
                            <div>
                                <Icon className='h-6 w-6 group-hover:scale-105' />
                            </div>
                            {isWide && !sidebarOptions.isOpenDrawer && !collapseSideBar && (
                                <span className='pl-4'>{value.name}</span>
                            )}
                        </div>
                    </div>
                </ComModel>
            </>
        )
    }

    const handleToggleDrawer = () => {
        dispatch(value.handler())
    }

    if (value.drawer) {
        return (
            <div
                onClick={handleToggleDrawer}
                className={`flex select-none text-[--ig-primary-text] flex-row items-center justify-start transition-colors duration-300 ease-in-out group-active:text-[--ig-active-text] ${sidebarOptions[value.active] ? 'rounded-[8px] border-[1px] border-[--grey-2] p-[11px]' : 'p-[12px]'}`}
            >
                <div>
                    {sidebarOptions[value.active] ? (
                        <IconActive className='h-6 w-6 group-hover:scale-105' />
                    ) : (
                        <Icon className='h-6 w-6 group-hover:scale-105' />
                    )}
                </div>
                {isWide && !sidebarOptions.isOpenDrawer && !collapseSideBar && (
                    <span className='pl-4'>{value.name}</span>
                )}
            </div>
        )
    }

    const handleBlur = () => {
        dispatch(CloseDrawer())
    }

    return (
        <NavLink
            onClick={sidebarOptions.isOpenDrawer ? handleBlur : null}
            to={value.path}
            className={({ isActive }) =>
                `${isActive ? 'text-base font-bold text-[--ig-primary-text]' : 'bg-transparent'}`
            }
        >
            {({ isActive }) => (
                <div className={`flex select-none text-[--ig-primary-text] items-center justify-start transition-colors duration-300 ease-in-out
                    ${isMobile ? 'p-2' : 'p-[12px]'} group-active:text-[--ig-active-text]`}>
                    <div>
                        {isActive && !sidebarOptions.isOpenDrawer ? (
                            <IconActive className='h-6 w-6 group-hover:scale-105' />
                        ) : (
                            <Icon className='h-6 w-6 group-hover:scale-105' />
                        )}
                    </div>
                    {isWide && !sidebarOptions.isOpenDrawer && !isMobile && !collapseSideBar && (
                        <span className='pl-4'>{value.name}</span>
                    )}
                </div>
            )}
        </NavLink>
    )
}

export default ButtonNav
