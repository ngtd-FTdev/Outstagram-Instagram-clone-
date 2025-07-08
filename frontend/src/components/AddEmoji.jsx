import emojiCategories from '@/data/emojiCategories.json'

function AddEmoji({ insertText, className = '' }) {
    const handleEmojiClick = (emoji) => {
        insertText(emoji)
    }

    return (
        <div className={`shadow-xl/30 h-[156px] overflow-y-auto w-[296px] rounded-[6px] bg-[--ig-banner-background] ${className}`}>
            <div className='m-2 flex flex-wrap'>
                {Object.entries(emojiCategories).map(([category, emojis]) => (
                    <div key={category} className='space-y-2'>
                        <h3 className='text-sm font-semibold text-[--ig-secondary-text]'>
                            {category}
                        </h3>
                        <div className='grid grid-cols-6 gap-1'>
                            {emojis.map((emoji, index) => (
                                <button
                                    key={`${category}-${index}`}
                                    className='flex h-10 w-10 items-center justify-center rounded-lg text-xl hover:bg-[--ig-highlight-background] focus:outline-none'
                                    onClick={() => handleEmojiClick(emoji)}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AddEmoji
