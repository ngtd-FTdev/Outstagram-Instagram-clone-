import chunkArray from '@/utils/formatDataPost'
import { useContext, useEffect, useState } from 'react'
import PostProfile from '../PostsProfile/Post'
import { useGetReelByUsernameMutation } from '@/api/slices/postApiSlice'
import { PostsContext } from '../..'
import InfiniteScroll from 'react-infinite-scroller'
import { useDispatch } from 'react-redux'
import { setUsers } from '@/redux/features/user'
import { setPostsData } from '@/redux/features/post'

function ReelsProfile() {
    const [hasNextPage, setHasNextPage] = useState(true)
    const { posts, setPosts, userName } = useContext(PostsContext)
    const [getReelByUsername, { isLoading }] = useGetReelByUsernameMutation()
    const [page, setPage] = useState(1)
    const [lastPostId, setLastPostId] = useState(null)

    const dispatch = useDispatch()

    const fetchPosts = async (pageToFetch = 1, lastId = null) => {
        const response = await getReelByUsername({ userName, page: pageToFetch, limit: 12, lastPostId: lastId })
        const data = response?.data?.metadata?.data || []
        if (data.length < 12) {
            setHasNextPage(false)
        }
        if (pageToFetch === 1) {
            setPosts(data)
        } else {
            setPosts(prev => [...prev, ...data])
        }
        if (data.length > 0) {
            setLastPostId(data[data.length - 1]._id)
            dispatch(setUsers([data?.[0]?.author]))
        }
        dispatch(setPostsData({ postsArray: data, target: 'profile' }))
    }

    useEffect(() => {
        setPage(1)
        setLastPostId(null)
        setHasNextPage(true)
        fetchPosts(1, null)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userName])

    const loadMore = () => {
        if (!isLoading && hasNextPage) {
            const nextPage = page + 1
            setPage(nextPage)
            fetchPosts(nextPage, lastPostId)
        }
    }

    const chunkedPosts = chunkArray(posts, 4)

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
                        <div className='grid grid-cols-4 gap-1' key={index}>
                            {[0, 1, 2, 3].map(i => {
                                const post = posts[i]
                                if (post) {
                                    return <PostProfile key={index + i} postId={post?._id} iconHidden={true} />
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
                            {/* You can add a placeholder icon here if needed */}
                        </div>
                        <div className='mb-5 mt-6 text-center'>
                            <span className='text-[30px] font-extrabold text-[--ig-primary-text]'>
                                No Reels Yet
                            </span>
                        </div>
                        <div className='mb-5 text-center'>
                            <span className='text-sm font-normal text-[--ig-primary-text]'>
                                When you share reels, they will appear on your profile.
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ReelsProfile
