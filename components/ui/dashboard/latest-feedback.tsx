import { getLatestFeedback } from '@/app/lib/dashboard/actions';
import { figtree } from '@/components/fonts';
import { IconRefresh } from '@tabler/icons-react';
import clsx from 'clsx';
import React from 'react'
import { renderType } from '../feedbacks/badges';

async function LatestFeedback() {
    const latestFeedbacks = await getLatestFeedback();

    return (
        <div className="flex w-full flex-col md:col-span-4">
            <h2 className={`${figtree.className} mb-4 text-2xl font-extrabold tracking-tight`}>
                Latest Feedbacks
            </h2>
            <div className="flex grow flex-col justify-between rounded-xl bg-neutral-100 dark:bg-neutral-900 p-4">
                <div className="bg-white dark:bg-neutral-950 px-6 rounded-md">
                    {latestFeedbacks.data?.map((feedback, i) => {
                        return (
                            <div
                                key={feedback.id}
                                className={clsx(
                                    'flex flex-row items-center justify-between py-4',
                                    {
                                        'border-t': i !== 0,
                                    },
                                )}
                            >
                                <div className="min-w-0">
                                    <p className={`${figtree.className} truncate text-sm font-semibold md:text-base`}>
                                        {feedback.repository.fullName}
                                    </p>
                                    <p className="hidden text-sm text-gray-500 sm:block">
                                        {feedback.title}
                                    </p>
                                </div>
                                {renderType(feedback.type)}
                            </div>
                        );
                    })}
                </div>
                <div className="flex items-center pb-2 pt-6">
                    <IconRefresh className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
                </div>
            </div>
        </div>
    )
}

export default LatestFeedback