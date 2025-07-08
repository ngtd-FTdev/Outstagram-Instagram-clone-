import { SECONDARY_NAV_LINKS } from '@/constants/footerLinks'
import { Link } from 'react-router-dom'
import SuggestedForYou from '../SuggestedForYou'
import { useSelector } from 'react-redux'

function RightPanel() {
    const user = useSelector(state => state.auth.user)
    let language = 'en'
    const links = SECONDARY_NAV_LINKS[language]?.InstagramLinks

    return (
        <div className='mt-9 flex h-screen w-[--feed-sidebar-width] flex-col'>
            <div className='flex items-center px-4'>
                <div className='mr-3 h-11 w-11 overflow-hidden rounded-full'>
                    <Link to={`/${user?.username}`}>
                        <img
                            src={user?.profile_pic_url}
                            alt={user?.username}
                            className='h-full w-full object-cover'
                        />
                    </Link>
                </div>
                <div className='flex flex-1 flex-col leading-3'>
                    <div>
                        <Link
                            to={`/${user?.username}`}
                            className='text-sm font-semibold text-[--ig-primary-text] leading-[18px]'
                        >
                            {user?.username}
                        </Link>
                    </div>
                    <div className='text-sm leading-[18px] text-[--ig-secondary-text]'>
                        {user?.full_name}
                    </div>
                </div>
                <div className='ml-3 cursor-pointer select-none text-xs font-semibold text-[--ig-primary-button] hover:text-[--ig-link] active:opacity-50'>
                    Switch
                </div>
            </div>
            <div className='mb-2 mt-5 flex flex-col'>
                <SuggestedForYou />
            </div>
            <div className='px-4'>
                <div className='mb-4'>
                    <ul className='mb-[3px]'>
                        {links &&
                            Object?.keys(links)?.map(key => (
                                <li
                                    key={key}
                                    className='inline-flex text-xs text-[--ig-tertiary-text] after:mx-[0.25em] after:content-["\00B7"] active:opacity-50'
                                >
                                    <a
                                        href={links[key].url}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='hover:underline'
                                    >
                                        {links[key].label}
                                    </a>
                                </li>
                            ))}
                    </ul>
                </div>
                <span className='align-baseline text-xs uppercase text-[--ig-tertiary-text]'>
                    {SECONDARY_NAV_LINKS[language]?.COPYRIGHT_TEXT}
                </span>
            </div>
        </div>
    )
}

export default RightPanel
