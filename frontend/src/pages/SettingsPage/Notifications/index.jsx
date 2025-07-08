function NotificationsSettings() {
    return (
        <div className="mx-auto max-w-[700px] px-12 py-12 flex-grow">
            <div className="mb-12">
                <h1 className="text-[20px] font-bold text-[--ig-primary-text]">Notifications</h1>
            </div>
            <div className="space-y-4 rounded-xl bg-[#121212] p-4">
                <div className="flex items-center justify-between py-4 cursor-pointer hover:bg-[#1a1a1a] px-3 rounded-lg">
                    <span className="text-base">Push notifications</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
                <div className="flex items-center justify-between py-4 cursor-pointer hover:bg-[#1a1a1a] px-3 rounded-lg">
                    <span className="text-base">Email notifications</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default NotificationsSettings 