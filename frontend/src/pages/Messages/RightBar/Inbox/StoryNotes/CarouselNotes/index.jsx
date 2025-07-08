function CarouselNotes() {
    const dataStoryNotes = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    ]
    return (
        <>
            <ul className='scroll-bar-0 scroll-snap-type-x flex items-center overflow-auto'>
                {dataStoryNotes.map((data, index) => {
                    return (
                        <li key={index} className=''>
                            <div className='flex h-[140px] w-24 cursor-pointer flex-col items-center justify-end'>
                                <div className='z-10 min-h-[55px]'>
                                    <div className='filter-story-note flex min-h-[42px] min-w-[74px] max-w-24 items-center rounded-[14px] bg-[--ig-bubble-background] p-2 text-center text-[11px]'></div>
                                </div>
                                <div></div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

export default CarouselNotes
