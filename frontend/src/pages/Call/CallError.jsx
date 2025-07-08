import { Button } from '@/components/ui/button'

function CallError({ error, onRetry }) {
    return (
        <div className="flex h-screen items-center justify-center bg-black text-white">
            <div className="text-center max-w-md mx-auto p-8">
                <div className='mb-6'>
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Call Error</h2>
                    <p className="text-gray-400 mb-6">
                        {error || 'An unexpected error occurred during the call.'}
                    </p>
                </div>
                
                <div className="space-y-3">
                    <Button
                        onClick={onRetry}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Try Again
                    </Button>
                    <Button
                        onClick={() => window.close()}
                        variant="outline"
                        className="w-full border-white/20 text-white hover:bg-white/10"
                    >
                        Close Window
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CallError 