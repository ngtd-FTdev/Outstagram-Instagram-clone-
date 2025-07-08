import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import PhoneCallIcon from '@/assets/icons/phoneIcon.svg?react'

function CallEnded() {
    const [countdown, setCountdown] = useState(3)

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    window.close()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const handleCloseNow = () => {
        window.close()
    }

    return (
        <div className="flex h-screen items-center justify-center bg-black text-white">
            <div className="text-center max-w-md mx-auto p-8">
                <div className="mb-6">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PhoneCallIcon className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Call Ended</h2>
                    <p className="text-gray-400 mb-6">
                        The call has ended. This window will close automatically in {countdown} seconds.
                    </p>
                </div>
                
                <div className="space-y-3">
                    <Button
                        onClick={handleCloseNow}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                    >
                        Close Now
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CallEnded 