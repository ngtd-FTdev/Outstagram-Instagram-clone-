function AccountPrivacySettings() {
    return (
        <div className='mx-auto max-w-[700px] flex-grow px-12 py-12'>
            <div className='mb-8'>
                <h1 className='text-[20px] font-bold text-[--ig-primary-text]'>
                    Account privacy
                </h1>
            </div>

            {/* Private Account Toggle */}
            <div>
                <div className='flex items-center mb-8 justify-between rounded-[20px] border border-[--ig-separator] bg-[--ig-primary-background] px-4 py-[22px]'>
                    <div>
                        <h3 className='mb-1 text-base text-[--ig-primary-text]'>
                            Private account
                        </h3>
                    </div>
                    <label className='relative inline-flex cursor-pointer items-center'>
                        <input type='checkbox' className='peer sr-only' />
                        <div className="peer h-6 w-11 rounded-full bg-[#262626] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#0095F6] peer-checked:after:translate-x-full"></div>
                    </label>
                </div>

                {/* Description Text */}
                <div className='mt-4 space-y-3 text-xs text-[--ig-secondary-text]'>
                    <p>
                        When your account is public, your profile and posts can
                        be seen by anyone, on or off Instagram, even if they
                        don&apos;t have an Instagram account.
                    </p>
                    <p>
                        When your account is private, only the followers you
                        approve can see what you share, including your photos or
                        videos on hashtag and location pages, and your followers
                        and following lists. Certain info on your profile, like
                        your profile picture and username, is visible to
                        everyone on and off Instagram.{' '}
                        <a
                            href='#'
                            className='text-[--ig-colors-button-borderless-text] hover:text-[--ig-colors-button-borderless-text--pressed] hover:underline active:text-[--ig-colors-button-borderless-text--pressed] active:underline active:opacity-50'
                        >
                            Learn more
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AccountPrivacySettings
