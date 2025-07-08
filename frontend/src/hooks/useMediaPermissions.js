import { useState, useEffect, useCallback } from 'react'

export const useMediaPermissions = () => {
    const [permissions, setPermissions] = useState({
        camera: 'prompt',
        microphone: 'prompt'
    })
    const [error, setError] = useState('')
    const [isChecking, setIsChecking] = useState(true)

    const checkPermissions = useCallback(async () => {
        try {
            setIsChecking(true)
            setError('')

            const [cameraPermission, microphonePermission] = await Promise.all([
                navigator.permissions.query({ name: 'camera' }),
                navigator.permissions.query({ name: 'microphone' })
            ])

            setPermissions({
                camera: cameraPermission.state,
                microphone: microphonePermission.state
            })

            const handleCameraChange = () => {
                setPermissions(prev => ({ ...prev, camera: cameraPermission.state }))
            }

            const handleMicrophoneChange = () => {
                setPermissions(prev => ({ ...prev, microphone: microphonePermission.state }))
            }

            cameraPermission.addEventListener('change', handleCameraChange)
            microphonePermission.addEventListener('change', handleMicrophoneChange)

            return () => {
                cameraPermission.removeEventListener('change', handleCameraChange)
                microphonePermission.removeEventListener('change', handleMicrophoneChange)
            }

        } catch (err) {
            console.error('Error checking permissions:', err)
            setError('Failed to check permissions')
        } finally {
            setIsChecking(false)
        }
    }, [])

    const requestCameraPermission = useCallback(async () => {
        try {
            setError('')
            const stream = await navigator.mediaDevices.getUserMedia({ video: true })
            stream.getTracks().forEach(track => track.stop())
            await checkPermissions()
        } catch (err) {
            setError('Camera permission denied')
            throw err
        }
    }, [checkPermissions])

    const requestMicrophonePermission = useCallback(async () => {
        try {
            setError('')
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            stream.getTracks().forEach(track => track.stop())
            await checkPermissions()
        } catch (err) {
            setError('Microphone permission denied')
            throw err
        }
    }, [checkPermissions])

    const requestAllPermissions = useCallback(async () => {
        try {
            setError('')
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            })
            stream.getTracks().forEach(track => track.stop())
            await checkPermissions()
        } catch (err) {
            setError('Media permissions denied')
            throw err
        }
    }, [checkPermissions])

    useEffect(() => {
        let removeListeners = null;
        (async () => {
            removeListeners = await checkPermissions();
        })();
        return () => {
            if (typeof removeListeners === 'function') {
                removeListeners();
            }
        };
    }, [checkPermissions]);

    return {
        permissions,
        error,
        isChecking,
        requestCameraPermission,
        requestMicrophonePermission,
        requestAllPermissions,
        checkPermissions
    }
} 