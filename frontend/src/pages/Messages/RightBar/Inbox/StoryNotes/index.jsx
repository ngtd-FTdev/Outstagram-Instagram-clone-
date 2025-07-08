import ArrowCircularIcon from '@/assets/icons/arrowCircularIcon.svg?react'
import {
    NextButton,
    PrevButton,
    usePrevNextButtons,
} from '@/components/EmblaCarousel/EmblaCarouselArrowButtons'
import { StoryNotesSkeleton } from '@/components/skeletons/MessageSkeletons'
import useEmblaCarousel from 'embla-carousel-react'
import { useEffect, useState } from 'react'

function StoryNotes() {
    const [isLoading, setIsLoading] = useState(true)
    const dataStoryNotes = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    ]

    const options = {
        // watchDrag: false,
    }

    const slides = Array.from(dataStoryNotes.keys())

    const [emblaRef, emblaApi] = useEmblaCarousel(options)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    } = usePrevNextButtons(emblaApi)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1500)

        return () => clearTimeout(timer)
    }, [])

    if (isLoading) {
        return <StoryNotesSkeleton />
    }

    return (
        <>
            <div className='mb-2 h-[140px] select-none'>
                <div className='flex w-full'>
                    <div className='flex flex-grow items-center justify-start'>
                        <div className='h-[140px] flex-grow overflow-hidden'>
                            <section className='embla_story_note relative'>
                                <div className='overflow-hidden' ref={emblaRef}>
                                    <div className='embla__container_story_note'>
                                        <div className='embla__slide_story_note'>
                                            <div className='flex h-[140px] w-24 cursor-pointer flex-col items-center justify-end overflow-hidden'>
                                                <div className='z-10 -mb-6 flex min-h-[55px] w-max min-w-[74px] max-w-24 items-start'>
                                                    <div className='filter-story-note story-note-after relative flex min-h-[42px] max-w-full items-center rounded-[14px] bg-[--ig-bubble-background] p-2 text-center text-[11px]'>
                                                        <div className='flex min-w-4 items-center overflow-auto text-[--ig-secondary-text]'>
                                                            Note...
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex flex-col items-center'>
                                                    <div className='flex items-center justify-center overflow-hidden rounded-full'>
                                                        <img
                                                            src='https://res.cloudinary.com/dbma8vpob/image/upload/v1727157466/instagram/img_video_post/bekiqhiove8dfak814hg.jpg'
                                                            alt=''
                                                            className='h-[74px] w-[74px] object-cover'
                                                        />
                                                    </div>
                                                    <div className='mt-[2px] flex min-w-0 max-w-24'>
                                                        <span className='truncate text-xs text-[--ig-secondary-text]'>
                                                            Your note
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {slides.map(index => (
                                            <div
                                                className='embla__slide_story_note'
                                                key={index}
                                            >
                                                <div className='flex h-[140px] w-24 cursor-pointer flex-col items-center justify-end overflow-hidden'>
                                                    <div className='z-10 -mb-6 flex min-h-[55px] w-max min-w-[74px] max-w-24 items-start'>
                                                        <div className='filter-story-note story-note-after relative flex min-h-[42px] max-w-full items-center rounded-[14px] bg-[--ig-bubble-background] p-2 text-center text-[11px]'>
                                                            <div className='flex min-w-4 items-center overflow-auto text-[--ig-secondary-text]'>
                                                                {/* Note... */}
                                                                <div className='max-h-full max-w-full overflow-hidden'>
                                                                    <span className='line-clamp-3 leading-[13px] text-[--ig-primary-text]'>
                                                                        ahlsdvakjsdh
                                                                        abdjashdlkasdhashdas
                                                                        jasdhjasjkldcas
                                                                        zsjdhca
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-col items-center'>
                                                        <div className='flex items-center justify-center overflow-hidden rounded-full'>
                                                            <img
                                                                src='https://res.cloudinary.com/dbma8vpob/image/upload/v1727157466/instagram/img_video_post/bekiqhiove8dfak814hg.jpg'
                                                                alt=''
                                                                className='h-[74px] w-[74px] object-cover'
                                                            />
                                                        </div>
                                                        <div className='mt-[2px] flex min-w-0 max-w-24'>
                                                            <span className='truncate text-xs text-[--ig-secondary-text]'>
                                                                Your note
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {!prevBtnDisabled && (
                                    <PrevButton
                                        onClick={onPrevButtonClick}
                                        disabled={prevBtnDisabled}
                                        className='absolute left-0 top-1/2 mt-4 flex h-[45px] w-[45px] -translate-y-1/2 transform items-center justify-center'
                                    >
                                        <ArrowCircularIcon className='w-[24px] text-white' />
                                    </PrevButton>
                                )}
                                {!nextBtnDisabled && (
                                    <NextButton
                                        onClick={onNextButtonClick}
                                        disabled={nextBtnDisabled}
                                        className='absolute right-0 top-1/2 mt-4 flex h-[45px] w-[45px] -translate-y-1/2 transform items-center justify-center'
                                    >
                                        <ArrowCircularIcon className='w-[24px] rotate-180 transform text-white' />
                                    </NextButton>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StoryNotes
