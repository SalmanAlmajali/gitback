// Loading animation
const shimmer =
    'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function CardSkeleton() {
    return (
        <div
            className={`${shimmer} relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 p-2 shadow-sm`}
        >
            <div className="flex p-4">
                <div className="h-5 w-5 rounded-md bg-neutral-200 dark:bg-neutral-800" />
                <div className="ml-2 h-6 w-16 rounded-md bg-neutral-200 dark:bg-neutral-800 text-sm font-medium" />
            </div>
            <div className="flex items-center justify-center truncate rounded-xl bg-white dark:bg-neutral-950 px-4 py-8">
                <div className="h-7 w-20 rounded-md bg-neutral-200 dark:bg-neutral-800" />
            </div>
        </div>
    );
}

export function CardsSkeleton() {
    return (
        <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
        </>
    );
}

export function FeedbackChartSkeleton() {
    return (
        <div className={`${shimmer} relative w-full overflow-hidden md:col-span-4`}>
            <div className="mb-4 h-8 w-36 rounded-md bg-neutral-100 dark:bg-neutral-900" />
            <div className="rounded-xl bg-neutral-100 dark:bg-neutral-900 p-4">
                <div className="sm:grid-cols-13 mt-0 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md bg-white dark:bg-neutral-950 p-4 md:gap-4" />
                <div className="flex items-center pb-2 pt-6">
                    <div className="h-5 w-5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                    <div className="ml-2 h-4 w-20 rounded-md bg-neutral-200 dark:bg-neutral-800" />
                </div>
            </div>
        </div>
    );
}

export function FeedbackSkeleton() {
    return (
        <div className="flex flex-row items-center justify-between border-b py-4">
            <div className="flex items-center">
                <div className="min-w-0">
                    <div className="h-5 w-40 rounded-md bg-neutral-200 dark:bg-neutral-800" />
                    <div className="mt-2 h-4 w-12 rounded-md bg-neutral-200 dark:bg-neutral-800" />
                </div>
            </div>
            <div className="mt-2 h-4 w-12 rounded-md bg-neutral-200 dark:bg-neutral-800" />
        </div>
    );
}

export function LatestFeedbackSkeleton() {
    return (
        <div
            className={`${shimmer} relative flex w-full flex-col overflow-hidden md:col-span-4`}
        >
            <div className="mb-4 h-8 w-36 rounded-md bg-neutral-100 dark:bg-neutral-900" />
            <div className="flex grow flex-col justify-between rounded-xl bg-neutral-100 dark:bg-neutral-900 p-4">
                <div className="bg-white dark:bg-neutral-950 px-6 rounded-md">
                    <FeedbackSkeleton />
                    <FeedbackSkeleton />
                    <FeedbackSkeleton />
                    <FeedbackSkeleton />
                    <FeedbackSkeleton />
                </div>
                <div className="flex items-center pb-2 pt-6">
                    <div className="h-5 w-5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                    <div className="ml-2 h-4 w-20 rounded-md bg-neutral-200 dark:bg-neutral-800" />
                </div>
            </div>
        </div>
    );
}

export default function DashboardSkeleton() {
    return (
        <>
            <div
                className={`${shimmer} relative mb-4 h-8 w-36 overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-900`}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <FeedbackChartSkeleton />
                <LatestFeedbackSkeleton />
            </div>
        </>
    );
}
