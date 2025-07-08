import ArrowCircularIcon from '@/assets/icons/arrowCircularIcon.svg?react'
import CircleThinIcon from '@/assets/icons/circleThinIcon.svg?react'
import PlusIcon from '@/assets/icons/plusIcon.svg?react'
import {
    NextButton,
    PrevButton,
    usePrevNextButtons,
} from '@/components/EmblaCarousel/EmblaCarouselArrowButtons'
import Modal from '@/components/modal'
import useEmblaCarousel from 'embla-carousel-react'

function HighlightProfile() {
    const dataStoryNotes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    const slides = Array.from(dataStoryNotes.keys())

    const options = {
        watchDrag: false,
    }

    const [emblaRef, emblaApi] = useEmblaCarousel(options)

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
        <div className='group relative mb-11 h-[130px]'>
            <div className='embla_highlight'>
                <div
                    className='embla__viewport_highlight absolute inset-0 flex flex-grow flex-col justify-center'
                    ref={emblaRef}
                >
                    <div className='embla__container_highlight'>
                        {!(slides.length !== 0) && (
                            <div className='embla__slide_highlight ml-4 flex w-[125px] items-center justify-center'>
                                <Modal asChild={true}>
                                    <div className='flex w-[115px] cursor-pointer select-none flex-col items-center justify-center px-[15px] py-[10px]'>
                                        <div className='relative flex flex-col items-center justify-center'>
                                            <span className='absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]'>
                                                <CircleThinIcon className='flex h-[89px] w-[89px] items-center justify-center text-[--gray-a3]' />
                                            </span>
                                            <div className='flex h-[77px] w-[77px] items-center justify-center overflow-hidden rounded-full bg-[--ig-secondary-background]'>
                                                <PlusIcon className='flex h-11 w-11 items-center justify-center text-[--ig-tertiary-icon]' />
                                            </div>
                                        </div>
                                        <div className='pt-[15px] text-center'>
                                            <span className='line-clamp-1 text-xs font-semibold text-[--ig-primary-text]'>
                                                New
                                            </span>
                                        </div>
                                    </div>
                                </Modal>
                            </div>
                        )}
                        {slides.length !== 0 &&
                            slides.map(index => (
                                <Modal asChild={true} key={index}>
                                    <div className='flex w-[115px] cursor-pointer select-none flex-col items-center justify-center px-[15px] py-[10px]'>
                                        <div className='relative flex flex-col items-center justify-center'>
                                            <span className='absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]'>
                                                <CircleThinIcon className='flex h-[89px] w-[89px] items-center justify-center text-[--gray-a3]' />
                                            </span>
                                            <div className='flex h-[77px] w-[77px] items-center justify-center overflow-hidden rounded-full bg-[--ig-secondary-background]'>
                                                <img
                                                    src='https://res.cloudinary.com/dbma8vpob/image/upload/v1727157466/instagram/img_video_post/imxjfj44hcpx6xirexku.jpg'
                                                    alt=''
                                                />
                                            </div>
                                        </div>
                                        <div className='pt-[15px] text-center'>
                                            <span className='line-clamp-1 text-xs font-semibold text-[--ig-primary-text]'>
                                                yeeee
                                            </span>
                                        </div>
                                    </div>
                                </Modal>
                            ))}
                    </div>
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
        </div>
    )
}

export default HighlightProfile
