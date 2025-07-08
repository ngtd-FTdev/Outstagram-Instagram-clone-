import BackArrowIcon from '@/assets/icons/backArrowIcon.svg?react'
import { useEffect } from 'react'
import CreateImage from './CreateImage'
import NewReel from './NewReel'
import RightCreatePost from './RightCreatePost'
import { useSelector } from 'react-redux'
import { useCreateNewPostMutation } from '@/api/slices/postApiSlice'
import { toast } from 'sonner'

function CreateNewPost({
    mediaPost,
    handleMediaSelect,
    indexSelectedMedia,
    mediaPostsLength,
    handleBack,
    createNewPost
}) {
    const createPost = useSelector(state => state.createPost)

    const handleSharePost = async () => {
        try {
            const formData = new FormData()

            const metadata = createPost.mediaPosts.reduce(
                (acc, media, index) => {
                    formData.append(`post_file_${index}`, media.file)
                    acc[index] = {
                        type: media.type,
                        mediaUrl: media.mediaUrl,
                        cropSettings: media.cropSettings,
                        edit: media.edit,
                        thumbnail: media.thumbnail,
                    }

                    return acc
                },
                {}
            )

            const postPayload = {
                aspectRatio: createPost.aspectRatio,
                caption: createPost.caption,
                likes_hidden: createPost.advancedSettings.hideLikeAndView,
                comments_disable: createPost.advancedSettings.turnOffCommenting,
                allowed_commenter_type: createPost.allowedCommenterType,
                collaborators: createPost.collaborators,
                location: createPost.location,
                mediaMetadata: metadata,
            }

            formData.append('postData', JSON.stringify(postPayload))

            await createNewPost(formData).unwrap()
        } catch (err) {
            toast.error('Lỗi khi share post')
        }
    }

    return (
        <div className='flex h-full flex-col overflow-hidden'>
            <div className='z-30 flex h-[43px] items-center justify-between border-b border-[--ig-elevated-separator] bg-[--ig-primary-background]'>
                <div
                    onClick={handleBack}
                    className='ml-2 flex cursor-pointer items-center justify-center p-2 active:opacity-50'
                >
                    <BackArrowIcon className='h-6 w-6 text-[--ig-primary-text]' />
                </div>
                <h2 className='text-center text-base font-semibold text-[--ig-primary-text]'>
                    {mediaPost?.type === 'video'
                        ? 'New reel'
                        : 'Create new post'}
                </h2>
                <div
                    onClick={handleSharePost}
                    className='mr-4 cursor-pointer select-none text-sm font-semibold text-[--ig-primary-button] hover:text-[--ig-link] active:opacity-50'
                >
                    Share
                </div>
            </div>
            <div className='flex flex-grow overflow-hidden'>
                <div className='flex w-full'>
                    {mediaPost?.type === 'video' ? (
                        <NewReel
                            handleMediaSelect={handleMediaSelect}
                            indexSelectedMedia={indexSelectedMedia}
                            mediaPostsLength={mediaPostsLength}
                            mediaPost={mediaPost}
                        />
                    ) : (
                        mediaPost && (
                            <CreateImage
                                handleMediaSelect={handleMediaSelect}
                                indexSelectedMedia={indexSelectedMedia}
                                mediaPostsLength={mediaPostsLength}
                                mediaPost={mediaPost}
                            />
                        )
                    )}
                    <RightCreatePost />
                </div>
            </div>
        </div>
    )
}

export default CreateNewPost
