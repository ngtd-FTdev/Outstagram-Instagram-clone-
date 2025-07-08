import ArrowIcon from '@/assets/icons/arrowIcon.svg?react'
import { FOOTER_LINKS } from '@/constants/footerLinks'
import language from '@/data/language.json'

function FooterPage() {
    let lang = 'en'
    const links = FOOTER_LINKS[lang]?.InstagramLinks
    return (
        <footer className='order-5 hidden bg-[--ig-primary-background] px-4 md:flex md:flex-col md:items-center'>
            <div className='mb-[52px] flex flex-col items-center justify-start'>
                <div className='mt-6 flex flex-wrap items-center justify-center'>
                    {links &&
                        Object?.keys(links)?.map(key => (
                            <div
                                key={key}
                                className='mx-2 mb-3 inline-flex active:opacity-50'
                            >
                                <a
                                    href={links[key].url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='hover:underline'
                                >
                                    <span className='text-xs text-[--ig-secondary-text]'>
                                        {links[key].label}
                                    </span>
                                </a>
                            </div>
                        ))}
                </div>
                <div>
                    <div className='my-3 flex items-center justify-center gap-4 text-black'>
                        <span className='relative cursor-pointer'>
                            <label
                                htmlFor='language'
                                className='flex items-center justify-center gap-1'
                            >
                                <span className='text-xs text-[--ig-secondary-text]'>
                                    English
                                </span>
                                <div className='flex items-center justify-center'>
                                    <ArrowIcon className='h-3 w-3 rotate-180 transform text-[--ig-secondary-text]' />
                                </div>
                            </label>
                            <select
                                name='language'
                                id='language'
                                className='absolute inset-0 z-0 bg-slate-50 opacity-0'
                            >
                                {language?.map((lang, index) => (
                                    <option
                                        key={index}
                                        value={lang.name}
                                        className='w-auto text-xs'
                                    >
                                        {lang.name}
                                    </option>
                                ))}
                            </select>
                        </span>
                        <div className='leading-4'>
                            <span className='inline-block align-top text-xs leading-4 text-[--ig-secondary-text]'>
                                © 2024 Instagram from Meta
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default FooterPage
