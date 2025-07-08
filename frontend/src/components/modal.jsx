import ArrowCircularIcon from '@/assets/icons/ArrowCircularIcon.svg?react'
import CloseIcon from '@/assets/icons/closeIcon.svg?react'
import { ModalData } from '@/constants/modal'
import useReplacePath from '@/hooks/useReplacePath'
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
import { useEffect, useState } from 'react'

function Modal({
    children,
    nameModal,
    CloseButton = true,
    PrevButton = false,
    PrevButtonClick = null,
    NextButton = false,
    NextButtonClick = null,
    pathReplace = null,
    asChild = false,
    customsDialogContent = null,
    modalComponent,
    ...props
}) {
    const modalComponentFromData = ModalData[nameModal]
    const ModalComp = modalComponent || modalComponentFromData
    const [open, setOpen] = useState(false)
    const { setReplacePath } = useReplacePath(pathReplace)

    useEffect(() => {
        setReplacePath(open)
    }, [open, setReplacePath])

    const handlePrevButton = e => {
        e.stopPropagation()
        if (typeof PrevButtonClick === 'function') {
            PrevButtonClick()
        }
    }
    const handleNextButton = e => {
        e.stopPropagation()
        if (typeof NextButtonClick === 'function') {
            NextButtonClick()
        }
    }

    const handleCloseButton = e => {
        if (e?.stopPropagation) {
            e.stopPropagation()
        }
        setOpen(false)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
                <DialogPortal>
                    <DialogOverlay className='fixed inset-0 flex items-center justify-center bg-[--black-a9]'>
                        <VisuallyHidden.Root>
                            <DialogTitle></DialogTitle>
                            <DialogDescription></DialogDescription>
                        </VisuallyHidden.Root>
                        <DialogContent
                            className={`flex max-h-[--max-h-model] max-w-[--max-w-model] flex-col outline-none ${customsDialogContent ? customsDialogContent : ''}`}
                        >
                            {ModalComp && (
                                <ModalComp
                                    setOpenModal={setOpen}
                                    handleCloseButton={handleCloseButton}
                                    {...props}
                                />
                            )}
                        </DialogContent>
                        {CloseButton && (
                            <DialogClose className='absolute right-3 top-3 p-2'>
                                <div>
                                    <CloseIcon className='h-[18px] w-[18px] text-[--ig-primary-text]' />
                                </div>
                            </DialogClose>
                        )}
                        {PrevButton && (
                            <button
                                className='absolute left-3 top-1/2 ml-[10px] -translate-y-1/2 transform'
                                onClick={NextButtonClick}
                                onPointerDown={e => handlePrevButton(e)}
                            >
                                <ArrowCircularIcon className='h-8 w-8 text-white' />
                            </button>
                        )}
                        {NextButton && (
                            <button
                                className='absolute right-3 top-1/2 mr-[10px] -translate-y-1/2 transform'
                                onClick={PrevButtonClick}
                                onPointerDown={e => handleNextButton(e)}
                            >
                                <ArrowCircularIcon className='h-8 w-8 rotate-180 transform text-white' />
                            </button>
                        )}
                    </DialogOverlay>
                </DialogPortal>
            </Dialog>
        </>
    )
}

export default Modal
