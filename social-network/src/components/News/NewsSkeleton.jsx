import React from 'react';

const NewsSkeleton = () => {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col h-full animate-pulse">
            {/* Image Skeleton */}
            <div className="h-48 bg-zinc-200 dark:bg-zinc-800 w-full" />

            {/* Content Skeleton */}
            <div className="flex flex-col flex-grow p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>

                <div className="space-y-2 mb-4">
                    <div className="h-6 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>

                <div className="space-y-2 mb-4">
                    <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-4 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>

                <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                    <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
            </div>
        </div>
    );
};

export default NewsSkeleton;
