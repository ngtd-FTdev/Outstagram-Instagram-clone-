import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import emojiCategories from '@/data/emojiCategories.json'
import { PopoverArrow } from '@radix-ui/react-popover'

const EmojiPicker = ({ onEmojiClick, children }) => {
    const handleEmojiClick = emoji => {
        onEmojiClick(emoji)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                className='w-[320px] space-y-3 rounded-xl border border-[--ig-elevated-separator] bg-[--ig-elevated-background] p-4 shadow-lg'
                side='top'
                align='start'
            >
                <div className='max-h-[350px] space-y-3 overflow-y-auto pr-2'>
                    {Object.entries(emojiCategories).map(([category, emojis]) => (
                        <div key={category} className='space-y-2'>
                            <h3 className='text-sm font-semibold text-[--ig-secondary-text]'>
                                {category}
                            </h3>
                            <div className='grid grid-cols-7 gap-2'>
                                {emojis.map((emoji, index) => (
                                    <button
                                        key={`${category}-${index}`}
                                        className='flex h-8 w-8 items-center justify-center rounded-lg text-xl hover:bg-[--ig-highlight-background] focus:outline-none'
                                        onClick={() => handleEmojiClick(emoji)}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <PopoverArrow className='fill-[--ig-elevated-background] translate-x-[5px] w-[20px] h-[10px]' />
            </PopoverContent>
        </Popover>
    )
}

export default EmojiPicker
