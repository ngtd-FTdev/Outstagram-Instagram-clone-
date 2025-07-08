function MessagesAndStoryReplies() {
    return (
        <div className="max-w-[935px] flex-grow">
            <div className="mb-8">
                <h1 className="text-xl font-semibold text-white">Messages and story replies</h1>
                <p className="mt-2 text-sm text-[#A8A8A8]">
                    Control who can see your stories and live broadcasts
                </p>
            </div>
            <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-[#262626] pb-6">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search people"
                            className="w-full rounded-lg bg-[#262626] px-4 py-2 text-sm text-white placeholder-[#A8A8A8]"
                        />
                    </div>
                </div>

                <div className="border-b border-[#262626] pb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base text-white">Hide Story From</h3>
                            <p className="text-sm text-[#A8A8A8]">
                                Hide your story and live videos from specific people
                            </p>
                        </div>
                        <button className="rounded bg-[#0095F6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1877F2]">
                            Edit List
                        </button>
                    </div>
                </div>

                <div className="border-b border-[#262626] pb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base text-white">Allow Message Replies</h3>
                            <p className="text-sm text-[#A8A8A8]">
                                Choose who can reply to your story
                            </p>
                        </div>
                        <select className="rounded bg-[#262626] px-4 py-2 text-sm text-white">
                            <option>Everyone</option>
                            <option>People You Follow</option>
                            <option>Off</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MessagesAndStoryReplies 