import Notification from '@/layouts/DefaultLayout/SideBar/Notification'
import Search from '@/layouts/DefaultLayout/SideBar/Search'
import { AnimatePresence, motion } from 'framer-motion'
import { useSelector } from 'react-redux'

function NavDrawer() {
    const { isOpenSearch, isOpenNoti } = useSelector(
        state => state.sidebarOptions
    )

    return (
        <div>
            <AnimatePresence mode="wait">
                {isOpenSearch && (
                    <motion.div
                        key='search'
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className='absolute inset-y-0 left-[--nav-narrow-width] z-40 h-full w-full'
                    >
                        <Search />
                    </motion.div>
                )}
                {isOpenNoti && (
                    <motion.div
                        key='noti'
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className='absolute inset-y-0 left-[--nav-narrow-width] z-40 h-full w-full'
                    >
                        <Notification />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default NavDrawer
