import LoadPro from '@/assets/img/loadPro.gif'
import LoadProLight from '@/assets/img/loadProLight.gif'
import Success from '@/assets/img/success.gif'
import SuccessLight from '@/assets/img/successLight.gif'

function Sharing({ isLoading, isSuccess, isError }) {
    const saved = localStorage.getItem('theme-mode')
    return (
        <div className='flex flex-col overflow-hidden'>
            <div className='z-30 flex h-[43px] items-center justify-center border-b border-[--ig-elevated-separator] bg-[--ig-primary-background]'>
                <h2 className='text-center text-base font-semibold text-[--ig-primary-text]'>
                    {isLoading && 'Sharing'}
                    {isSuccess && 'Post shared'}
                    {isError && 'Post share error'}
                </h2>
            </div>
            <div className='flex h-[519px] max-h-[527px] min-h-[348px] min-w-[348px] max-w-[527px] flex-col items-center justify-center p-6'>
                <div>
                    {isLoading && (
                        <img
                            className='h-[96px] w-[96px]'
                            src={saved === 'light' ? LoadProLight : LoadPro }
                            alt=''
                        />
                    )}
                    {isSuccess && (
                        <img
                            className='h-[96px] w-[96px]'
                            src={saved === 'light' ? SuccessLight : Success}
                            alt=''
                        />
                    )}
                    {isError && <div></div>}
                </div>
                {(isSuccess || isError) && (
                    <div className='text-[--ig-primary-text] text-center text-xl my-4'>
                        {isSuccess && 'Your post has been shared.'}
                        {isError && 'There was an error sharing the post.'}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Sharing
