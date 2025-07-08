import { useAddCommentMutation } from '@/api/slices/postApiSlice'
import EmojiIcon from '@/assets/icons/emojiIcon.svg?react'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { useReply } from '@/contexts/ReplyContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addCommentToPost, setReplyComment } from '@/redux/features/post'
import { z } from 'zod'
import PopoverCom from '@/components/PopoverCom'
import AddEmoji from '@/components/AddEmoji'

const formSchema = z.object({
    comment: z.string().nonempty(),
})

function ChatComment({ postId }) {
    const dispatch = useDispatch()
    // Trạng thái lưu comment cha (reply)
    const [replyParent, setReplyParent] = useState(null)
    const [addComment, { isLoading }] = useAddCommentMutation()
    const { replyData, handleClearReply, inputRef } = useReply()
    const [isEmojiOpen, setIsEmojiOpen] = useState(false)
    const textareaRef = useRef(null)

    const user = useSelector(state => state.auth.user)

    // Form hook
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { comment: '' },
    })
    const { watch, setValue, control } = form
    const commentValue = watch('comment')

    // Khi props replyData thay đổi: fill mention và lưu id
    useEffect(() => {
        if (replyData) {
            setReplyParent({ id: replyData.id, username: replyData.username })
            setValue('comment', `@${replyData.username} `)
        }
    }, [replyData, setValue])

    // Theo dõi nếu user xóa mention thì clear reply
    useEffect(() => {
        if (
            replyParent &&
            !commentValue.startsWith(`@${replyParent.username} `)
        ) {
            setReplyParent(null)
            handleClearReply?.()
        }
    }, [commentValue, replyParent, handleClearReply])

    // Submit comment hoặc reply
    const onSubmit = async values => {
        try {
            const response = await addComment({
                postId: postId,
                text: values.comment,
                parentId: replyParent ? replyParent.id : null,
            }).unwrap()

            // Create a new object with the response data and user information
            const commentWithUser = {
                ...response.metadata,
                user: user,
            }

            // Trong phần xử lý submit
            if (!response.metadata.comment_parent) {
                dispatch(
                    addCommentToPost({
                        postId,
                        comment: commentWithUser,
                    })
                )
            } 
            // else {
            //     dispatch(setReplyComment({ postId }))
            // }

            form.reset()
            const textarea = textareaRef.current
            if (textarea) textarea.style.height = '20px'

            // Reset sau khi gửi
            setReplyParent(null)
            handleClearReply?.()
        } catch (error) {
            console.error('Failed to add comment:', error)
        }
    }

    // Tự động điều chỉnh chiều cao textarea
    const handleInput = e => {
        e.target.style.height = '20px'
        const scrollHeight = e.target.scrollHeight
        e.target.style.height = `${scrollHeight}px`
    }

    const insertText = emoji => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const value = form.getValues('comment')
        const newValue = value.slice(0, start) + emoji + value.slice(end)

        form.setValue('comment', newValue, { shouldValidate: true })

        setTimeout(() => {
            if (textarea) {
                textarea.focus()
                const newCursorPos = start + emoji.length
                textarea.setSelectionRange(newCursorPos, newCursorPos)
            }
        }, 0)
    }

    return (
        <div className='order-5 border-t border-[--ig-separator] py-[6px] pr-4'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={control}
                        name='comment'
                        render={({ field }) => (
                            <FormItem>
                                <div className='flex items-center'>
                                    <PopoverCom
                                        BodyPop={() => (
                                            <AddEmoji
                                                insertText={insertText}
                                                className='h-[325px] w-[333px]'
                                            />
                                        )}
                                        side='top'
                                        modal={true}
                                        asChild={true}
                                        sideOffset={5}
                                        open={isEmojiOpen}
                                        onOpenChange={setIsEmojiOpen}
                                    >
                                        <div className='flex cursor-pointer px-4 py-2 text-[--ig-secondary-text] hover:text-[--ig-tertiary-text]'>
                                            <EmojiIcon className='h-6 w-6' />
                                        </div>
                                    </PopoverCom>
                                    <FormControl>
                                        <textarea
                                            {...field}
                                            ref={e => {
                                                field.ref(e)
                                                textareaRef.current = e
                                                inputRef.current = e
                                            }}
                                            maxLength={2500}
                                            placeholder='Add a comment...'
                                            className='h-[20px] max-h-[80px] min-h-[20px] flex-1 resize-none overflow-auto bg-[--ig-primary-background] text-sm text-[--ig-primary-text] placeholder-[--ig-secondary-text] outline-none'
                                            onInput={handleInput}
                                        />
                                    </FormControl>
                                    <button
                                        type='submit'
                                        className='ml-2 text-sm font-semibold text-[--ig-primary-button] hover:text-[--ig-link] disabled:opacity-50'
                                        disabled={!field.value || isLoading}
                                    >
                                        Post
                                    </button>
                                </div>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    )
}

export default ChatComment
