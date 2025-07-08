import SideBar from '@/layouts/DefaultLayout/SideBar'
import { CloseDrawer } from '@/redux/features/sidebar'
import { useDispatch, useSelector } from 'react-redux'

function DefaultLayout({ children, option = {} }) {
    const dispatch = useDispatch()
    const { isOpenDrawer } = useSelector(state => state.sidebarOptions)
    const isOptionWide = useSelector(state => state.isWide.isOptionWide)

    const handleBlur = () => {
        dispatch(CloseDrawer())
    }

    return (
        <>
            <div className='relative flex h-full w-full flex-row bg-[--ig-primary-background] text-white'>
                <div
                    onClick={isOpenDrawer ? handleBlur : null}
                    className={`ml-auto h-full flex-grow mobile:flex-grow-0 mobile:w-calc-narrow-width mobile:transition-all mobile:duration-200 mobile:ease-in-out ${option?.collapseSideBar ? '' : 'custom-xl:w-calc-medium-width'}`}
                >
                    {children}
                </div>
                <SideBar option={option} />
            </div>
        </>
    )
}

export default DefaultLayout
