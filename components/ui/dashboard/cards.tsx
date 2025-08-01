import { getCardData } from "@/app/lib/dashboard/actions";
import { figtree } from "@/components/fonts";
import { IconBookmarks, IconClock, IconMessages, IconSquareCheck } from "@tabler/icons-react";

const iconMap = {
    repositories: IconBookmarks,
    feedbacks: IconMessages,
    pending: IconClock,
    submitted: IconSquareCheck,
};

export default async function CardWrapper() {
    const card = await getCardData();
    return (
        <>
            {/* NOTE: Uncomment this code in Chapter 9 */}

            <Card title="Repositories" value={card.data?.repositories ?? 0} type="repositories" />
            <Card title="Feedbacks" value={card.data?.feedbacks ?? 0} type="feedbacks" />
            <Card title="Pending Feedbacks" value={card.data?.pendingFeedback ?? 0} type="pending" />
            <Card
                title="Submitted Feedbacks"
                value={card.data?.submittedFeedback ?? 0}
                type="submitted"
            />
        </>
    );
}

export function Card({
    title,
    value,
    type,
}: {
    title: string;
    value: number | string;
    type: 'repositories' | 'feedbacks' | 'pending' | 'submitted';
}) {
    const Icon = iconMap[type];

    return (
        <div className="rounded-xl bg-neutral-100 dark:bg-neutral-900 p-2 shadow-sm">
            <div className="flex p-4">
                {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
                <h3 className={`${figtree.className} ml-2 text-sm font-medium`}>{title}</h3>
            </div>
            <p
                className="truncate bg-white dark:bg-neutral-950 rounded-xl px-4 py-8 text-center text-2xl"
            >
                {value}
            </p>
        </div>
    );
}