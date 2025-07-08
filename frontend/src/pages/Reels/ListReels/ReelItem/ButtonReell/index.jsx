import { useState } from 'react'
import HeartIcon from '@/assets/icons/heartIcon.svg?react'
import HeartIconSolid from '@/assets/icons/heartIconSolid.svg?react'
import CommentIcon from '@/assets/icons/commentIcon.svg?react'
import DirectIcon from '@/assets/icons/directIcon.svg?react'
import SaveIcon from '@/assets/icons/saveIcon.svg?react'
import CloseIcon from '@/assets/icons/closeIcon.svg?react'
import MoreOptionsIcon from '@/assets/icons/moreOptionsIcon.svg?react'
import { Link } from 'react-router-dom'
import { useLikePostMutation } from '@/api/slices/postApiSlice'
import { setLikesForPost } from '@/redux/features/post'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import Modal from '@/components/modal'

function ButtonReel({ data }) {
    const [isLiked, setIsLiked] = useState(data?.isLiked)
    const [isSaved, setIsSaved] = useState(data?.isSaved)
    const [audioSrc, setaudioSrc] = useState(
        'https://res.cloudinary.com/dbma8vpob/image/upload/v1727157466/instagram/img_video_post/imxjfj44hcpx6xirexku.jpg'
    )

    const dispatch = useDispatch()

    const [likePost] = useLikePostMutation()

    const handleLike = async () => {
        try {
            await likePost(data?._id).unwrap()
            setIsLiked(!isLiked)
            dispatch(setLikesForPost({ postId: data?._id, isLiked: !isLiked }))
        } catch (error) {
            toast.error('Like failed!', {
                icon: (
                    <CloseIcon className='overflow-hidden rounded-full bg-green-300 p-[2px] text-base' />
                ),
            })
        }
    }

    return (
        <div className='flex flex-col gap-7'>
            <button
                onClick={handleLike}
                className='flex flex-col items-center gap-1'
            >
                <div>
                    {isLiked ? (
                        <HeartIconSolid className='h-6 w-6 animate-scale-in-out text-[--ig-badge]' />
                    ) : (
                        <HeartIcon className='h-6 w-6 text-[--ig-primary-text]' />
                    )}
                </div>
                <span className='text-xs text-[--ig-primary-text]'>
                    {data?.likes || 0}
                </span>
            </button>
            <Modal
                nameModal='Post_Modal'
                pathReplace={`/p/${data?._id}`}
                asChild={true}
                dataPost={data}
            >
                <button className='flex flex-col items-center gap-1'>
                    <div>
                        <CommentIcon className='h-6 w-6 text-[--ig-primary-text]' />
                    </div>
                    <span className='text-xs text-[--ig-primary-text]'>
                        {data?.comments || 0}
                    </span>
                </button>
            </Modal>

            <button className='flex flex-col items-center'>
                <div>
                    <DirectIcon className='h-6 w-6 text-[--ig-primary-text]' />
                </div>
            </button>

            <button
                onClick={() => setIsSaved(!isSaved)}
                className='flex flex-col items-center'
            >
                <div>
                    <SaveIcon className='h-6 w-6 text-[--ig-primary-text]' />
                </div>
            </button>

            <button className='flex flex-col items-center'>
                <div>
                    <MoreOptionsIcon className='h-6 w-6 text-[--ig-primary-text]' />
                </div>
            </button>

            <div className='flex h-[24px] w-[24px] items-center justify-center overflow-hidden rounded-[4px] border border-[--ig-stroke-on-media]'>
                <Link to='/reels/audio/id' className='h-full w-full'>
                    <img
                        src={audioSrc}
                        alt='Audio Image'
                        onError={e => {
                            e.target.src = '/default-image.png'
                        }}
                    />
                </Link>
            </div>
        </div>
    )
}

export default ButtonReel
