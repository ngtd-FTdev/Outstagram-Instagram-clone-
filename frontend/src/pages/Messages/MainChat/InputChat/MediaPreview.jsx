import CloseIcon from '@/assets/icons/CloseIcon.svg?react'
import AddMedia from '@/assets/icons/AddMedia.svg?react'
import PlayIcon from '@/assets/icons/PlayIcon.svg?react'
import playMedia from '@/assets/img/playMedia.png'
import TooltipCom from '@/components/Tooltip'

const MediaPreview = ({ mediaFiles, onClose, onAddMore }) => {
    const renderMediaPreview = (media, index) => {
        const isVideo = media.file.type.startsWith('video/')

        return (
            <div key={index} className='relative mr-2 last:mr-0'>
                {isVideo ? (
                    <div className='relative mb-[6px] ml-[3px] mr-[10px] mt-[2px] h-[70px] w-[70px]'>
                        <video
                            src={media.preview}
                            className='h-full w-full rounded-lg object-cover'
                        />
                        <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
                            <img
                                src={playMedia}
                                alt='Play'
                                className='h-6 w-6'
                            />
                        </div>
                    </div>
                ) : (
                    <img
                        src={media.preview}
                        alt={`Selected media ${index + 1}`}
                        className='mb-[6px] ml-[3px] mr-[10px] mt-[2px] h-[70px] w-[70px] rounded-lg object-cover'
                    />
                )}
                <TooltipCom content='Remove attachment'>
                    <button
                        onClick={() => onClose(index)}
                        className='absolute right-0 -top-[3px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[--ig-secondary-background] hover:bg-[--ig-secondary-button-background]'
                    >
                        <CloseIcon className='h-[9px] w-[9px] text-[--ig-primary-text]' />
                    </button>
                </TooltipCom>
            </div>
        )
    }

    return (
        <div className='flex flex-nowrap items-center overflow-x-auto px-3 pt-3'>
            <TooltipCom content='Upload another photo/video'>
                <div
                    onClick={onAddMore}
                    className='mb-[6px] ml-[3px] mr-[10px] mt-[2px] flex h-[70px] w-[70px] cursor-pointer items-center justify-center rounded-lg bg-[--bg-add-media] active:opacity-50'
                >
                    <AddMedia className='h-[24px] w-[24px] text-[--ig-primary-text]' />
                </div>
            </TooltipCom>

            {mediaFiles.map((media, index) => renderMediaPreview(media, index))}
        </div>
    )
}

export default MediaPreview
