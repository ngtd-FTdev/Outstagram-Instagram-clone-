import { useState, useEffect, useRef, useMemo } from 'react'
import './Sliders.css'
import { cn } from '@/lib/utils'

const BidirectionalSlider = ({
    min = -100,
    max = 100,
    initial = 0,
    valueInput,
    keyInput,
    onChange,
    className,
    ...props
}) => {
    const [internal, setInternal] = useState(initial)
    const curValue = valueInput ?? internal
    const sliderRef = useRef(null)

    const background = useMemo(() => {
        const pct = ((curValue - min) / (max - min)) * 100
        const mid = ((0 - min) / (max - min)) * 100

        if (curValue < 0) {
            return `linear-gradient(
        to right,
        black 0%, black ${pct}%,
        white ${pct}%, white ${mid}%,
        black ${mid}%, black 100%
      )`
        }
        return `linear-gradient(
      to right,
      black 0%, black ${mid}%,
      white ${mid}%, white ${pct}%,
      black ${pct}%, black 100%
    )`
    }, [curValue, min, max])

    // Áp dụng CSS
    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.style.backgroundImage = background
        }
    }, [background])

    const handleChange = e => {
        const val = parseInt(e.target.value, 10)
        if (valueInput === undefined) {
            setInternal(val)
        }
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
            {...props}
        />
    )
}

export default BidirectionalSlider
