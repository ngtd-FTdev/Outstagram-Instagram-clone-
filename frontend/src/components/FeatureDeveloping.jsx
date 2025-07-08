import SavedCircularIcon from '@/assets/icons/SavedCircularIcon.svg?react'

const FeatureDeveloping = () => {
    return (
        <div className='flex flex-col items-center justify-center py-16'>
            <SavedCircularIcon className='h-[62px] w-[62px] text-[--ig-primary-text]' />
            <div className='my-6 text-center'>
                <span className='text-[22px] font-bold text-[--ig-primary-text]'>
                    Tính năng này đang được phát triển!
                </span>
            </div>
            <div className='mb-6 text-center'>
                <span className='text-sm font-normal text-[--ig-primary-text]'>
                    Vui lòng quay lại sau để trải nghiệm tính năng này.
                </span>
            </div>
        </div>
    )
}

export default FeatureDeveloping; 