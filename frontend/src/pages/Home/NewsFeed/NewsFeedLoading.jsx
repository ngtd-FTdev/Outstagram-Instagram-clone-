import React from 'react'

function NewsFeedLoading() {
    return (
        <div className="w-full space-y-6 p-4">
            {[1, 2, 3].map((item) => (
                <div key={item} className="animate-pulse rounded-xl  p-6 shadow-lg">
                    {/* User info skeleton */}
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="h-12 w-12 rounded-full bg-muted/20"></div>
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-muted/20 rounded-md"></div>
                            <div className="h-3 w-24 bg-muted/20 rounded-md"></div>
                        </div>
                    </div>

                    {/* Content skeleton */}
                    <div className="space-y-4">
                        <div className="aspect-square w-full bg-muted/20 rounded-lg"></div>
                        <div className="h-4 w-full bg-muted/20 rounded-md"></div>
                        <div className="h-4 w-3/4 bg-muted/20 rounded-md"></div>
                    </div>

                    {/* Actions skeleton */}
                    <div className="flex space-x-6 mt-6">
                        <div className="h-8 w-20 bg-muted/20 rounded-lg"></div>
                        <div className="h-8 w-20 bg-muted/20 rounded-lg"></div>
                        <div className="h-8 w-20 bg-muted/20 rounded-lg"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default NewsFeedLoading