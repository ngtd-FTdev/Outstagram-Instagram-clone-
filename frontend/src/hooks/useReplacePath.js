import { useEffect, useRef, useState } from 'react'

function useReplacePath(newPath) {
    const [replacePath, setReplacePath] = useState(false)
    const prevPathRef = useRef(window.location.pathname)

    useEffect(() => {
        if (newPath) {
            if (replacePath) {
                prevPathRef.current = window.location.pathname
                window.history.replaceState(null, '', newPath)
            } else {
                window.history.replaceState(null, '', prevPathRef.current)
            }
        }
    }, [replacePath, newPath])

    return { replacePath, setReplacePath }
}

export default useReplacePath
