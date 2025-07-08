import CloseIcon from '@/assets/icons/CloseIcon.svg?react'
import AddMedia from '@/assets/icons/AddMedia.svg?react'
import PlayIcon from '@/assets/icons/Play.svg?react'

const MediaPreview = ({ mediaFiles, onClose, onAddMore }) => {
    const renderMediaPreview = (media, index) => {
        const isVideo = media.file.type.startsWith('video/')
        
        return (
            <div key={index} className="relative mr-2 last:mr-0">
                {isVideo ? (
                    <div className="relative h-[70px] w-[70px]">
                        <video
                            src={media.preview}
                            className="h-full w-full rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <PlayIcon className="h-6 w-6 text-white" />
                        </div>
                    </div>
                ) : (
                    <img
                        src={media.preview}
                        alt={`Selected media ${index + 1}`}
                        className="h-[70px] w-[70px] rounded-lg object-cover"
                    />
                )}
                <button
                    onClick={() => onClose(index)}
                    className="absolute -right-1 -top-1 rounded-full bg-[--ig-elevated-separator] p-1 hover:bg-[--ig-secondary-text]"
                >
                    <CloseIcon className="h-4 w-4 text-[--ig-primary-text]" />
                </button>
            </div>
        )
    }

    return (
        <div className="mb-2 flex flex-nowrap items-center overflow-x-auto px-3 pt-3">
            <div 
                onClick={onAddMore}
                className='mt-[2px] ml-[3px] mr-[10px] mb-[6px] flex h-[70px] w-[70px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[--ig-secondary-text] hover:border-[--ig-primary-text]'
            >
                <AddMedia className='h-[24px] w-[24px] text-[--ig-primary-text]' />
            </div>

            {mediaFiles.map((media, index) => renderMediaPreview(media, index))}
        </div>
    )
}

export default MediaPreview 