import ArrowCircularIcon from '@/assets/icons/arrowCircularIcon.svg?react'
import {
    NextButton,
    PrevButton,
    usePrevNextButtons,
} from '@/components/EmblaCarousel/EmblaCarouselArrowButtons'
import { useDotButton } from '@/components/EmblaCarousel/EmblaCarouselDotButton'
import useEmblaCarousel from 'embla-carousel-react'

function EmblaCarouselPost({ dataStoryNotes }) {
    const options = {
        // watchDrag: false,
    }

    const [emblaRef, emblaApi] = useEmblaCarousel(options)

    const { selectedIndex, scrollSnaps } = useDotButton(emblaApi)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    } = usePrevNextButtons(emblaApi)

    const HandlePrevButtonClick = e => {
        e.stopPropagation()
        onPrevButtonClick()
    }

    const HandleNextButtonClick = e => {
        e.stopPropagation()
        onNextButtonClick()
    }

    const HandleDBClick = e => {
        e.stopPropagation()
    }

    return (
        <>
            <div className='embla_post group relative flex h-full w-full items-center justify-center'>
                <div
                    className='embla__viewport_post flex flex-grow flex-col'
                    ref={dataStoryNotes?.length > 1 ? emblaRef : null}
                >
                    <div className='embla__container_post select-none min-h-full min-w-full items-center'>
                        {dataStoryNotes?.map((value, index) => (
                            <div
                                className='embla__slide_post flex min-h-full min-w-full items-center justify-center'
                                key={index}
                            >
                                {value?.type === 'video' ? (
                                    <video
                                        src={value?.url_media}
                                        alt=''
                                        className='h-full w-full object-cover'
                                        autoPlay={true}
                                        loop={true}
                                        muted={true}
                                    />
                                ) : (
                                    <img
                                        src={value?.url_media}
                                        alt=''
                                        className='h-full w-full object-cover'
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {!prevBtnDisabled && (
                    <PrevButton
                        onClick={e => HandlePrevButtonClick(e)}
                        onDoubleClick={e => HandleDBClick(e)}
                        disabled={prevBtnDisabled}
                        className='absolute left-0 top-1/2 hidden -translate-y-1/2 transform py-4 pl-2 group-hover:flex'
                    >
                        <ArrowCircularIcon className='h-[26px] w-[26px] text-[--soft-gray] opacity-80' />
                    </PrevButton>
                )}
                {!nextBtnDisabled && (
                    <NextButton
                        onClick={e => HandleNextButtonClick(e)}
                        onDoubleClick={e => HandleDBClick(e)}
                        disabled={nextBtnDisabled}
                        className='absolute right-0 top-1/2 hidden -translate-y-1/2 transform py-4 pr-2 group-hover:flex'
                    >
                        <ArrowCircularIcon className='h-[26px] w-[26px] rotate-180 transform text-[--soft-gray] opacity-80' />
                    </NextButton>
                )}
                <div className='absolute bottom-[15px] left-0 right-0 flex items-center justify-center gap-1'>
                    {scrollSnaps.map((_, index) => (
                        <div
                            key={index}
                            className={`h-[6px] w-[6px] rounded-full bg-[--web-always-white] ${
                                index === selectedIndex
                                    ? 'opacity-100'
                                    : 'opacity-40'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

export default EmblaCarouselPost
