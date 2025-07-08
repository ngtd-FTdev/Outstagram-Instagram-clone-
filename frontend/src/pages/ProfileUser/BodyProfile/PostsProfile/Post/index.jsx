import PinnedIcon from '@/assets/icons/PinnedIcon.svg?react'
import CarouselIcon from '@/assets/icons/carouselIcon.svg?react'
import ClipIcon from '@/assets/icons/clipIcon.svg?react'
import CommentIconSolid from '@/assets/icons/commentIconSolid.svg?react'
import HeartIconSolid from '@/assets/icons/heartIconSolid.svg?react'
import Modal from '@/components/modal'
import { useSelector } from 'react-redux'

function PostProfile({ postId, iconHidden = false }) {
    const post = useSelector(state => state.postFeed.postsById[postId])
    return (
        <Modal
            nameModal='Post_Modal'
            pathReplace={`/p/${post?._id}`}
            asChild={true}
            dataPost={post}
        >
            <div className='group relative select-none'>
                <div className='flex-grow cursor-pointer group-active:opacity-50'>
                    <div className='aspect-[3/4] overflow-hidden bg-[--ig-highlight-background]'>
                        {post?.media?.[0]?.type === 'video' ? (
                            <video src={post?.media[0]?.url_media} />
                        ) : (
                            <img
                                className='h-full w-full object-cover object-center'
                                src={post?.media[0]?.url_media}
                                alt=''
                            />
                        )}
                    </div>
                    <div></div>
                </div>
                <div className='absolute left-0 right-0 top-0 flex justify-end'>
                    <div className='m-2'>
                        {post?.pinned && (
                            <PinnedIcon className='h-5 w-5 text-[--web-always-white]' />
                        )}
                        {!iconHidden && (
                            <>
                                {!post?.pinned && post?.type === 'post' && (
                                    <CarouselIcon className='h-5 w-5 text-[--web-always-white]' />
                                )}
                                {!post?.pinned && post?.type === 'reel' && (
                                    <ClipIcon className='h-5 w-5 text-[--web-always-white]' />
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className='absolute inset-0 hidden cursor-pointer bg-black/30 group-hover:block'>
                    <ul className='flex h-full w-full items-center justify-center gap-[30px] text-base font-bold leading-4 text-white'>
                        <li className='flex items-center justify-center gap-[7px]'>
                            <span>
                                <HeartIconSolid className='h-5 w-5' />
                            </span>
                            <span>{post?.likes}</span>
                        </li>
                        <li className='flex items-center justify-center gap-[7px]'>
                            <span>
                                <CommentIconSolid className='h-5 w-5' />
                            </span>
                            <span>{post?.comments}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </Modal>
    )
}

export default PostProfile
