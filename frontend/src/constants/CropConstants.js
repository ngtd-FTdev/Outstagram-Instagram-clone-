import PhotoOutlineIcon from '@/assets/icons/PhotoOutlineIcon.svg?react'
import SquareIcon from '@/assets/icons/SquareIcon.svg?react'
import PortraitIcon from '@/assets/icons/PortraitIcon.svg?react'
import LandscapeIcon from '@/assets/icons/LandscapeIcon.svg?react'

export const aspectRatios = [
    { name: 'Original', value: 'original', icon: PhotoOutlineIcon },
    { name: '1:1', value: 1/1, icon: SquareIcon },
    { name: '4:5', value: 4/5, icon: PortraitIcon },
    { name: '16:9', value: 16/9, icon: LandscapeIcon },
]