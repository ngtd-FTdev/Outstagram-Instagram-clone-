import DirectIcon from '@/assets/icons/directIcon.svg?react'
import UserPlusIcon from '@/assets/icons/userPlusIcon.svg?react'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import {
    Tooltip,
    TooltipContent,
    TooltipPortal,
    TooltipProvider,
    TooltipTrigger,
} from '@radix-ui/react-tooltip'
import { Link } from 'react-router-dom'
import Modal from './modal'

function HoverCardProfileFix({
    children,
    handleCloseDrawer = null,
    isFollow,
    handleConfirmUnfollow = null,
    handleFollow = null,
    maxPosts = 3,
    asChild = true,
}) {
    let data = {
        posts: [
            {
                code: 'DjaKan1js1',
                image: {
                    url: 'https://res.cloudinary.com/dbma8vpob/image/upload/v1727157466/instagram/img_video_post/imxjfj44hcpx6xirexku.jpg',
                },
            },
            {
                code: 'Ahshaw2ca',
                image: {
                    url: 'https://res.cloudinary.com/dbma8vpob/image/upload/v1727157466/instagram/img_video_post/imxjfj44hcpx6xirexku.jpg',
                },
            },
            {
                code: 'FjkaGhKaw',
                image: {
                    url: 'https://res.cloudinary.com/dbma8vpob/image/upload/v1727157466/instagram/img_video_post/imxjfj44hcpx6xirexku.jpg',
                },
            },
            {
                code: 'JDaskjgaAs',
                image: {
                    url: 'https://res.cloudinary.com/dbma8vpob/image/upload/v1727157466/instagram/img_video_post/imxjfj44hcpx6xirexku.jpg',
                },
            },
            {
                code: 'HSajwbcaAB',
                image: {
                    url: 'https://res.cloudinary.com/dbma8vpob/image/upload/v1727157466/instagram/img_video_post/imxjfj44hcpx6xirexku.jpg',
                },
            },
        ],
    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild={asChild}>
                        {children}
                    </TooltipTrigger>
                    <TooltipPortal>
                        <TooltipContent align='start'>
                            <div className='tos-box-shadow grid w-[366px] grid-rows-[64px_40px_min-content] gap-y-4 rounded-[8px] bg-[--ig-primary-background] py-4'>
                                <div className='grid grid-cols-[64px_1fr] items-center gap-2 px-4'>
                                    <Link
                                        to='/ngtd'
                                        onClick={handleCloseDrawer}
                                    >
                                        <Avatar className='h-14 w-14'>
                                            <AvatarImage
                                                src='https://github.com/shadcn.png'
                                                alt='@shadcn'
                                            />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div className='flex flex-col'>
                                        <div className='flex h-[18px] items-center'>
                                            <Link
                                                to='/ngtd'
                                                className=''
                                                onClick={handleCloseDrawer}
                                            >
                                                <span className='text-base font-bold leading-5 text-[--ig-primary-text]'>
                                                    _baclee14_
                                                </span>
                                            </Link>
                                        </div>
                                        <div className='h-[18px] w-[262px]'>
                                            <span className='line-clamp-1 text-sm font-normal leading-[18px] text-[--ig-secondary-text]'>
                                                tuan Dat
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className='grid grid-cols-3 items-center gap-y-[3px]'>
                                    <div className='px-2 text-center'>
                                        <div>
                                            <span className='text-sm font-bold leading-[18px] text-[--ig-primary-text]'>
                                                100
                                            </span>
                                        </div>
                                        <div className='mt-1'>
                                            <span className='text-sm font-normal leading-[18px] text-[--ig-primary-text]'>
                                                posts
                                            </span>
                                        </div>
                                    </div>
                                    <div className='px-2 text-center'>
                                        <div>
                                            <span className='text-sm font-bold leading-[18px] text-[--ig-primary-text]'>
                                                50
                                            </span>
                                        </div>
                                        <div className='mt-1'>
                                            <span className='text-sm font-normal leading-[18px] text-[--ig-primary-text]'>
                                                followers
                                            </span>
                                        </div>
                                    </div>
                                    <div className='px-2 text-center'>
                                        <div>
                                            <span className='text-sm font-bold leading-[18px] text-[--ig-primary-text]'>
                                                100
                                            </span>
                                        </div>
                                        <div className='mt-1'>
                                            <span className='text-sm font-normal leading-[18px] text-[--ig-primary-text]'>
                                                following
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {data.posts && data.posts.length > 0 ? (
                                    <div className='grid grid-cols-3 items-center gap-x-[3px] gap-y-[3px]'>
                                        {data.posts
                                            .slice(0, maxPosts)
                                            .map((post, index) => (
                                                <div
                                                    className='relative h-[120px] w-[120px] overflow-hidden'
                                                    key={index}
                                                >
                                                    <Link
                                                        to={`/p/${post.code}`}
                                                        className='h-full w-full overflow-hidden bg-[--ig-secondary-background]'
                                                        onClick={
                                                            handleCloseDrawer
                                                        }
                                                    >
                                                        <img
                                                            className='h-full w-full object-cover'
                                                            src={post.image.url}
                                                            alt=''
                                                        />
                                                    </Link>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <div className='flex flex-col items-center justify-center gap-y-2 border-y border-y-[--ig-separator] p-4 text-center'>
                                        <i className='bg-img-logo-ig text-center'></i>
                                        <span className='text-sm font-bold leading-[18px] text-[--ig-primary-text]'>
                                            No posts yet
                                        </span>
                                        <span className='text-sm font-normal leading-[18px] text-[--ig-secondary-text]'>
                                            When kienngba shares photos and
                                            reels, you&apos;ll see them here.
                                        </span>
                                    </div>
                                )}
                                <div className='flex justify-center px-4'>
                                    {isFollow ? (
                                        <div className='flex flex-grow flex-nowrap items-center justify-center'>
                                            <div className='ml-1 mr-1 flex flex-grow'>
                                                <Link
                                                    to='direct/t/17848758833591346'
                                                    className='flex h-[32px] max-w-[200px] flex-grow select-none items-center justify-center rounded-[8px] bg-[--ig-primary-button] px-4 text-sm font-semibold leading-[18px] text-[--web-always-white] hover:bg-[--ig-primary-button-hover] active:opacity-50'
                                                    onClick={handleCloseDrawer}
                                                >
                                                    <span className='mr-2'>
                                                        <DirectIcon className='h-5 w-5 text-[--web-always-white]' />
                                                    </span>
                                                    <span>Message</span>
                                                </Link>
                                            </div>
                                            <div className='ml-1 flex flex-grow'>
                                                <Modal
                                                    CloseButton={false}
                                                    handleConfirmUnfollow={
                                                        handleConfirmUnfollow
                                                    }
                                                    nameModal={
                                                        'Confirm_Unfollow'
                                                    }
                                                    asChild={true}
                                                >
                                                    <div className='flex h-[32px] max-w-[200px] flex-grow cursor-pointer select-none items-center justify-center rounded-[8px] bg-[--ig-secondary-button-background] px-4 py-[7px] text-sm font-semibold leading-[18px] text-[--ig-primary-text] hover:bg-[--ig-secondary-button-hover] active:opacity-70'>
                                                        <div className='flex items-center justify-center px-1'>
                                                            Following
                                                        </div>
                                                    </div>
                                                </Modal>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            className='flex flex-grow select-none items-center justify-center rounded-[8px] bg-[--ig-primary-button] px-4 py-[7px] hover:bg-[--ig-primary-button-hover] active:opacity-70'
                                            onClick={handleFollow}
                                        >
                                            <div className='flex'>
                                                <div className='flex items-start justify-center text-[--web-always-white]'>
                                                    <span className='mr-2'>
                                                        <UserPlusIcon className='h-5 w-5 text-[--web-always-white]' />
                                                    </span>
                                                    Follow
                                                </div>
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </TooltipContent>
                    </TooltipPortal>
                </Tooltip>
            </TooltipProvider>
        </>
    )
}

export default HoverCardProfileFix
