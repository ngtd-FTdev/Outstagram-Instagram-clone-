function CallLoading() {
    return (
        <div className="flex h-screen items-center justify-center bg-black text-white">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-6"></div>
                <h2 className="text-xl font-semibold mb-2">Initializing Call</h2>
                <p className="text-gray-400">Please wait while we set up your call...</p>
            </div>
        </div>
    )
}

export default CallLoading 