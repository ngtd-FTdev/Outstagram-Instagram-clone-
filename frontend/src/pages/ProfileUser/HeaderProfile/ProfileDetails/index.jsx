import LinkIcon from '@/assets/icons/linkIcon.svg?react'
import Modal from '@/components/modal'

function ProfileDetails({ profileData }) {
    return (
        <div className='flex flex-col'>
            <div>
                <span className='text-sm font-semibold leading-[18px] text-[--ig-primary-text]'>
                    {profileData?.fullName || ''}
                </span>
            </div>
            <div className='cursor-pointer'>
                <span className='inline text-sm font-normal leading-[18px] text-[--ig-primary-text]'>
                    {profileData?.biography || ''}
                </span>
            </div>
            {profileData?.bio_links?.length > 0 && (
                <div className='inline-flex items-center'>
                    <span className='mr-[7px] pt-[3px]'>
                        <LinkIcon className='h-3 w-3 text-[--ig-link]' />
                    </span>
                    <div>
                        <a
                            href='https://l.instagram.com/?u=https%3A%2F%2Ft.me%2Fdesignbackdrops%3Ffbclid%3DPAZXh0bgNhZW0CMTEAAaYAxSJNHJFr_5FTwBhmMiyAt6cRfyO9CNiMpgf7dqhaS_Vt_yXnSSvmKr8_aem_oXaDEkql_KCfBl5niINT0Q&e=AT3A-mZ40eMP9ACTWC0Yfyy7w2YhxbblJDRgA2sYjqOfYm-E7bQkYYst-NmFFDKYllMrKybiQiJykUgPMBeMC9h7kwFySWK8zR8BmlA'
                            target='_blank'
                        >
                            <span className='line-clamp-1 text-sm font-semibold text-[--ig-link] hover:underline active:opacity-50'>
                                getallmylinks.com/lilybrown
                            </span>
                        </a>
                    </div>
                </div>
            )}
            {profileData?.mutualOnly && (
                <Modal asChild={true} pathReplace={'/followers/mutualOnly'}>
                    <div className='mt-[14px] inline cursor-pointer'>
                        <span className='text-xs font-medium text-[--ig-secondary-text]'>
                            Followed by{' '}
                            <span className='font-medium text-[--ig-primary-text]'>
                                4k.animescape
                            </span>
                        </span>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default ProfileDetails
