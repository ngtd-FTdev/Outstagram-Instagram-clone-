import { useState } from 'react'
import { Link } from 'react-router-dom'

function Collections() {
    const [dataCollection, setDataCollection] = useState([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    ])

    return (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {dataCollection.map((item, index) => (
                <Link
                    to='haha12a'
                    aria-label={`Xem Collection ${index}`}
                    className='active:opacity-50'
                    key={index}
                >
                    <div className='relative flex h-[300px] w-[300px] flex-col items-center overflow-hidden rounded-[4px] border border-[--ig-stroke]'>
                        <div className='absolute inset-0 overflow-hidden bg-[url(https://res.cloudinary.com/dbma8vpob/image/upload/v1727157466/instagram/img_video_post/imxjfj44hcpx6xirexku.jpg)] bg-cover bg-center'></div>
                        {/* <div className='absolute inset-0 grid grid-cols-2 grid-rows-2'>
                            <div className='bg-[url(https://res.cloudinary.com/dbma8vpob/image/upload/v1727157466/instagram/img_video_post/imxjfj44hcpx6xirexku.jpg)] bg-cover bg-center'></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div> */}
                        <div className='absolute inset-0 bg-gradient-to-t from-[rgba(38,38,38,0.6)] to-[rgba(255,255,255,0)] hover:from-[rgba(38,38,38,0.2)]'>
                            <div className='absolute bottom-0 left-0 p-5'>
                                <span className='line-clamp-1 text-[20px] font-normal text-[--web-always-white]'>
                                    All posts
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default Collections
