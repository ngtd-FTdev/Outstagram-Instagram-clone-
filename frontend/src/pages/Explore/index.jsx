import FooterPage from '@/components/footerPage'
import { useEffect, useRef, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'
import PostsContainer from './PostsContainer'
import { useGetListPostsForExploreMutation } from '@/api/slices/postApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { setPostsData, incrementPageExplore } from '@/redux/features/post'
import chunkArray from '@/utils/formatDataPost'
import { setUsers } from '@/redux/features/user'

function Explore() {
    const [hasNextPage, setHasNextPage] = useState(true)
    const loadingRef = useRef(false)

    const {
        exploreIds,
        postsById,
        pageExplore,
        firstPostExploreId,
        lastPostExploreId,
    } = useSelector(state => state.postFeed)

    const dispatch = useDispatch()
    const [getListPostsForExplore, { isLoading }] =
        useGetListPostsForExploreMutation()

    const fetchListPostsForExplore = async pageNum => {
        if (loadingRef.current || !hasNextPage) return
        loadingRef.current = true

        try {
            const response = await getListPostsForExplore({
                page: pageNum,
                firstPostId: firstPostExploreId,
                lastPostId: lastPostExploreId,
                limit: 10,
            }).unwrap()

            const posts = response?.metadata?.data || []

            if (posts.length < 10) {
                setHasNextPage(false)
            }

            dispatch(
                setPostsData({
                    postsArray: posts,
                    page: pageNum,
                    target: 'explore',
                })
            )

            const authors = posts.map(post => post.author)
            dispatch(setUsers(authors))
        } catch (err) {
            console.error('Lỗi fetch explore posts:', err)
        } finally {
            loadingRef.current = false
        }
    }

    useEffect(() => {
        fetchListPostsForExplore(pageExplore)
        // eslint-disable-next-line
    }, [pageExplore])

    const handleEndReached = () => {
        if (!isLoading && hasNextPage) {
            dispatch(incrementPageExplore())
        }
    }

    const explorePosts = exploreIds.map(id => postsById[id]).filter(Boolean)

    const chunkedPosts = chunkArray(explorePosts, 5)

    return (
        <section className='flex h-full w-full flex-grow flex-col'>
            <main className='flex h-full w-full flex-col items-center pt-8 md:mb-[30px] md:px-5 md:pt-12'>
                <div className='mb-[10px] h-full w-full max-w-[--polaris-site-width-wide] md:mx-auto md:w-calc-explore-width'>
                    <Virtuoso
                        useWindowScroll
                        style={{ height: '100%' }}
                        data={chunkedPosts}
                        endReached={handleEndReached}
                        itemContent={(index, posts) => (
                            <PostsContainer
                                key={index}
                                posts={posts}
                                indexPosts={index}
                            />
                        )}
                    />
                </div>
            </main>
            <FooterPage />
        </section>
    )
}

export default Explore
