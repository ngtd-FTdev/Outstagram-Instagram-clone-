import EmojiIcon from '@/assets/icons/emojiIcon.svg?react'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAddCommentMutation } from '@/api/slices/postApiSlice'
import PopoverCom from './PopoverCom'
import AddEmoji from './AddEmoji'

const formSchema = z.object({
    comment: z.string().max(2500, {
        message: 'Comment cannot exceed 2500 characters',
    }),
})

const ChatInput = ({ postId, parentId = null, onCommentSuccess }) => {
    const [isScrollHidden, setIsScrollHidden] = useState(false)
    const [addComment, { isLoading }] = useAddCommentMutation()
    const textareaRef = useRef(null)
    const [isEmojiOpen, setIsEmojiOpen] = useState(false)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment: '',
        },
    })

    const commentValue = form.watch('comment')

    const onSubmit = async values => {
        if (!postId) {
            console.error('PostId is required')
            return
        }

        try {
            const response = await addComment({
                postId,
                text: values.comment,
                parentId,
            }).unwrap()

            form.reset()
            const textarea = textareaRef.current
            textarea.style.height = '20px'
            if (onCommentSuccess) {
                onCommentSuccess(response)
            }
        } catch (error) {
            console.error('Failed to add comment:', error)
        }
    }

    const handleInput = e => {
        const textarea = e.target
        textarea.style.height = '20px'
        const scHeight = textarea.scrollHeight

        if (textarea.style.height !== `${scHeight}px`) {
            textarea.style.height = `${scHeight}px`
        }

        setIsScrollHidden(scHeight <= 90)
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

    if (!postId) {
        return null
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name='comment'
                    render={({ field }) => (
                        <FormItem>
                            <div className='flex flex-1 items-center'>
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
                                    <div className='order-3 mr-[6px] flex cursor-pointer items-center text-[--ig-secondary-text] hover:text-[--ig-tertiary-text] active:opacity-50'>
                                        <EmojiIcon className='h-[13px] w-[13px]' />
                                    </div>
                                </PopoverCom>
                                <div className='relative flex max-h-[90px] w-full items-center overflow-auto'>
                                    <FormControl>
                                        <textarea
                                            {...field}
                                            ref={e => {
                                                field.ref(e)
                                                textareaRef.current = e
                                            }}
                                            placeholder='Add a comment...'
                                            className={`order-1 flex h-[20px] text-[--ig-primary-text] max-h-[90px] min-h-[20px] w-full flex-1 resize-none overflow-auto bg-[--ig-primary-background] text-sm placeholder-[--ig-secondary-text] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                isScrollHidden
                                                    ? 'scroll-bar-0'
                                                    : ''
                                            }`}
                                            autoCorrect='off'
                                            autoComplete='off'
                                            tabIndex='0'
                                            maxLength={2500}
                                            disabled={isLoading}
                                            onInput={handleInput}
                                        />
                                    </FormControl>
                                </div>
                                {field.value && (
                                    <div className='mx-2'>
                                        <button
                                            type='submit'
                                            disabled={isLoading}
                                            className='text-sm font-semibold text-[--ig-primary-button] hover:text-[--ig-link] active:opacity-50 disabled:opacity-50'
                                        >
                                            {isLoading ? 'Posting...' : 'Post'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}

export default ChatInput
