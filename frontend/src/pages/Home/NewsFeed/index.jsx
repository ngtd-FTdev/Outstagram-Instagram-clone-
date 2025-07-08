import { useGetListPosts2Mutation } from '@/api/slices/postApiSlice'
import Post from '@/pages/Home/NewsFeed/Post'
import { setPostsData, incrementPagePost } from '@/redux/features/post'
import { useEffect, useRef, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Virtuoso } from 'react-virtuoso'
import NewsFeedLoading from './NewsFeedLoading'
import { setUsers } from '@/redux/features/user'

function NewsFeed() {
    const [getListPosts2, { isLoading }] = useGetListPosts2Mutation()
    const dispatch = useDispatch()
    const loadingRef = useRef(false)
    const [hasNextPage, setHasNextPage] = useState(true)

    const { homeIds, firstPostId, lastPostId, pagePost } = useSelector(
        state => state.postFeed
    )

    const fetchListPosts = useCallback(
        async pageNum => {
            if (loadingRef.current || !hasNextPage) return
            loadingRef.current = true
            try {
                const result = await getListPosts2({
                    page: pageNum,
                    firstPostId,
                    lastPostId,
                    limit: 10,
                }).unwrap()

                const data = result?.metadata?.data || []

                if (data?.length < 10) {
                    setHasNextPage(false)
                }

                dispatch(
                    setPostsData({
                        postsArray: data || [],
                        page: pageNum,
                        target: 'home',
                    })
                )

                const authors = data.map(post => post.author)
                dispatch(setUsers(authors))
            } catch (err) {
                console.error('Lỗi fetch data list posts!', err)
            } finally {
                loadingRef.current = false
            }
        },
        [getListPosts2, dispatch, firstPostId, lastPostId, hasNextPage]
    )

    useEffect(() => {
        fetchListPosts(pagePost)
    }, [pagePost])

    const handleEndReached = () => {
        if (!isLoading && hasNextPage) {
            dispatch(incrementPagePost())
        }
    }

    if (isLoading && pagePost === 1) {
        return <NewsFeedLoading />
    }

    return (
        <div className='h-full w-[min(470px,100vw)] max-w-full'>
            {homeIds.length > 0 ? (
                <Virtuoso
                    useWindowScroll
                    style={{ height: '100%' }}
                    data={homeIds}
                    endReached={handleEndReached}
                    itemContent={(index, postId) => (
                        <Post key={postId} postId={postId} />
                    )}
                />
            ) : (
                <NewsFeedLoading />
            )}
        </div>
    )
}

export default NewsFeed
