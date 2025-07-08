import { useState } from 'react'
import { motion } from 'framer-motion'

const OPTIONS = [
    {
        key: 'delete',
        label: 'Delete',
        className: 'text-[--ig-error-or-destructive] font-bold',
        show: ({ isOwner }) => isOwner,
        onClick: ({ props, handleCloseButton }) => {
            props.onDelete?.()
            handleCloseButton()
        },
    },
    {
        key: 'unfollow',
        label: 'Unfollow',
        className: 'text-[--ig-error-or-destructive] font-bold',
        show: ({ isOwner, isFollow }) => !isOwner && isFollow,
        onClick: ({ props, handleCloseButton }) => {
            props.onUnfollow?.()
            handleCloseButton?.()
        },
    },
    {
        key: 'goToPost',
        label: 'Go to post',
        className: 'text-[--ig-primary-text]',
        show: () => true,
        onClick: ({ props, handleCloseButton }) => {
            props.onGoToPost?.()
            handleCloseButton?.()
        },
    },
    {
        key: 'copyLink',
        label: 'Copy link',
        className: 'text-[--ig-primary-text]',
        show: () => true,
        onClick: ({ props, handleCloseButton }) => {
            props.onCopyLink?.()
            handleCloseButton?.()
        },
    },
    {
        key: 'cancel',
        label: 'Cancel',
        className: 'text-[--ig-primary-text]',
        show: () => true,
        onClick: ({ props, handleCloseButton }) => handleCloseButton(),
    },
]

function MoreOptions({ isOwner, handleCloseButton, isFollow, ...props }) {
    const [open, setOpen] = useState(true)
    if (!open) return null

    return (
        <motion.div
            initial={{ opacity: 0, scale: 1.2, transformOrigin: 'center' }}
            animate={{ opacity: 1, scale: 1, transformOrigin: 'center' }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            className='m-5 flex max-h-[--calc-100-40px] w-[--calc-100vw-88px] min-w-[260px] max-w-[400px] items-center justify-center rounded-[12px] bg-[--ig-elevated-background]'
        >
            <div className='flex flex-grow flex-col items-center justify-center'>
                {OPTIONS.filter(opt => opt.show({ isOwner, isFollow })).map(
                    (opt, idx) => (
                        <button
                            key={opt.key}
                            className={`min-h-[48px] w-full border-0 px-2 py-1 text-center text-sm outline-none transition active:bg-[--bg-moreOption-ac] ${opt.className} ${idx !== 0 ? 'border-t border-[--ig-elevated-separator]' : ''}`}
                            onClick={() =>
                                opt.onClick({ props, handleCloseButton })
                            }
                        >
                            {opt.label}
                        </button>
                    )
                )}
            </div>
        </motion.div>
    )
}

export default MoreOptions
