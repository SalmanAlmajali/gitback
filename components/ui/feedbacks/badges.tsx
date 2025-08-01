import { IconAdjustmentsStar, IconAppsFilled, IconBugFilled, IconCancel, IconClockFilled, IconSquareCheckFilled } from "@tabler/icons-react";

export function renderType(type: string) {
    switch (type) {
        case 'BUG':
            return (
                <span
                    className="flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white w-fit"
                >
                    Bug <IconBugFilled className="h-4 w-4" />
                </span>
            );
        case 'FEATURE_REQUEST':
            return (
                <span
                    className="flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white w-fit"
                >
                    Feature Request <IconAppsFilled className="h-4 w-4" />
                </span>
            );
        default:
            return (
                <span
                    className="flex items-center gap-1.5 rounded-full bg-blue-500 px-3 py-1.5 text-xs font-medium text-white w-fit"
                >
                    Other <IconAdjustmentsStar className="h-4 w-4" />
                </span>
            );
    }
}

export function renderStatus(status: string) {
    switch (status) {
        case 'PENDING':
            return (
                <span
                    className="flex items-center gap-1.5 rounded-full bg-gray-500 px-3 py-1.5 text-xs font-medium text-white w-fit"
                >
                    Pending <IconClockFilled className="h-4 w-4" />
                </span>
            );
        case 'SUBMITTED':
            return (
                <span
                    className="flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white w-fit"
                >
                    Submitted <IconSquareCheckFilled className="h-4 w-4" />
                </span>
            );
        default:
            return (
                <span
                    className="flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white w-fit"
                >
                    Rejected <IconCancel className="h-4 w-4" />
                </span>
            );
    }
}