import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import SettingIcon from '@/assets/icons/settingFGIcon.svg?react'
import MoonIcon from '@/assets/icons/MoonIcon.svg?react'
import ArrowIcon from '@/assets/icons/arrowCircular2Icon.svg?react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '@/redux/features/auth'
import { useState, useEffect } from 'react'

const mainMenuItems = [
    {
        label: 'Settings',
        path: '/accounts/edit',
        icon: SettingIcon,
    },
    {
        label: 'Switch appearance',
        icon: MoonIcon,
        children: [
            {
                label: 'Dark mode',
                type: 'toggle',
                key: 'darkMode',
            },
        ],
    },
    {
        label: 'Log out',
        action: 'logout',
    },
]

function setHtmlDarkClass(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}

function getSystemTheme() {
    return (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    )
}

function SettingsMenu({ children }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [menuStack, setMenuStack] = useState([mainMenuItems])
    const [toggles, setToggles] = useState(() => {
        const saved = localStorage.getItem('theme-mode')
        if (saved === 'dark') return { darkMode: true, autoMode: false }
        if (saved === 'light') return { darkMode: false, autoMode: false }
        if (saved === 'auto')
            return { darkMode: getSystemTheme(), autoMode: true }
        return { darkMode: getSystemTheme(), autoMode: true }
    })

    useEffect(() => {
        if (toggles.autoMode) {
            const updateTheme = () => {
                const isDark = getSystemTheme()
                setHtmlDarkClass(isDark)
            }
            updateTheme()
            localStorage.setItem('theme-mode', 'auto')
            const mql = window.matchMedia('(prefers-color-scheme: dark)')
            mql.addEventListener('change', updateTheme)
            return () => mql.removeEventListener('change', updateTheme)
        } else {
            setHtmlDarkClass(toggles.darkMode)
            localStorage.setItem(
                'theme-mode',
                toggles.darkMode ? 'dark' : 'light'
            )
        }
    }, [toggles])

    const currentMenu = menuStack[menuStack.length - 1]

    const handleBack = () => {
        setMenuStack(prev => prev.slice(0, -1))
    }

    const toggleKey = key => {
        setToggles(prev => {
            if (key === 'autoMode') {
                return { darkMode: getSystemTheme(), autoMode: !prev.autoMode }
            }
            if (key === 'darkMode') {
                return { darkMode: !prev.darkMode, autoMode: false }
            }
            return { ...prev, [key]: !prev[key] }
        })
    }

    const handleItemClick = item => {
        if (item.children) {
            setMenuStack(prev => [...prev, item.children])
        } else if (item.type === 'toggle' && item.key) {
            toggleKey(item.key)
        } else if (item.onClick) {
            item.onClick()
        } else if (item.action === 'logout') {
            dispatch(logout())
            navigate('/')
        } else if (item.path) {
            navigate(item.path)
        }
    }

    const renderToggle = item => {
        const value = toggles[item.key] || false
        return (
            <div
                key={item.key}
                className='flex items-center justify-between px-4 py-[12px]'
            >
                <span className='text-[15px] text-[--ig-primary-text]'>
                    {item.label}
                </span>
                <button
                    onClick={() => toggleKey(item.key)}
                    className={`flex h-6 w-10 items-center rounded-full p-1 duration-300 focus:outline-none ${
                        value ? 'bg-blue-600' : 'bg-gray-400'
                    }`}
                >
                    <span
                        className={`h-4 w-4 transform rounded-full bg-white shadow-md duration-300 ${
                            value ? 'translate-x-4' : ''
                        }`}
                    />
                </button>
            </div>
        )
    }

    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                className='w-[266px] rounded-xl border border-[--ig-elevated-separator] bg-[--ig-elevated-background] p-0 shadow-lg'
                side='top'
                align='start'
                sideOffset={10}
            >
                <div className='flex flex-col py-1'>
                    {menuStack.length > 1 && (
                        <button
                            onClick={handleBack}
                            className='flex items-center border-0 bg-transparent px-4 py-[12px] text-[15px] text-[--ig-primary-text] outline-none hover:bg-[--ig-hover-overlay]'
                        >
                            <ArrowIcon className='mr-4 h-3 w-3 -rotate-90' />
                            Back
                        </button>
                    )}
                    {currentMenu.map((item, index) => {
                        const Icon = item.icon
                        if (item.type === 'toggle' && item.key) {
                            return renderToggle(item)
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleItemClick(item)}
                                className='flex w-full items-center border-0 bg-transparent px-4 py-[12px] text-[15px] text-[--ig-primary-text] outline-none hover:bg-[--ig-hover-overlay]'
                            >
                                {Icon && <Icon className='mr-4 h-4 w-4' />}
                                {item.label}
                            </button>
                        )
                    })}
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default SettingsMenu
