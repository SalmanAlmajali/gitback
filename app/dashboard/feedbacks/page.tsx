import React, { Suspense } from 'react'
import { PageTitle } from '../layout'
import Search from '@/components/ui/search'
import LinkButton from '@/components/ui/link-button'
import { Metadata } from 'next'
import { RenderCellFunction, TableHeadColumn } from '@/app/lib/definitions'
import { formatDateToLocal, getNestedValue } from '@/app/lib/utils'
import SkeletonTable from '@/components/ui/repositories/skeleton'
import Table from '@/components/ui/table'
import { deleteFeedback, getFeedbacks } from '@/app/lib/feedbacks/actions'
import { FeedbacksTableRow } from '@/app/lib/feedbacks/definitions'
import Link from 'next/link'
import { renderStatus, renderType } from '@/components/ui/feedbacks/badges'
import { IconEye, IconPlus } from '@tabler/icons-react'

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
    { label: 'Detail', key: 'action' },
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
            return renderType(cellValue);
        case 'status':
            return renderStatus(cellValue);
        case 'createdAt':
        case 'updatedAt':
            if (cellValue instanceof Date && !isNaN(cellValue.getTime())) {
                return formatDateToLocal(cellValue);
            }
            return String(cellValue || '');
        case 'action':
            return (
                <span className="flex">
                    <Link
                        href={`/dashboard/feedbacks/${data.id}/detail`}
                        className="rounded-md border p-2 bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                        <IconEye className="w-5 text-white" />
                    </Link>
                </span>
            )
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
