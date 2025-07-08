import SavedCircularIcon from '@/assets/icons/SavedCircularIcon.svg?react'
import Modal from '@/components/modal'
import chunkArray from '@/utils/formatDataPost'
import { useEffect, useState } from 'react'
import Collections from './Collections'
import FeatureDeveloping from '@/components/FeatureDeveloping'

function SavedProfile() {
    const [chunkPosts, setChunkPosts] = useState([])
    const [data, setData] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    useEffect(() => {
        setChunkPosts(chunkArray(data, 4))
    }, [data])

    return (
        <div>
            <div className='mb-4 mt-7 flex items-center'>
                <span className='flex-grow text-xs font-normal text-[--ig-secondary-text]'>
                    Only you can see what you&apos;ve saved
                </span>
                <Modal asChild={true}>
                    <div className='flex cursor-pointer items-center text-sm font-semibold text-[--ig-primary-button] outline-none hover:text-[--ig-link] active:opacity-50'>
                        + New Collection
                    </div>
                </Modal>
            </div>
            <div className='flex flex-col items-center'>
                {/* <div className='mx-11 my-[60px] flex max-w-[350px] flex-col items-center'>
                    <SavedCircularIcon className='h-[62px] w-[62px] text-[--ig-primary-text]' />
                    <div className='my-6 text-center'>
                        <span className='text-[30px] font-extrabold text-[--ig-primary-text]'>
                            Save
                        </span>
                    </div>
                    <div className='mb-6 text-center'>
                        <span className='text-sm font-normal text-[--ig-primary-text]'>
                            Save photos and videos that you want to see again.
                            No one is notified, and only you can see what
                            you&apos;ve saved.
                        </span>
                    </div>
                </div> */}
                {/* <Collections /> */}
                <FeatureDeveloping />
            </div>
        </div>
    )
}

export default SavedProfile
