function AvatarUser({ profileData }) {
    return (
        <div className='flex flex-grow flex-col items-center justify-center'>
            <div className='flex h-[181px] w-[150px] flex-col items-center justify-end'>
                <div className='cursor-pointer select-none'>
                    <div className='-mb-6 flex min-h-[55px] w-max min-w-[74px] max-w-24 items-start'>
                        <div className='filter-story-note story-note-after relative flex min-h-[42px] max-w-full items-center rounded-[14px] bg-[--ig-bubble-background] p-2 text-center text-[11px]'>
                            <div className='flex min-w-4 items-center overflow-auto text-[--ig-secondary-text]'>
                                Note...
                                {/* <div className='max-h-full max-w-full overflow-hidden'>
                                            <span className='line-clamp-3 leading-[13px] text-[--ig-primary-text]'>
                                                ahlsdvakjsdh
                                                abdjashdlkasdhashdas
                                                jasdhjasjkldcas
                                                zsjdhca
                                            </span>
                                        </div> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col items-center'>
                    <div className='flex items-center justify-center overflow-hidden rounded-full'>
                        <button title='Change profile photo'>
                            <img
                                src={profileData?.profile_pic_url}
                                alt=''
                                className='h-[150px] w-[150px] object-cover'
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AvatarUser
