import CarouselIcon from '@/assets/icons/carouselIcon.svg?react'
import ReelIconSolid from '@/assets/icons/reelIconSolid.svg?react'
import CommentIconSolid from '@/assets/icons/commentIconSolid.svg?react'
import HeartIconSolid from '@/assets/icons/heartIconSolid.svg?react'
import Modal from '@/components/modal'

function getGridClass(postsLength) {
    if (postsLength === 1) return 'grid-cols-1 grid-rows-1'
    if (postsLength === 2) return 'grid-cols-2 grid-rows-1'
    if (postsLength === 3) return 'grid-cols-3 grid-rows-1'
    if (postsLength === 4) return 'grid-cols-2 grid-rows-2'
    return 'grid-cols-3 grid-rows-2'
}

function renderPostItem(post, index, isGrid = false) {
    return (
        <Modal
            key={post?._id}
            nameModal='Post_Modal'
            pathReplace={`/p/${post?._id}`}
            asChild={true}
            dataPost={post}
        >
            <div
                className={
                    isGrid
                        ? `grid-post-${index} group relative h-full cursor-pointer ${index === 4 ? 'col-span-1 row-span-2' : ''}`
                        : 'group relative aspect-square h-full w-[--explore-width-post] cursor-pointer'
                }
            >
                <div className='h-full w-full'>
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
                <div className='absolute inset-0 mr-[15px] mt-[15px] flex flex-col items-end'>
                    {post?.type === 'reel' ? (
                        <ReelIconSolid className='h-6 w-6 text-[--ig-stroke-on-media]' />
                    ) : (
                        <CarouselIcon className='h-6 w-6 text-[--ig-stroke-on-media]' />
                    )}
                </div>
                <div className='absolute inset-0 hidden bg-black/30 group-hover:block'>
                    <ul className='flex h-full w-full items-center justify-center gap-[30px] text-base font-bold leading-4 text-white'>
                        <li className='flex items-center justify-center gap-[7px]'>
                            <span>
                                <HeartIconSolid className='h-5 w-5' />
                            </span>
                            <span>{post?.likes || 0}</span>
                        </li>
                        <li className='flex items-center justify-center gap-[7px]'>
                            <span>
                                <CommentIconSolid className='h-5 w-5' />
                            </span>
                            <span>{post?.comments || 0}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </Modal>
    )
}

function PostsContainer({ indexPosts, posts }) {
    return (
        <>
            {posts?.length < 5 ? (
                <div className='mb-1 flex flex-wrap h-full gap-1'>
                    {posts?.map((post, idx) => renderPostItem(post, idx, false))}
                </div>
            ) : (
                <div
                    className={`mb-1 grid h-full gap-1 ${indexPosts % 2 == 0 ? 'grid-layout-posts' : 'grid-layout-posts-reverse'} ${getGridClass(posts?.length)}`}
                >
                    {posts?.map((post, idx) => renderPostItem(post, idx, true))}
                </div>
            )}
        </>
    )
}

export default PostsContainer
