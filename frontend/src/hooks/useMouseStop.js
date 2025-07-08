import { useEffect, useRef } from 'react'

function useMouseStop(ref, moveCallback, stopMoveCallback, delay = 300) {
    const timerRef = useRef(null)

    useEffect(() => {
        const handleMouseMove = () => {
            clearTimeout(timerRef.current)
            if (typeof moveCallback === 'function') {
                moveCallback()
            }
            timerRef.current = setTimeout(stopMoveCallback, delay)
        }

        const el = ref.current
        if (el) {
            el.addEventListener('mousemove', handleMouseMove)
        }

        return () => {
            clearTimeout(timerRef.current)
            if (el) {
                el.removeEventListener('mousemove', handleMouseMove)
            }
        }
    }, [ref, moveCallback, stopMoveCallback, delay])
}

export default useMouseStop