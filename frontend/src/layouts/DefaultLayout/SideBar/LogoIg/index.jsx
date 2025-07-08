import OustagramSvg from '@/assets/icons/oustagram.svg?react'
import InstagramSvg from '@/assets/icons/instagram.svg?react'
import InstagramIcon from '@/assets/icons/instagramIcon.svg?react'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function LogoIg({ isOpenDrawer, collapseSideBar }) {
    const isWide = useSelector(state => state.isWide.isWide)
    const [hasRendered, setHasRendered] = useState(false)
    useEffect(() => {
        setHasRendered(true)
    }, [])

    return (
        <Link to='/'>
            <AnimatePresence>
                <motion.div
                    key={isWide && !isOpenDrawer ? 'A' : 'B'}
                    initial={hasRendered ? { opacity: 0, scale: 0.8 } : false}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className='absolute mt-2'
                >
                    {isWide && !isOpenDrawer && !collapseSideBar ? (
                        <OustagramSvg className='h-[32px] w-[113px] text-[--ig-primary-text]' />
                    ) : (
                        <InstagramIcon className='-mt-[5px] h-6 w-6 text-[--ig-primary-text]' />
                    )}
                </motion.div>
            </AnimatePresence>
        </Link>
    )
}

export default React.memo(LogoIg)
