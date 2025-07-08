import { useState, useRef, useEffect, useMemo } from 'react'
import './Sliders.css'
import { cn } from '@/lib/utils'

export const SliderCom = ({
    min = 0,
    max = 100,
    initial = 0,
    keyInput,
    valueInput,
    onChange,
    className,
    ...props
}) => {
    const [value, setValue] = useState(initial)
    const curValue = valueInput ?? value
    const sliderRef = useRef(null)

    // memo gradient string
    const background = useMemo(() => {
        const percent = ((curValue - min) / (max - min)) * 100
        const middle = ((0 - min) / (max - min)) * 100
        if (curValue < 0) {
            return `linear-gradient(to right, black 0%, black ${percent}%, white ${percent}%, white ${middle}%, black ${middle}%, black 100%)`
        }
        return `linear-gradient(to right, black 0%, black ${middle}%, white ${middle}%, white ${percent}%, black ${percent}%, black 100%)`
    }, [curValue, min, max])

    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.style.backgroundImage = background
        }
    }, [background])

    const handleChange = e => {
        const val = parseInt(e.target.value, 10)
        if (valueInput === undefined) setValue(val)
        onChange?.(keyInput, val)
    }

    return (
        <input
            ref={sliderRef}
            type='range'
            min={min}
            max={max}
            value={curValue}
            onChange={handleChange}
            className={cn('slider', className)}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={curValue}
            {...props}
        />
    )
}
export default SliderCom
