/* eslint-disable indent */
import SettingIcon from '@/assets/icons/settingIcon.svg?react'
import NavDrawer from '@/components/NavDrawer'
import { setIsMobile, setIsWide } from '@/redux/features/isWideSlice'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LogoIg from './LogoIg'
import SidebarNav from './SidebarNav'
import SettingsMenu from './SettingsMenu'

function SideBar({ option = {} }) {
    const dispatch = useDispatch()
    const isWide = useSelector(state => state.isWide.isWide)
    const isMobile = useSelector(state => state.isWide.isMobile)
    const { isOpenDrawer } = useSelector(state => state.sidebarOptions)

    const handleResize = () => {
        if (!option?.collapseSideBar && window.innerWidth > 1265) {
            dispatch(setIsWide(true))
        } else {
            dispatch(setIsWide(false))
        }

        if (window.innerWidth < 767) {
            dispatch(setIsMobile(true))
        } else {
            dispatch(setIsMobile(false))
        }
    }

    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [option?.collapseSideBar])

    const durationWide = window.innerWidth < 1265 ? 0 : 0.2

    const SidebarContainer = option?.collapseSideBar ? 'div' : motion.div
    const sidebarProps = option?.collapseSideBar
        ? {
              className: 'flex flex-1 flex-col',
              style: { width: 'var(--nav-narrow-width)' },
          }
        : {
              className: 'flex flex-1 flex-col',
              initial: { width: 'var(--nav-medium-width)' },
              animate: {
                  width:
                      isWide && !isOpenDrawer
                          ? 'var(--nav-medium-width)'
                          : 'var(--nav-narrow-width)',
              },
              transition: { duration: durationWide },
          }

    return (
        <>
            {isMobile ? (
                <div
                    className={`fixed bottom-0 left-0 right-0 z-50 flex h-[48px] w-full flex-row items-center ${isMobile ? 'justify-evenly' : 'justify-around px-2'} border-t border-[--ig-separator] bg-[--ig-primary-background]`}
                >
                    <SidebarNav isMobile={true} />
                </div>
            ) : (
                <div className='fixed inset-y-0 left-0 flex h-screen flex-1 flex-col bg-black text-black'>
                    <NavDrawer />
                    <div className='z-[1] flex flex-1 flex-col border-r border-[--ig-separator] bg-[--ig-primary-background]'>
                        <SidebarContainer {...sidebarProps}>
                            <div className='flex h-full w-full flex-col px-3 pb-5 pt-2'>
                                <div className='h-[92px] min-h-[92px] w-full px-3 pb-[35px] pt-[25px]'>
                                    <LogoIg
                                        isOpenDrawer={isOpenDrawer}
                                        collapseSideBar={option?.collapseSideBar}
                                    />
                                </div>
                                <div className='flex w-full flex-1 flex-col text-white'>
                                    <SidebarNav
                                        collapseSideBar={option?.collapseSideBar}
                                    />
                                </div>
                                <SettingsMenu
                                    collapseSideBar={option?.collapseSideBar}
                                >
                                    <div className='flex w-full cursor-pointer flex-col'>
                                        <div className='my-1 flex items-center rounded-lg p-[11px] text-[--ig-primary-text] transition-colors duration-300 ease-in-out hover:bg-[--ig-hover-overlay] active:bg-[--ig-active-overlay]'>
                                            <div className='text-[--ig-link]'>
                                                <SettingIcon className='h-6 w-6 text-[--ig-primary-text]' />
                                            </div>
                                            <div className='pl-4'>
                                                {isWide &&
                                                    !isOpenDrawer &&
                                                    !option?.collapseSideBar && (
                                                        <span>More</span>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </SettingsMenu>
                            </div>
                        </SidebarContainer>
                    </div>
                </div>
            )}
        </>
    )
}

export default SideBar
