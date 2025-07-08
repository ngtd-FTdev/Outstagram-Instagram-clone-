import CammeraCircularIcon from '@/assets/icons/CammeraCircularIcon.svg?react'
import CreatePost from '@/pages/CreatePost/CreatePost'
import chunkArray from '@/utils/formatDataPost'
import { useContext, useEffect, useRef, useState } from 'react'
import PostProfile from './Post'
import { PostsContext } from '../..'
import { useGetPostsByUsernameMutation } from '@/api/slices/postApiSlice'
import InfiniteScroll from 'react-infinite-scroller'
import { setPostsData } from '@/redux/features/post'
import { useDispatch } from 'react-redux'
import { setUsers } from '@/redux/features/user'
import { useParams } from 'react-router-dom'

function PostsProfile() {
    const [hasNextPage, setHasNextPage] = useState(true)
    const { posts, setPosts, userName } = useContext(PostsContext)
    const [getPostsByUserId, { isLoading }] = useGetPostsByUsernameMutation()
    const [page, setPage] = useState(1)
    const [lastPostId, setLastPostId] = useState(null)
    const hasFetchedRef = useRef(false)

    const dispatch = useDispatch()

    const fetchPosts = async (pageToFetch = 1, lastId = null) => {
        if (!isLoading && !hasNextPage) return
        const response = await getPostsByUserId({
            userName,
            page: pageToFetch,
            limit: 12,
            lastPostId: lastId,
        })
        const data = response?.data?.metadata?.data || []
        if (data.length < 12) setHasNextPage(false)

        if (pageToFetch === 1) {
            setPosts(data)
        } else {
            setPosts(prev => [...prev, ...data])
        }

        if (data.length > 0) {
            setLastPostId(data[data.length - 1]._id)
            dispatch(setUsers([data?.[0]?.author]))
            dispatch(setPostsData({ postsArray: data, target: 'profile' }))
        }

    }

    useEffect(() => {
        if (!hasFetchedRef.current && userName) {
            hasFetchedRef.current = true;
            fetchPosts(1, null);
        }
    }, [userName]);

    const loadMore = () => {
        if (!isLoading && hasNextPage) {
            const nextPage = page + 1
            setPage(nextPage)
            fetchPosts(nextPage, lastPostId)
        }
    }

    const chunkedPosts = chunkArray(posts, 3)

    return (
        <>
            {posts.length !== 0 ? (
                <InfiniteScroll
                    pageStart={1}
                    loadMore={loadMore}
                    hasMore={hasNextPage}
                    loader={<div key={0}>Loading ...</div>}
                    className='flex flex-col gap-1'
                >
                    {chunkedPosts?.map((posts, index) => (
                        <div className='grid grid-cols-3 gap-1' key={index}>
                            {[0, 1, 2].map(i => {
                                const post = posts[i]
                                if (post) {
                                    return (
                                        <PostProfile
                                            key={index + i}
                                            postId={post?._id}
                                        />
                                    )
                                }
                                return (
                                    <div
                                        className='relative flex-grow'
                                        key={index + i}
                                    ></div>
                                )
                            })}
                        </div>
                    ))}
                </InfiniteScroll>
            ) : (
                <div className='relative flex flex-col items-center justify-start'>
                    <div className='mx-11 my-[60px] flex max-w-[350px] flex-col items-center justify-start'>
                        <div>
                            <CammeraCircularIcon className='h-[62px] w-[62px] text-[--ig-primary-text]' />
                        </div>
                        <div className='mb-5 mt-6 text-center'>
                            <span className='text-[30px] font-extrabold text-[--ig-primary-text]'>
                                Share Photos
                            </span>
                        </div>
                        <div className='mb-5 text-center'>
                            <span className='text-sm font-normal text-[--ig-primary-text]'>
                                When you share photos, they will appear on your
                                profile.
                            </span>
                        </div>
                        <CreatePost>
                            <div className='cursor-pointer select-none text-center text-sm font-semibold text-[--ig-primary-button] outline-none hover:text-[--ig-link] active:opacity-50'>
                                Share your first photo
                            </div>
                        </CreatePost>
                    </div>
                </div>
            )}
        </>
    )
}

export default PostsProfile
