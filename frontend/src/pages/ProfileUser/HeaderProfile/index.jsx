import Modal from '@/components/modal'
import { Link } from 'react-router-dom'
import AvatarUser from './AvatarUser'
import HighlightProfile from './HighlightProfile'
import ProfileDetails from './ProfileDetails'
import ProfileHeaderActions from './ProfileHeaderActions'

function HeaderProfile({ profileData }) {
    return (
        <header className='grid grid-cols-[1fr_2fr]'>
            <section className='col-start-1 row-start-1 row-end-5 mr-7 flex items-center justify-center'>
                <AvatarUser profileData={profileData} />
            </section>
            <section className='mb-5 mt-auto'>
                <ProfileHeaderActions profileData={profileData} />
            </section>
            <section className='col-start-2 row-start-2'>
                <ul className='mb-7 flex gap-x-[40px]'>
                    <li>
                        <div className='text-[--ig-primary-text]'>
                            <span className='text-base font-semibold'>
                                {profileData?.postsCount || 0}
                            </span>
                            {' posts'}
                        </div>
                    </li>
                    <li>
                        <Modal>
                            <div className='text-[--ig-primary-text]'>
                                <span className='text-base font-semibold'>
                                    {profileData?.followersCount || 0}
                                </span>
                                {' followers'}
                            </div>
                        </Modal>
                    </li>
                    <li>
                        <Modal>
                            <div className='text-[--ig-primary-text]'>
                                <span className='text-base font-semibold'>
                                    {profileData?.followingCount || 0}
                                </span>
                                {' following'}
                            </div>
                        </Modal>
                    </li>
                </ul>
            </section>
            <section className='col-start-2 row-start-3'>
                <ProfileDetails profileData={profileData} />
            </section>
            <section className='col-start-2 row-start-4'></section>
            <section className='col-start-1 col-end-3 row-start-5 mt-11'></section>
            <section className='col-start-1 col-end-3 row-start-6'>
                {/* <HighlightProfile profileData={profileData} /> */}
            </section>
        </header>
    )
}

export default HeaderProfile
