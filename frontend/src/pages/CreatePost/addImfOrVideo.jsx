import { setMediaPosts } from '@/redux/features/createPost'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MediaChooseIcon from '@/assets/icons/mediaChooseIcon.svg?react'
import { v4 as uuidv4 } from 'uuid'
import useMediaFileHandler from '@/hooks/useMediaFileHandler'

function ImportImgOrVideo({ handleNext }) {
    const mediaPosts = useSelector(state => state.createPost.mediaPosts)
    const [isDragging, setIsDragging] = useState(false)
    const [error, setError] = useState('')

    const dispatch = useDispatch()

    const handleDragEnter = e => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = e => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = e => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const files = Array.from(e.dataTransfer.files)
        handleFiles(files)
    }

    const handleFileChange = e => {
        const files = Array.from(e.target.files)
        handleFiles(files)
    }

    const { handleFiles } = useMediaFileHandler({
        setError,
        dispatch,
        handleNext,
        lengthMedia: mediaPosts.length
    })

    return (
        <div className='flex flex-col overflow-hidden'>
            <div className='z-30 flex h-[43px] items-center justify-center border-b border-[--ig-elevated-separator] bg-[--ig-primary-background]'>
                <h2 className='text-center text-base font-semibold text-[--ig-primary-text]'>
                    Create new post
                </h2>
            </div>

            <div
                className={`flex h-[519px] max-h-[527px] min-h-[348px] min-w-[348px] max-w-[527px] flex-col items-center p-6 justify-center${isDragging ? 'bg-gray-50' : ''}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className='flex items-center justify-center'>
                    <MediaChooseIcon className='h-[77px] w-[96px] text-[--ig-primary-text]' />
                </div>
                <div className='mt-4'>
                    <h3 className='text-xl font-normal text-[--ig-primary-text]'>
                        Drag photos and videos here
                    </h3>
                </div>
                <div className='mt-6 p-1'>
                    <label className='inline-flex cursor-pointer select-none items-center rounded-[8px] bg-[--ig-primary-button] px-4 py-[7px] text-sm font-semibold text-white hover:bg-[--ig-primary-button-hover] active:opacity-70'>
                        Select from computer
                        <input
                            type='file'
                            className='hidden'
                            onChange={e => {
                                handleFileChange(e)
                                e.target.value = null
                              }}
                            accept='image/jpeg,image/png,image/heic,image/heif,video/mp4,video/quicktime'
                            multiple
                        />
                    </label>
                </div>
            </div>
        </div>
    )
}

export default ImportImgOrVideo
