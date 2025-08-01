import { PageTitle } from '../layout'
import Table from '@/components/ui/table'
import { Metadata } from 'next';
import { deleteRepository, getUserSelectedRepositories } from '@/app/lib/repositories/actions';
import Search from '@/components/ui/search';
import LinkButton from '@/components/ui/link-button';
import { RepositoriesTableRow } from '@/app/lib/repositories/definitions';
import { RenderCellFunction, TableHeadColumn } from '@/app/lib/definitions';
import { Suspense } from 'react';
import SkeletonTable from '@/components/ui/repositories/skeleton';
import { formatDateToLocal, getNestedValue } from '@/app/lib/utils';
import { IconArrowRight, IconPlus } from '@tabler/icons-react';
import { getLanguageColorClass, getLanguageHexColor } from '@/app/lib/language-color-map';
import clsx from 'clsx';
import Link from 'next/link';

export const metadata: Metadata = {
	title: "Repositories"
}

const tableHead: TableHeadColumn[] = [
	{ label: 'Repository', key: 'fullName', hrefKey: 'htmlUrl' },
	{ label: 'Description', key: 'description', },
	{ label: 'Language', key: 'language', },
	{ label: 'Stars', key: 'stargazersCount', },
	{ label: 'Forks', key: 'forksCount', },
	{ label: 'Visibility', key: 'private', },
	{ label: 'Last Updated (GitHub)', key: 'updatedAtGitHub', },
	{ label: 'Added To App', key: 'createdAt', },
	{ label: 'Last Updated (App)', key: 'updatedAt', },
	{ label: 'Public Form', key: 'action' },
];

const renderCell: RenderCellFunction<RepositoriesTableRow> = (
	data: RepositoriesTableRow,
	column: TableHeadColumn
): React.ReactNode => {
	const cellValue = getNestedValue(data, column.key);

	switch (column.key) {
		case 'fullName':
			const href = getNestedValue(data, column.hrefKey || '');
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
		case 'language':
			return (
				cellValue && (
					<span className={`flex items-center ${getLanguageColorClass(cellValue)}`}>
						<span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: getLanguageHexColor(cellValue) }}></span>
						{cellValue}
					</span>
				)
			);
		case 'private':
			return (
				<span className={clsx('px-2 py-0.5 rounded-full text-xs',
					{
						'bg-red-100 text-red-800': cellValue === true,
						'bg-green-100 text-green-800': cellValue === false,
					}
				)}>
					{cellValue ? 'Private' : 'Public'}
				</span>
			);
		case 'description':
			return (
				cellValue === null
					? '-'
					: typeof cellValue === 'string' && cellValue.length > 20
						? cellValue.slice(0, 100) + '...'
						: cellValue
			);
		case 'updatedAtGitHub':
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
						href={`/user/feedback/${data.id}`}
						className="rounded-md border p-2 bg-blue-600 hover:bg-blue-700 transition-colors"
					>
						<IconArrowRight className="w-5 text-white" />
					</Link>
				</span>
			)
		default:
			return cellValue;
	};
};

export default async function Page({
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
		<div >
			<PageTitle title='Repositories' />
			<div className="flex items-center justify-between gap-2 md:mt-8">
				<Search placeholder='Search repositories...' />
				<LinkButton href='/dashboard/repositories/create' className='py-2 px-4 rounded-lg'>
					<span className='hidden md:block'>Create Repository</span>
					<IconPlus className="h-5" />
				</LinkButton>
			</div>
			<Suspense key={query + currentPage} fallback={<SkeletonTable tableHead={tableHead} />}>
				<Table
					pageName={'Repositories'}
					query={query}
					currentPage={currentPage}
					tableHead={tableHead}
					renderCell={renderCell}
					fetchFilteredFunction={getUserSelectedRepositories}
					deleteAction={deleteRepository}
				/>
			</Suspense>
		</div>
	)
}
