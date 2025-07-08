import { useEffect, useState } from 'react'
import EmblaCarouselPost from './EmblaCarouselPost'

import { useGetPostMutation } from '@/api/slices/postApiSlice'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { ReplyProvider } from '@/contexts/ReplyContext'
import RightPost from './RightPost'
import { setUsers } from '@/redux/features/user'

function PostPage() {
    const [isFollow, setIsFollow] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [post, setPost] = useState(null)
    const dispatch = useDispatch()
    const { postId } = useParams()
    const [getListPosts, { isLoading, isError }] = useGetPostMutation()

    const handleFollow = () => {
        if (!isFollow) {
            setIsFollow(true)
        }
    }

    const handleConfirmUnfollow = () => {
        if (isFollow) {
            setIsFollow(false)
        }
    }

    const handleToggleLike = () => {
        setIsLiked(!isLiked)
    }

    const fetchPosts = async () => {
        try {
            const result = await getListPosts(postId)
            setPost(result?.data?.metadata)
        } catch (error) {
            console.log('Lỗi fetch data list posts!')
            return null
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    if (isLoading || !post) {
        return <div>Loading...</div>
    }

    return (
        <>
            <section className='flex h-screen w-full flex-grow flex-col'>
                <main className='flex h-screen w-full flex-grow flex-col items-center justify-center bg-[--ig-primary-background]'>
                    <div className='mx-auto mb-4 w-[--full-40px] max-w-[--polaris-site-width-wide] flex-grow px-5 pt-[calc(4vh)]'>
                        <div className=' border border-[--ig-elevated-separator]'>
                            <div className='flex flex-grow'>
                                <div className='flex min-h-[450px] min-w-[405px] flex-grow flex-col items-center justify-center overflow-hidden bg-[--web-always-black]'>
                                    <div className='flex flex-grow flex-col items-stretch justify-start'>
                                        {!isLoading && (
                                            <EmblaCarouselPost
                                                dataStoryNotes={
                                                    post?.media
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                                <ReplyProvider>
                                    <RightPost dataPost={post} postPage={true} setPost={setPost} />
                                </ReplyProvider>
                            </div>
                        </div>
                        {/* <PostModal /> */}
                        <div></div>
                        <div></div>
                    </div>
                </main>
            </section>
        </>
    )
}

export default PostPage
