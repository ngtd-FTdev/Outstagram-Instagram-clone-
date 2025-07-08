import { useDispatch, useSelector } from 'react-redux'
import {
    setAspectRatio,
    setCroppedAreaPixels,
} from '@/redux/features/createPost'
import { aspectRatios } from '@/constants/CropConstants'
import { calculateCroppedAreaPixels } from '@/utils/croppedImg'
import { getVideoMetadata } from '@/utils/ffmpeg/videoUtils'
import { useEffect } from 'react'

function SelectCrop() {
    const currentAspectRatio = useSelector(
        state => state.createPost.aspectRatio
    )

    const dispatch = useDispatch()

    const handleAspectRatioChange = ratio => {
        dispatch(setAspectRatio(ratio))
    }

    return (
        <div className='z-10 mb-1 flex flex-col rounded-[8px] bg-[--black-26-08]'>
            {aspectRatios.map(ratio => {
                const Icon = ratio.icon ? ratio.icon : <></>
                return (
                    <div
                        key={ratio.value}
                        className={
                            'flex-grow cursor-pointer select-none border-b border-[--ig-separator] last-of-type:border-b-0'
                        }
                        onClick={() => handleAspectRatioChange(ratio.value)}
                    >
                        <div
                            className={`ml-3 flex flex-grow items-center px-1 ${currentAspectRatio === ratio.value ? 'text-white' : 'text-[--ig-secondary-text]'}`}
                        >
                            <div className='text-sm font-semibold'>
                                {ratio.name}
                            </div>
                            <div className='p-3'>
                                <Icon className='h-6 w-6' />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default SelectCrop
