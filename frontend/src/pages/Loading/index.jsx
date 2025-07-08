import InfoMeta from '@/assets/img/infoMeta.png'
import InstagramImage from '@/assets/img/instagramImage.png'

function Loading() {
    return (
        <>
            <div className='fixed left-0 top-0 z-50 flex h-full w-full select-none items-center justify-center'>
                <img
                    src={InstagramImage}
                    alt=''
                    className='absolute left-1/2 top-1/2 h-[80px] w-[80px] -translate-x-1/2 -translate-y-1/2 transform'
                />
                <span className='absolute bottom-[32px] left-1/2 -translate-x-1/2 transform'>
                    <img src={InfoMeta} alt='' className='h-[37px] w-[72px]' />
                </span>
            </div>
        </>
    )
}

export default Loading
