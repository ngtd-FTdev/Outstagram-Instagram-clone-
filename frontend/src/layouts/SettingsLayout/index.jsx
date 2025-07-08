import { Link, Outlet, useLocation } from 'react-router-dom'
import DefaultLayout from '../DefaultLayout'
import UserCirIcon from '@/assets/icons/UserCirIcon.svg?react'
import UserIcon from '@/assets/icons/UserIcon.svg?react'
import BellIcon from '@/assets/icons/BellIcon.svg?react'
import SecurityIcon from '@/assets/icons/SecurityIcon.svg?react'
import LockIcon from '@/assets/icons/LockIcon.svg?react'
import StarCirIcon from '@/assets/icons/StarCirIcon.svg?react'
import BlockIcon from '@/assets/icons/BlockIcon.svg?react'
import MessageIcon from '@/assets/icons/MessageIcon.svg?react'
import CommentIcon from '@/assets/icons/commentIcon.svg?react'
import LanguageIcon from '@/assets/icons/LanguageIcon.svg?react'
import KeyIcon from '@/assets/icons/keyIcon.svg?react'
import FooterPage from '@/components/footerPage'

function SettingsLayout() {
    const location = useLocation()

    const settingsLinks = [
        {
            title: 'How you use Instagram',
            items: [
                { name: 'Edit profile', icon: UserCirIcon, path: '/accounts/edit' },
                // { name: 'Notifications', icon: BellIcon, path: '/accounts/edit/notifications' },
            ],
        },
        {
            title: 'Who can see your content',
            items: [
                {
                    name: 'Account privacy',
                    icon: LockIcon,
                    path: '/accounts/edit/account_privacy',
                },
                // { name: 'Close Friends', icon: StarCirIcon, path: '/accounts/edit/close_friends' },
                { name: 'Blocked', icon: BlockIcon, path: '/accounts/edit/blocked_accounts' },
            ],
        },
        // {
        //     title: 'How others can interact with you',
        //     items: [
        //         {
        //             name: 'Messages and story replies',
        //             icon: MessageIcon,
        //             path: '/accounts/edit/messages_and_story_replies',
        //         },
        //         { name: 'Comments', icon: CommentIcon, path: '/accounts/edit/comments' },
        //     ],
        // },
        {
            title: 'Your app and media',
            items: [
                {
                    name: 'Language',
                    icon: LanguageIcon,
                    path: '/accounts/edit/language/preferences',
                },
                {
                    name: 'Password',
                    icon: KeyIcon,
                    path: '/accounts/edit/password',
                },
            ],
        },
    ]

    return (
        <DefaultLayout option={{ collapseSideBar: false }}>
            <div className='flex min-h-screen max-h-screen overflow-y-hidden bg-[--ig-primary-background]'>
                <div className='border-r border-[#262626] pt-6'>
                    <div className='mt-[16px] w-[315px]'>
                        <div className='mx-[34px] mb-[24px] flex items-center px-4'>
                            <h3 className='text-[20px] font-bold text-[--ig-primary-text]'>
                                Settings
                            </h3>
                        </div>
                        {settingsLinks.map((section, index) => (
                            <div key={index} className='mx-[34px]'>
                                <div className='px-[16px] py-[12px]'>
                                    <span className='text-xs font-semibold text-[--ig-secondary-text]'>
                                        {section.title}
                                    </span>
                                </div>
                                {section.items.map((item, itemIndex) => (
                                    <div className='rounded-[8px]' key={itemIndex}>
                                        <Link
                                            to={item.path}
                                            className={`block rounded-lg active:opacity-50 px-4 py-3 text-sm ${
                                                location.pathname === item.path
                                                    ? 'bg-[--ig-highlight-background] hover:bg-[--ig-bg-setting-hover] text-[--ig-primary-text]'
                                                    : 'text-[--ig-primary-text] hover:bg-[--ig-bg-setting-hover]'
                                            }`}
                                        >
                                            <div className='flex items-center gap-2'>
                                                <div className=''>
                                                    <item.icon className='w-[24px] h-[24 px]' />
                                                </div>
                                                <span className='text-sm text-[--ig-primary-text]'>
                                                    {item.name}
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <div className='flex-1 flex overflow-y-auto items-center flex-col'>
                    <Outlet />
                    <FooterPage />
                </div>
            </div>
        </DefaultLayout>
    )
}

export default SettingsLayout
