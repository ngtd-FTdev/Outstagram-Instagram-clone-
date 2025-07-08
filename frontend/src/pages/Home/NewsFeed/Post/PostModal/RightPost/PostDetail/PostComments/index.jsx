import LoadingLargeIcon from '@/assets/icons/loadingLargeIcon.svg?react'
import PlusCircularIcon from '@/assets/icons/plusCircularIcon.svg?react'
import CommentContainer from '@/components/CommentContainer'
import { useGetCommentsMutation } from '@/api/slices/postApiSlice'
import { useReply } from '@/contexts/ReplyContext'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCommentsForPost } from '@/redux/features/post'

function PostComments({ postId }) {
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const { handleReply } = useReply()

    const [getComments] = useGetCommentsMutation()

    const comments = useSelector(state => state.postFeed.comments[postId])

    const commentsData = comments || []

    const dispatch = useDispatch()

    const fetchComments = async (pageNum = 1) => {
        if (!postId) return

        try {
            const response = await getComments({
                postId,
                page: pageNum,
            }).unwrap()

            if (pageNum === 1) {
                dispatch(
                    setCommentsForPost({ postId, data: response.metadata.data })
                )
            }

            setHasMore(response.metadata.data.length === 12) // 12 is the limit from backend
        } catch (error) {
            console.error('Error fetching comments:', error)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    useEffect(() => {
        if (!postId && comments?.length > 0) return

        setLoading(true)
        fetchComments()
    }, [postId])

    const handleLoadMore = () => {
        if (!hasMore || loadingMore || !postId) return
        setLoadingMore(true)
        setPage(prev => prev + 1)
        fetchComments(page + 1)
    }

    if (!postId) {
        return null
    }

    if (loading) {
        return (
            <div className='flex flex-grow flex-col items-center justify-center'>
                <LoadingLargeIcon className='h-[32px] w-[32px] animate-spin text-[--grey-7]' />
            </div>
        )
    }

    return (
        <>
            <div className='flex flex-grow flex-col justify-start'>
                {commentsData?.map(comment => (
                    <CommentContainer
                        key={comment._id}
                        commentsData={comment}
                        onReply={handleReply}
                        postId={postId}
                    />
                ))}
                {hasMore && (
                    <div className='relative flex min-h-10 flex-col justify-center'>
                        {loadingMore ? (
                            <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform'>
                                <LoadingLargeIcon className='h-[32px] w-[32px] animate-spin text-[--grey-7]' />
                            </div>
                        ) : (
                            <button
                                onClick={handleLoadMore}
                                className='flex items-center justify-center p-2'
                            >
                                <PlusCircularIcon className='h-6 w-6 text-[--ig-primary-text]' />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

export default PostComments
