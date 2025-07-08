import useMediaFileHandler from '@/hooks/useMediaFileHandler'
import {
    removeMediaGallery,
    setIndexSelectedMedia,
    setMediaGallery,
} from '@/redux/features/createPost'
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    SortableContext,
    arrayMove,
    horizontalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ArrowCircularIcon from '@/assets/icons/arrowCircularIcon.svg?react'
import CloseIcon from '@/assets/icons/closeIcon.svg?react'
import PlusIcon from '@/assets/icons/plusIcon.svg?react'

function SortableItem({ id, url, type, index, lengthMedia }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: index,
    })
    const dispatch = useDispatch()
    const indexSelectedMedia = useSelector(
        state => state.createPost.indexSelectedMedia
    )

    const handleSelectMedia = () => {
        dispatch(setIndexSelectedMedia(index))
    }

    const handleRemoveMedia = (e, index) => {
        e.stopPropagation()
        if (index === lengthMedia - 1) {
            dispatch(setIndexSelectedMedia(indexSelectedMedia - 1))
        }
        dispatch(removeMediaGallery(index))
    }

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none',
        zIndex: isDragging ? 1 : 0,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`relative h-[94px] min-w-[94px] cursor-pointer touch-none ${index === indexSelectedMedia ? '' : 'brightness-50'}`}
            onClick={handleSelectMedia}
            onTouchStart={e => e.stopPropagation()}
            onTouchMove={e => e.stopPropagation()}
        >
            {type === 'image' ? (
                <img
                    src={url}
                    alt=''
                    className='pointer-events-none h-full w-full object-cover'
                />
            ) : (
                <video
                    src={url}
                    className='pointer-events-none h-full w-full object-cover'
                />
            )}
            <div
                onClick={e => handleRemoveMedia(e, index)}
                className={`absolute right-0 top-0 m-1 cursor-pointer rounded-full bg-[--black-26-08] p-1 hover:opacity-70 active:opacity-100 ${index === indexSelectedMedia ? 'flex items-center justify-center' : 'hidden'}`}
            >
                <CloseIcon className='h-3 w-3 text-white' />
            </div>
        </div>
    )
}

function MediaGallery() {
    const dispatch = useDispatch()
    const mediaPosts = useSelector(state => state.createPost.mediaPosts)
    const [error, setError] = useState('')
    const [emblaRef, emblaApi] = useEmblaCarousel({
        dragFree: false,
        draggable: false,
        containScroll: 'keepSnaps',
        align: 'start',
        watchDrag: false,
    })

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor)
    )

    const { handleFiles } = useMediaFileHandler({
        setError,
        dispatch,
        lengthMedia: mediaPosts.length,
    })

    const handleFileChange = e => {
        const files = Array.from(e.target.files)
        handleFiles(files)
    }

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const dragPositionRef = useRef(0)

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setCanScrollPrev(emblaApi.canScrollPrev())
        setCanScrollNext(emblaApi.canScrollNext())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)
    }, [emblaApi, onSelect])

    useEffect(() => {
        if (emblaApi) {
            emblaApi.reInit()
            if (!isDragging) {
                emblaApi.scrollTo(dragPositionRef.current)
            }
        }
    }, [emblaApi, mediaPosts, isDragging])

    const handleDragStart = event => {
        if (emblaApi) {
            dragPositionRef.current = emblaApi.selectedScrollSnap()
            setIsDragging(true)
        }
    }

    const handleDragEnd = event => {
        const { active, over } = event
        if (!active || !over) {
            return
        }

        const activeId = active.id
        const overId = over.id

        if (activeId !== overId) {
            const oldIndex = activeId
            const newIndex = overId

            dragPositionRef.current = newIndex
            const newMediaPosts = arrayMove([...mediaPosts], oldIndex, newIndex)
            dispatch(setMediaGallery(newMediaPosts))
            dispatch(setIndexSelectedMedia(newIndex))
        }
        setIsDragging(false)
    }

    return (
        <div className='flex max-w-[480px] flex-nowrap rounded-xl bg-[--black-26-08] p-2'>
            <div className='relative max-w-[411px]'>
                <div className='touch-none overflow-hidden' ref={emblaRef}>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        onDragStart={handleDragStart}
                    >
                        <SortableContext
                            items={mediaPosts.map((_, index) => index)}
                            strategy={horizontalListSortingStrategy}
                        >
                            <div className='flex touch-none gap-2'>
                                {mediaPosts.map((media, index) => (
                                    <SortableItem
                                        key={index}
                                        id={media.id}
                                        url={media.mediaUrl}
                                        type={media.type}
                                        index={index}
                                        lengthMedia={mediaPosts.length}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>

                {canScrollPrev && (
                    <button
                        onClick={scrollPrev}
                        className='absolute left-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full hover:opacity-70 active:opacity-100'
                    >
                        <ArrowCircularIcon className='h-6 w-6 text-white' />
                    </button>
                )}

                {canScrollNext && (
                    <button
                        onClick={scrollNext}
                        className='absolute right-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full hover:opacity-70 active:opacity-100'
                    >
                        <ArrowCircularIcon className='h-6 w-6 rotate-180 text-white' />
                    </button>
                )}
            </div>
            {mediaPosts.length < 10 && (
                <div className='ml-[6px] mr-[4px]'>
                    <div className='flex h-[48px] w-[48px] cursor-pointer items-center justify-center rounded-full border border-[--ig-separator] active:bg-[--ig-highlight-background]'>
                        <label>
                            <PlusIcon className='h-6 w-6 text-[--ig-secondary-text]' />
                            <input
                                type='file'
                                className='hidden'
                                onChange={handleFileChange}
                                accept='image/jpeg,image/png,image/heic,image/heif,video/mp4,video/quicktime'
                                multiple
                            />
                        </label>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MediaGallery
