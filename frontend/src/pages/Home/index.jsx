import FooterPage from '@/components/footerPage'
import NewsFeed from './NewsFeed'
import RightPanel from './RightPanel'
import { Helmet } from 'react-helmet-async'

function Home() {
    return (
        <>
            <Helmet>
                <title>Outstagram</title>
            </Helmet>
            <section className='flex h-full w-full flex-grow flex-col'>
                <main className='flex h-full w-full flex-col justify-center'>
                    <div className='flex h-full w-full flex-row justify-center'>
                        <div className='mt-6 w-full max-w-[630px]'>
                            <div className='flex flex-col items-center'>
                                <div className='w-[min(470px,100vw)] max-w-full'>
                                    <NewsFeed />
                                </div>
                            </div>
                        </div>
                        <div className='hidden h-screen pl-[--feed-sidebar-padding-familiar] lg-lx:block'>
                            <RightPanel />
                        </div>
                    </div>
                </main>
                <FooterPage />
            </section>
        </>
    )
}

export default Home
