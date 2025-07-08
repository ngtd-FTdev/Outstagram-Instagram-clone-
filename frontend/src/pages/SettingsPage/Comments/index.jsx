function CommentsSettings() {
    return (
        <div className="max-w-[700px] flex-grow">
            <div className="mb-8">
                <h1 className="text-xl font-semibold text-white">Ad Preferences</h1>
                <p className="mt-2 text-sm text-[#A8A8A8]">
                    Control how your information is used to show you ads
                </p>
            </div>
            <div className="space-y-6">
                <div className="border-b border-[#262626] pb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base text-white">Data About Your Activity From Partners</h3>
                            <p className="text-sm text-[#A8A8A8]">
                                Choose whether Meta can show you personalized ads based on data from partners
                            </p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                className="peer sr-only"
                            />
                            <div className="peer h-6 w-11 rounded-full bg-[#262626] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#0095F6] peer-checked:after:translate-x-full"></div>
                        </label>
                    </div>
                </div>

                <div className="border-b border-[#262626] pb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base text-white">Activity Information</h3>
                            <p className="text-sm text-[#A8A8A8]">
                                Choose whether your activity can be used to personalize ads across Meta technologies
                            </p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                className="peer sr-only"
                            />
                            <div className="peer h-6 w-11 rounded-full bg-[#262626] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#0095F6] peer-checked:after:translate-x-full"></div>
                        </label>
                    </div>
                </div>

                <div className="text-sm text-[#A8A8A8]">
                    You can learn more about your ad preferences and how ads work across Meta technologies in our
                    <a href="#" className="ml-1 text-[#0095F6] hover:underline">
                        Privacy Policy
                    </a>
                    .
                </div>
            </div>
        </div>
    )
}

export default CommentsSettings 