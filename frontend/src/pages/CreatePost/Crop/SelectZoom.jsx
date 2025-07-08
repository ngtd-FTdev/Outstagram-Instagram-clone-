import { setZoomMedias } from '@/redux/features/createPost'
import {
    Slider,
    SliderRange,
    SliderThumb,
    SliderTrack,
} from '@radix-ui/react-slider'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

function SelectZoom({ mediaIndex, mediaPost }) {
    const zoom = mediaPost.cropSettings.zoom
    const [valueSlider, setValueSlider] = useState((zoom - 1) * 100)
    const dispatch = useDispatch()

    const handleZoomChange = (value) => {
        setValueSlider(value[0])
        const zoomScale = 1 + value[0] / 100
        if (mediaPost.onZoomChange) {
            mediaPost.onZoomChange(zoomScale)
        }
    }

    useEffect(() => {
        return () => {
            const zoomScale = 1 + valueSlider / 100
            dispatch(setZoomMedias({ zoom: zoomScale, mediaIndex }))
        }
    }, [mediaIndex])

    return (
        <div className='flex h-[32px] w-[132px] items-center rounded-[8px] bg-[--black-26-08] px-3'>
            <Slider
                className='relative flex flex-grow touch-none select-none items-center'
                value={[valueSlider]}
                onValueChange={handleZoomChange}
                max={100}
                step={1}
            >
                <SliderTrack className='relative h-[1px] flex-grow rounded-full bg-black'>
                    <SliderRange className='absolute h-full rounded-full bg-white' />
                </SliderTrack>
                <SliderThumb
                    className='block h-[16px] w-[16px] rounded-full bg-white'
                    aria-label='Zoom'
                />
            </Slider>
        </div>
    )
}

export default SelectZoom
