import VerifiedIcon from '@/assets/icons/verifiedIcon.svg?react'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useEffect, useState } from 'react'

const HASHTAG = [
    { value: 'datdeptrai', posts: 5000000 },
    { value: 'dathaha', posts: 2176182 },
    { value: 'dapt', posts: 1234567 },
    { value: 'dafas', posts: 123456 },
    { value: 'daidai', posts: 765432 },
    { value: 'dasag', posts: 712761 },
]

const TAGUSER = [
    { avatar: '', value: 'datdeptrai', fullname: 'dat dep trai' },
    { avatar: '', value: 'dat_deptra', fullname: 'dat giau', verified: true },
    { avatar: '', value: 'dat_dep_trai', fullname: 'dat sieu vip' },
    { avatar: '', value: 'dat_tuan', fullname: 'dat tuan ng' },
    { avatar: '', value: 'dat_tute', fullname: 'dat tu te' },
]

function AddTag({ activeMention, choose }) {
    const [valueTag, setValueTag] = useState([])

    useEffect(() => {
        if (!activeMention) return

        const { type, query } = activeMention

        if (type === 'user') {
            setValueTag(TAGUSER)
        } else if (type === 'hashtag') {
            setValueTag(HASHTAG)
        } else {
            setValueTag([])
        }
    }, [activeMention.query])

    const handleSetTag = value => {
        if (!value) return
        choose(value)
    }

    return (
        <div className='shadow-xl/30 absolute left-0 top-full z-50 flex max-h-[200px] w-[324px] flex-col overflow-y-auto overflow-x-hidden bg-[--ig-primary-background]'>
            {valueTag.map((item, index) => (
                <div
                    onClick={() => handleSetTag(item?.value)}
                    key={index}
                    className='cursor-pointer border-b border-[--ig-separator] hover:bg-[--ig-secondary-background]'
                >
                    {activeMention.type === 'user' ? (
                        <div className='flex items-center p-2'>
                            <Avatar className='mr-[10px] h-8 w-8 overflow-hidden rounded-full'>
                                <AvatarImage
                                    src='https://github.com/shadcn.png'
                                    alt='@shadcn'
                                />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-grow flex-col text-sm'>
                                <div className='line-clamp-1 flex items-center gap-[5px] font-semibold text-[--ig-primary-text]'>
                                    <span>{item.value}</span>
                                    {item?.verified && (
                                        <div>
                                            <VerifiedIcon className='h-3 w-3' />
                                        </div>
                                    )}
                                </div>
                                <div className='line-clamp-1 font-normal text-[--ig-primary-text]'>
                                    {item.fullname}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col px-4 py-[10px]'>
                            <div className='w-[235px]'>
                                <div className='line-clamp-1 font-semibold text-[--ig-primary-text]'>
                                    #{item.value}
                                </div>
                                <div className='line-clamp-1 text-base text-[--ig-secondary-text]'>
                                    {item.posts?.toLocaleString()} posts
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default AddTag
