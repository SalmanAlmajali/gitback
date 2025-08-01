
import { getMonthlyFeedbackTrend } from '@/app/lib/dashboard/actions';
import { generateYAxis } from '@/app/lib/utils';
import { figtree } from '@/components/fonts';
import { IconCalendar } from '@tabler/icons-react';
import React from 'react'

async function FeedbackChart() {
    const feedbacks = await getMonthlyFeedbackTrend();

    const chartHeight = 350;

    
    if (!feedbacks || feedbacks.data?.length === 0) {
        return <p className="mt-4 text-gray-400">No data available.</p>;
    }

    const { yAxisLabels, topLabel } = generateYAxis(feedbacks.data ?? []);

    return (
        <div className="w-full md:col-span-4">
            <h2 className={`${figtree.className} mb-4 text-2xl font-extrabold tracking-tight`}>
                Recent Feedback
            </h2>

            <div className="rounded-xl bg-neutral-100 dark:bg-neutral-900 p-4">
                <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white dark:bg-neutral-950 p-4 md:gap-4">
                    <div
                        className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
                        style={{ height: `${chartHeight}px` }}
                    >
                        {yAxisLabels.map((label: number) => (
                            <p key={label}>{label}</p>
                        ))}
                    </div>

                    {feedbacks.data?.map((item: { month: string, count: number }) => (
                        <div key={item.month} className="flex flex-col items-center gap-2">
                            <div
                                className="w-full rounded-md bg-blue-300"
                                style={{
                                    height: `${(chartHeight / topLabel) * item.count}px`,
                                }}
                            ></div>
                            <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                                {item.month}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="flex items-center pb-2 pt-6">
                    <IconCalendar className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
                </div>
            </div>
        </div>
    );
}

export default FeedbackChart