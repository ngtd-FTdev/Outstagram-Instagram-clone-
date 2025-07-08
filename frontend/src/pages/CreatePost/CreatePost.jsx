import CloseIcon from '@/assets/icons/closeIcon.svg?react'
import {
    clearCreatePost,
    setIndexSelectedMedia,
    setMediaPosts,
    setOpenCreatePost,
} from '@/redux/features/createPost'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
} from '@radix-ui/react-dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ImportImgOrVideo from './addImfOrVideo'
import CreateNewPost from './CreateNewPost'
import CropPosts from './Crop'
import EditPost from './Edit'
import Sharing from './Sharing'
import { useCreateNewPostMutation } from '@/api/slices/postApiSlice'

const STEPS = [
    'CHOOSE_MEDIA',
    'CROP_MEDIA',
    'EDIT_MEDIA',
    'CREATE_POST',
    'SHARE_POST',
]

function CreatePost({ children, asChild = false }) {
    const mediaPosts = useSelector(state => state.createPost.mediaPosts)
    const indexSelectedMedia = useSelector(
        state => state.createPost.indexSelectedMedia
    )
    const isOpenCreatePost = useSelector(
        state => state.createPost.isOpenCreatePost
    )
    const [isOpenDiscardPost, setOpenDiscardPost] = useState(false)

    const [currentStep, setCurrentStep] = useState(0)

    const dispatch = useDispatch()

    const [createNewPost, { isLoading, isSuccess, isError, reset }] =
        useCreateNewPostMutation()

    const handleMediaSelect = (action = '') => {
        if (action === 'back' && indexSelectedMedia > 0) {
            dispatch(setIndexSelectedMedia(indexSelectedMedia - 1))
        } else if (
            action === 'next' &&
            indexSelectedMedia < mediaPosts.length - 1
        ) {
            dispatch(setIndexSelectedMedia(indexSelectedMedia + 1))
        }
    }

    const handleCropMedia = media => {
        setIndexSelectedMedia(media)
        setCurrentStep(1)
    }

    const handleBack = () => {
        if (currentStep === 1) {
            dispatch(clearCreatePost())
        }

        if (currentStep >= 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handleOpenCreatePost = () => {
        if (
            isOpenCreatePost &&
            mediaPosts.length > 0 &&
            mediaPosts.length < 4 &&
            !isLoading &&
            !isSuccess &&
            !isError
        ) {
            setOpenDiscardPost(true)
        } else {
            dispatch(setOpenCreatePost(!isOpenCreatePost))
        }

        if (isOpenCreatePost && (isSuccess || isError)) {
            handleDiscardPost()
        }
    }

    const handleDiscardPost = () => {
        dispatch(clearCreatePost())
        setOpenDiscardPost(false)
        setCurrentStep(0)
        dispatch(setOpenCreatePost(false))
        dispatch(setMediaPosts([]))
        reset()
    }

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <ImportImgOrVideo handleNext={handleNext} />
            case 1:
                return (
                    <CropPosts
                        handleBack={handleBack}
                        handleNext={handleNext}
                        handleMediaSelect={handleMediaSelect}
                        indexSelectedMedia={indexSelectedMedia}
                        mediaPostsLength={mediaPosts.length}
                    />
                )
            case 2:
                return (
                    <EditPost
                        handleMediaSelect={handleMediaSelect}
                        indexSelectedMedia={indexSelectedMedia}
                        mediaPost={mediaPosts[indexSelectedMedia]}
                        mediaPostsLength={mediaPosts.length}
                        handleBack={handleBack}
                        handleNext={handleNext}
                    />
                )
            case 3:
                return (
                    <CreateNewPost
                        handleMediaSelect={handleMediaSelect}
                        indexSelectedMedia={indexSelectedMedia}
                        mediaPost={mediaPosts[indexSelectedMedia]}
                        mediaPostsLength={mediaPosts.length}
                        handleBack={handleBack}
                        createNewPost={createNewPost}
                    />
                )
            default:
                return null
        }
    }

    return (
        <>
            <Dialog open={isOpenCreatePost} onOpenChange={handleOpenCreatePost}>
                <DialogTrigger asChild={asChild} className='h-full w-full'>
                    {children}
                </DialogTrigger>
                <DialogPortal>
                    <DialogOverlay className='fixed inset-0 select-none bg-[--black-a9]'>
                        <VisuallyHidden.Root>
                            <DialogTitle></DialogTitle>
                            <DialogDescription>
                                Share your photos and videos
                            </DialogDescription>
                        </VisuallyHidden.Root>
                        <DialogContent
                            id='Dialog-CreatePost'
                            className='fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform'
                        >
                            <div className='m-5 max-h-[770px] min-h-[391px] min-w-[519px] max-w-[859px] overflow-hidden rounded-[12px] bg-[--ig-elevated-background]'>
                                {isLoading || isSuccess || isError ? (
                                    <Sharing
                                        isLoading={isLoading}
                                        isSuccess={isSuccess}
                                        isError={isError}
                                    />
                                ) : (
                                    renderStep()
                                )}
                            </div>
                        </DialogContent>
                        <DialogClose className='absolute right-3 top-3 p-2'>
                            <CloseIcon className='h-[18px] w-[18px] text-[--ig-primary-text]' />
                        </DialogClose>
                    </DialogOverlay>
                </DialogPortal>
            </Dialog>
            <Dialog open={isOpenDiscardPost} onOpenChange={setOpenDiscardPost}>
                <DialogPortal>
                    <DialogOverlay className='fixed inset-0 select-none bg-[--black-a9]'>
                        <VisuallyHidden.Root>
                            <DialogTitle></DialogTitle>
                            <DialogDescription>Discard post?</DialogDescription>
                        </VisuallyHidden.Root>
                        <DialogContent
                            id='Dialog-DiscardPost'
                            className='fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform'
                        >
                            <div className='m-5 max-h-[--calc-100-40px] w-[--calc-100vw-88px] min-w-[260px] max-w-[400px]'>
                                <div className='flex flex-col justify-center overflow-hidden rounded-[12px] bg-[--ig-elevated-background]'>
                                    <div className='m-8 flex flex-col items-center justify-center'>
                                        <h3 className='text-[20px] leading-6 text-[--ig-primary-text]'>
                                            Discard post?
                                        </h3>
                                        <span className='pt-2 text-[14px] leading-5 text-[--ig-secondary-text]'>
                                            If you leave, your edits won&apos;t
                                            be saved.
                                        </span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <button
                                            onClick={handleDiscardPost}
                                            className='min-h-[48px] border-t border-[--ig-elevated-separator] px-2 py-1 text-sm font-bold text-[--ig-error-or-destructive] active:bg-[--ig-background-opacity-10]'
                                        >
                                            Discard
                                        </button>
                                        <button
                                            onClick={() =>
                                                setOpenDiscardPost(false)
                                            }
                                            className='min-h-[48px] border-t border-[--ig-elevated-separator] px-2 py-1 text-sm text-[--ig-primary-text] active:bg-[--ig-background-opacity-10]'
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                        <DialogClose className='absolute right-3 top-3 p-2'>
                            <CloseIcon className='h-[18px] w-[18px] text-[--ig-primary-text]' />
                        </DialogClose>
                    </DialogOverlay>
                </DialogPortal>
            </Dialog>
        </>
    )
}

export default CreatePost
