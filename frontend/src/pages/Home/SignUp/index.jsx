import ArrowIcon from '@/assets/icons/arrowIcon.svg?react'
import HomePhone from '@/components/HomePhone'
import footerLinks from '@/data/footerLinks.json'
import language from '@/data/language.json'
import FormSignUp from './FormSignup'

function SignUpPage() {

    return (
        <div className='flex min-h-screen w-full flex-col bg-white'>
            <main className='mt-8 flex min-h-full flex-grow justify-center pb-8'>
                <HomePhone />
                <FormSignUp />
            </main>
            <footer className='mb-14'>
                <div className='flex flex-wrap items-end justify-center leading-none text-black'>
                    {footerLinks?.map((link, index) => (
                        <div key={index} className='mx-2 mb-3'>
                            <a
                                href={link.url}
                                className='cursor-pointer whitespace-nowrap text-xs text-[#737373] hover:underline'
                            >
                                {link.name}
                            </a>
                        </div>
                    ))}
                </div>
                <div className='my-3 flex items-center justify-center gap-4 text-black'>
                    <span className='relative cursor-pointer'>
                        <label
                            htmlFor='language'
                            className='flex items-center justify-center gap-1'
                        >
                            <span className='text-xs text-[#737373]'>
                                English
                            </span>
                            <div>
                                <span className=''>
                                    <ArrowIcon className='rotate-180 transform text-[#737373]' />
                                </span>
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
                        <span className='inline-block align-top text-xs leading-4'>
                            © 2024 Instagram from Meta
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default SignUpPage
