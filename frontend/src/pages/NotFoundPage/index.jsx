import FooterPage from '@/components/footerPage'
import { Link } from 'react-router-dom'

function NotFoundPage() {
    return (
        <>
            <section className='flex h-screen w-full flex-grow flex-col'>
                <main className='flex h-screen w-full flex-grow flex-col items-center justify-center bg-[--ig-primary-background]'>
                    <div className='flex max-w-full flex-col justify-center p-10'>
                        <span className='text-center text-2xl font-semibold leading-[30px] text-[--ig-primary-text]'>
                            Sorry, this page isn&apos;t available.
                        </span>
                        <div className='mb-5 mt-8'>
                            <span className='block text-center text-base font-normal leading-5 text-[--ig-primary-text]'>
                                The link you followed may be broken, or the page
                                may have been removed.&nbsp;
                                <Link
                                    to='/'
                                    className='cursor-pointer text-base leading-5 text-[--ig-link]'
                                >
                                    Go back to Instagram.
                                </Link>
                            </span>
                        </div>
                    </div>
                </main>
                <FooterPage />
            </section>
        </>
    )
}

export default NotFoundPage
