import React, { Suspense } from 'react'
import { PageTitle } from '../layout'
import Search from '@/components/ui/search'
import LinkButton from '@/components/ui/link-button'
import { IconAdjustmentsStar, IconAppsFilled, IconBugFilled, IconCancel, IconClockFilled, IconPlus, IconSquareCheckFilled } from '@tabler/icons-react'
import { Metadata } from 'next'
import { RenderCellFunction, TableHeadColumn } from '@/app/lib/definitions'
import { formatDateToLocal, getNestedValue } from '@/app/lib/utils'
import SkeletonTable from '@/components/ui/repositories/skeleton'
import Table from '@/components/ui/table'
import { deleteFeedback, getFeedbacks } from '@/app/lib/feedbacks/actions'
import { FeedbacksTableRow } from '@/app/lib/feedbacks/definitions'

export const metadata: Metadata = {
    title: "Feedbacks"
}

const tableHead: TableHeadColumn[] = [
    { label: 'User', key: 'userName' },
    { label: 'Email', key: 'userEmail' },
    { label: 'Repository', key: 'repository.name' },
    { label: 'Title', key: 'title' },
    { label: 'Type', key: 'type' },
    { label: 'Status', key: 'status' },
    { label: 'Added To App', key: 'createdAt' },
    { label: 'Last Updated (App)', key: 'updatedAt' },
];

const renderCell: RenderCellFunction<FeedbacksTableRow> = (
    data: FeedbacksTableRow,
    column: TableHeadColumn
): React.ReactNode => {
    const cellValue = getNestedValue(data, column.key);

    switch (column.key) {
        case 'repository.name':
            const href = data.repository.htmlUrl;
            if (href && typeof href === 'string') {
                return (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        {String(cellValue || '')}
                    </a>
                );
            }
        case 'type':
            switch (cellValue) {
                case 'BUG':
                    return (
                        <span
                            className="ml-2 flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white w-fit"
                        >
                            Bug <IconBugFilled className="h-4 w-4" />
                        </span>
                    );
                case 'FEATURE_REQUEST':
                    return (
                        <span
                            className="ml-2 flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white w-fit"
                        >
                            Feature Request <IconAppsFilled className="h-4 w-4" />
                        </span>
                    );
                default:
                    return (
                        <span
                            className="ml-2 flex items-center gap-1.5 rounded-full bg-blue-500 px-3 py-1.5 text-xs font-medium text-white w-fit"
                        >
                            Other <IconAdjustmentsStar className="h-4 w-4" />
                        </span>
                    );
            }
        case 'status':
            switch (cellValue) {
                case 'PENDING':
                    return (
                        <span
                            className="ml-2 flex items-center gap-1.5 rounded-full bg-gray-500 px-3 py-1.5 text-xs font-medium text-white w-fit"
                        >
                            Pending <IconClockFilled className="h-4 w-4" />
                        </span>
                    );
                case 'SUBMITTED':
                    return (
                        <span
                            className="ml-2 flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white w-fit"
                        >
                            Submitted <IconSquareCheckFilled className="h-4 w-4" />
                        </span>
                    );
                default:
                    return (
                        <span
                            className="ml-2 flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white w-fit"
                        >
                            Rejected <IconCancel className="h-4 w-4" />
                        </span>
                    );
            }
        case 'createdAt':
        case 'updatedAt':
            if (cellValue instanceof Date && !isNaN(cellValue.getTime())) {
                return formatDateToLocal(cellValue);
            }
            return String(cellValue || '');
        default:
            return cellValue;
    };
};

async function Page({
    searchParams,
}: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    const query = (await searchParams)?.query || '';
    const currentPage = Number((await searchParams)?.page) || 1;

    return (
        <div>
            <PageTitle title='Feedbacks' />
            <div className="flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder='Search feedbacks...' />
                <LinkButton href='/dashboard/feedbacks/create' className='py-2 px-4 rounded-lg'>
                    <span className='hidden md:block'>Create Feedback</span>
                    <IconPlus className="h-5" />
                </LinkButton>
            </div>
            <Suspense key={query + currentPage} fallback={<SkeletonTable tableHead={tableHead} />}>
                <Table
                    pageName={'Feedbacks'}
                    query={query}
                    currentPage={currentPage}
                    tableHead={tableHead}
                    renderCell={renderCell}
                    fetchFilteredFunction={getFeedbacks}
                    deleteAction={deleteFeedback}
                />
            </Suspense>
        </div>
    )
}

export default Page