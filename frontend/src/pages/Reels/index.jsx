import ListReels from './ListReels'

function ReelsPage() {
    return (
        <>
            <section className='flex h-screen w-full flex-grow flex-col'>
                <main className='scroll-snap-type-y scroll-bar-0 h-screen w-full overflow-y-scroll'>
                    <div className='pt-8'>
                        <ListReels />
                    </div>
                </main>
            </section>
        </>
    )
}

export default ReelsPage
