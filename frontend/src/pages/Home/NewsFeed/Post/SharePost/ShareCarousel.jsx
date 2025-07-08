import ArrowCircularIcon from '@/assets/icons/arrowCircularIcon.svg?react'
import {
    NextButton,
    PrevButton,
    usePrevNextButtons,
} from '@/components/EmblaCarousel/EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import CopyLinkIcon from '@/assets/icons/copyLinkIcon.svg?react'
import FacebookIcon from '@/assets/icons/facebookIcon.svg?react'
import MessengerIcon from '@/assets/icons/messengerIcon.svg?react'
import EmailIcon from '@/assets/icons/emailIcon.svg?react'
import SeeAllIcon from '@/assets/icons/seeAllIcon.svg?react'

function ShareCarousel({ listShare }) {
    const shareOptions = [
        { icon: CopyLinkIcon, label: 'Copy link', onClick: () => {} },
        { icon: FacebookIcon, label: 'Facebook', onClick: () => {} },
        { icon: MessengerIcon, label: 'Messenger', onClick: () => {} },
        { icon: EmailIcon, label: 'Email', onClick: () => {} },
        { icon: SeeAllIcon, label: 'See all', onClick: () => {} },
    ]

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

    return (
        <div className='relative overflow-hidden select-none' ref={emblaRef}>
            <div className='embla__container_story_note flex h-[120px] items-center px-3'>
                {shareOptions.map((item, index) => {
                    const Icon = item.icon
                    return (
                        <div key={index} className='flex items-center active:opacity-50'>
                            <div className='flex h-[104px] w-[76px] flex-col items-center px-1 py-2'>
                                <div className='flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-full bg-[--ig-secondary-background]'>
                                    <Icon className='h-[20px] w-[20px] text-[--ig-primary-text]' />
                                </div>
                                <div className='mt-2 flex items-center justify-center text-center text-xs text-[--ig-primary-text]'>
                                    {item.label}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            {!prevBtnDisabled && (
                <PrevButton
                    onClick={onPrevButtonClick}
                    disabled={prevBtnDisabled}
                    className='absolute left-0 top-1/2 flex h-[45px] w-[45px] -translate-y-1/2 transform items-center justify-center'
                >
                    <ArrowCircularIcon className='w-[24px] text-white' />
                </PrevButton>
            )}
            {!nextBtnDisabled && (
                <NextButton
                    onClick={onNextButtonClick}
                    disabled={nextBtnDisabled}
                    className='absolute right-0 top-1/2 flex h-[45px] w-[45px] -translate-y-1/2 transform items-center justify-center'
                >
                    <ArrowCircularIcon className='w-[24px] rotate-180 transform text-white' />
                </NextButton>
            )}
        </div>
    )
}

export default ShareCarousel
