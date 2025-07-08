import img1 from '@/assets/img/screenshot1.png'
import img2 from '@/assets/img/screenshot2.png'
import img3 from '@/assets/img/screenshot3.png'
import img4 from '@/assets/img/screenshot4.png'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
function HomePhone() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const images = [img1, img2, img3, img4]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [images.length])

    return (
        <div className='md-lg:bg-pos-custom md-lg:mb-3 md-lg:mr-8 md-lg:block md-lg:h-[582px] md-lg:w-[375px] md-lg:bg-home-phones md-lg:bg-no-repeat hidden'>
            <div className='relative pl-28 pt-7'>
                {images.map((img, index) => (
                    <motion.img
                        key={index}
                        className='absolute'
                        src={img}
                        alt={`Image ${index + 1}`}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: currentImageIndex === index ? 1 : 0,
                        }}
                        transition={{ duration: 1.5 }}
                    />
                ))}
            </div>
        </div>
    )
}

export default HomePhone
