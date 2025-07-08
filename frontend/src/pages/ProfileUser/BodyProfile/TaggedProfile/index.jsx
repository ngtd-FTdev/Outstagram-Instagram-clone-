import PhotoUserCircularIcon from '@/assets/icons/PhotoUserCircularIcon.svg?react'

import chunkArray from '@/utils/formatDataPost'
import { useEffect, useState } from 'react'
import PostProfile from '../PostsProfile/Post'
import FeatureDeveloping from '@/components/FeatureDeveloping'

function TaggedProfile() {
    const [chunkPosts, setChunkPosts] = useState([])
    const [data, setData] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    const fit = true
    
    useEffect(() => {
        setChunkPosts(chunkArray(data, 3))
    }, [data])

    if (fit) {
        return <FeatureDeveloping />
    }

    return (
        <>
            <div className='flex flex-col items-center gap-1'>
                {data.length !== 0 ? (
                    chunkPosts?.map((posts, index) => (
                        <div className='grid grid-cols-3 gap-1' key={index}>
                            {[0, 1, 2].map(i => {
                                const post = posts[i]
                                if (post) {
                                    return <PostProfile key={index + i} />
                                }
                                return (
                                    <div
                                        className='relative flex-grow'
                                        key={index + i}
                                    ></div>
                                )
                            })}
                        </div>
                    ))
                ) : (
                    <div className='mx-11 my-[60px] flex max-w-[350px] flex-col items-center'>
                        <PhotoUserCircularIcon className='h-[62px] w-[62px] text-[--ig-primary-text]' />
                        <div className='my-6 text-center'>
                            <span className='text-[30px] font-extrabold text-[--ig-primary-text]'>
                                Photos of you
                            </span>
                        </div>
                        <div className='mb-6 text-center'>
                            <span className='text-sm font-normal text-[--ig-primary-text]'>
                                When people tag you in photos, they&apos;ll
                                appear here.
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default TaggedProfile
