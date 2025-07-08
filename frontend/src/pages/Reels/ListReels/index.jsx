import { useState, useRef } from 'react'
import ReelItem from './ReelItem'
import { useGetListReelsMutation } from '@/api/slices/postApiSlice'
import InfiniteScroll from 'react-infinite-scroller'
import { incrementPageReel, setPostsData } from '@/redux/features/post'
import { useDispatch, useSelector } from 'react-redux'
import { setUsers } from '@/redux/features/user'

function ListReels() {
    const [isMute, setMute] = useState(true)
    const [hasNextPage, setHasNextPage] = useState(true)
    const loadingRef = useRef(false)

    const { reelIds, postsById, pageReel, firstReelId, lastReelId } =
        useSelector(state => state.postFeed)

    const dispatch = useDispatch()
    const [getListReels, { isLoading, isError }] = useGetListReelsMutation()

    const fetchListReels = async () => {
        if (loadingRef.current || !hasNextPage) return
        loadingRef.current = true
        try {
            const result = await getListReels({
                page: pageReel,
                limit: 10,
                firstPostId: firstReelId,
                lastPostId: lastReelId,
            }).unwrap()

            const newReels = result?.metadata?.data || []

            if (newReels.length < 10) {
                setHasNextPage(false)
            }

            dispatch(
                setPostsData({
                    postsArray: newReels,
                    page: pageReel,
                    target: 'reel',
                })
            )
            dispatch(incrementPageReel())

            const authors = newReels.map(post => post.author)
            dispatch(setUsers(authors))
        } catch (error) {
            console.log('Lỗi fetch data list reels!', error)
        } finally {
            loadingRef.current = false
        }
    }

    if (isError) return <div>Error loading reels</div>

    const reelList = reelIds.map(id => postsById[id]).filter(Boolean)

    return (
        <InfiniteScroll
            pageStart={1}
            loadMore={fetchListReels}
            hasMore={hasNextPage && !isLoading}
            loader={<div key='loader'>Loading ...</div>}
        >
            {reelList.map((item, index) => (
                <div key={item._id || index}>
                    <ReelItem
                        isMute={isMute}
                        setMute={setMute}
                        id={item._id}
                        data={item}
                    />
                    <div className='h-4 w-full'></div>
                </div>
            ))}
        </InfiniteScroll>
    )
}

export default ListReels
