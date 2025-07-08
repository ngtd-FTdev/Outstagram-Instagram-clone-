import LoadingIcon from '@/assets/icons/loadingIcon.svg?react'
import { useState } from 'react'
import CommentCard from './CommentCard '
import { useGetCommentsMutation } from '@/api/slices/postApiSlice'

function CommentContainer({ commentsData, onReply }) {
    const [isFollow, setIsFollow] = useState(false)
    const [repliesComment, setRepliesComment] = useState([])
    const [isShowRepliesComments, setIsShowRepliesComments] = useState(false)
    const [getComments, { isLoading: isLoadingGetComments }] =
        useGetCommentsMutation()

    const [pageComment, setPageComment] = useState(0)

    const fetchReplies = async (page = 1) => {
        try {
            const response = await getComments({
                postId: commentsData.post,
                parentId: commentsData._id,
                page: page,
            }).unwrap()

            setRepliesComment([...repliesComment, ...response.metadata.data])
        } catch (error) {
            console.error('Error fetching replies:', error)
        }
    }

    const handleFollow = () => {
        if (!isFollow) {
            setIsFollow(true)
        }
    }

    const handleHidenRepliesComments = () => {
        setIsShowRepliesComments(false)
    }

    const handleShowRepliesComments = async () => {
        if (commentsData?.comments_child > 0 && repliesComment?.length === 0) {
            await fetchReplies(pageComment + 1)
            setPageComment(pageComment + 1)
        }
        if (repliesComment?.length > 0 && commentsData?.comments_child > repliesComment?.length) {
            await fetchReplies(pageComment + 1)
            setPageComment(pageComment + 1)
        }
        setIsShowRepliesComments(true)
    }

    const handleConfirmUnfollow = () => {
        if (isFollow) {
            setIsFollow(false)
        }
    }

    return (
        <div className='mb-4 flex flex-col justify-start'>
            <ul className=''>
                <CommentCard
                    isFollow={isFollow}
                    handleConfirmUnfollow={handleConfirmUnfollow}
                    handleFollow={handleFollow}
                    commentData={commentsData}
                    onReply={onReply}
                />
                <div className='ml-[54px] mt-4 flex w-[--full-54px] flex-col'>
                    {isShowRepliesComments && (
                        <div
                            className={`flex items-center text-center ${isShowRepliesComments ? 'mb-4' : ''}`}
                            onClick={handleHidenRepliesComments}
                        >
                            <button className='flex items-center text-center active:opacity-70'>
                                <div className='mr-4 inline-block w-6 border-b border-[--ig-secondary-text]'></div>
                                <span className='text-center text-xs font-semibold leading-4 text-[--ig-secondary-text]'>
                                    Hide replies
                                </span>
                            </button>
                            {isLoadingGetComments && (
                                <div className='ml-2 h-[18px] w-[18px]'>
                                    <LoadingIcon className='h-[18px] w-[18px] animate-spin text-[--grey-7]' />
                                </div>
                            )}
                        </div>
                    )}
                    {isShowRepliesComments &&
                        repliesComment?.map(comment => {
                            return (
                                <CommentCard
                                    key={comment._id}
                                    commentData={comment}
                                    isFollow={isFollow}
                                    handleConfirmUnfollow={
                                        handleConfirmUnfollow
                                    }
                                    handleFollow={handleFollow}
                                    onReply={onReply}
                                />
                            )
                        })}
                    {commentsData?.comments_child > 0 && (
                        <div
                            className={`flex items-center text-center ${isShowRepliesComments ? 'mt-4' : ''}`}
                            onClick={handleShowRepliesComments}
                        >
                            <button className='flex items-center text-center active:opacity-70'>
                                <div className='mr-4 inline-block w-6 border-b border-[--ig-secondary-text]'></div>
                                <span className='text-center text-xs font-semibold leading-4 text-[--ig-secondary-text]'>
                                    View replies (
                                    {commentsData?.comments_child -
                                        repliesComment?.length}
                                    )
                                </span>
                            </button>
                            {isLoadingGetComments && (
                                <div className='ml-2 h-[18px] w-[18px]'>
                                    <LoadingIcon className='h-[18px] w-[18px] animate-spin text-[--grey-7]' />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </ul>
        </div>
    )
}

export default CommentContainer
