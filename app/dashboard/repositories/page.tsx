import { PageTitle } from '../layout'
import Table from '@/components/ui/table'
import { Metadata } from 'next';
import { getUserSelectedRepositories } from '@/app/lib/repositories/actions';
import Search from '@/components/ui/search';
import LinkButton from '@/components/ui/link-button';
import { RepositoriesTableRow } from '@/app/lib/repositories/definitions';
import { RenderCellFunction, TableHeadColumn } from '@/app/lib/definitions';
import { Suspense } from 'react';
import SkeletonTable from '@/components/ui/repositories/skeleton';
import { formatDateToLocal, getNestedValue } from '@/app/lib/utils';
import { IconPlus } from '@tabler/icons-react';

export const metadata: Metadata = {
	title: "Repositories"
}

const tableHead: TableHeadColumn[] = [
	{ label: 'Repository', key: 'fullName', type: 'link', hrefKey: 'htmlUrl' },
	{ label: 'Description', key: 'description', type: 'text' },
	{ label: 'Language', key: 'language', type: 'text' },
	{ label: 'Stars', key: 'stargazersCount', type: 'number' },
	{ label: 'Forks', key: 'forksCount', type: 'number' },
	{ label: 'Visibility', key: 'private', type: 'boolean' },
	{ label: 'Last Updated (GitHub)', key: 'updatedAtGitHub', type: 'date' },
	{ label: 'Added To App', key: 'createdAt', type: 'date' },
	{ label: 'Last Updated (App)', key: 'updatedAt', type: 'date' },
	{ label: 'User Name', key: 'user.name', type: 'text' },
	{ label: 'User Email', key: 'user.email', type: 'text' },
];

const renderCell: RenderCellFunction<RepositoriesTableRow> = (
	data: RepositoriesTableRow,
	column: TableHeadColumn
): React.ReactNode => {
	const cellValue = getNestedValue(data, column.key);

	switch (column.type) {
		case 'link':
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
			return String(cellValue || '');
		case 'boolean':
			return cellValue === true ? 'Private' : 'Public';
		case 'date':
			if (cellValue instanceof Date && !isNaN(cellValue.getTime())) {
				return formatDateToLocal(cellValue);
			}
			return String(cellValue || ''); // Fallback for invalid or non-Date values
		case 'number':
			return cellValue !== null && cellValue !== undefined ? String(cellValue) : '';
		case 'text':
		default:
			return String(cellValue || '');
	}
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
			<PageTitle title='Repositories' />
			<div className="flex items-center justify-between gap-2 md:mt-8">
				<Search placeholder='Search repositories...' />
				<LinkButton href='/dashboard/repositories/create' className='py-3 px-4 rounded-lg'>
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
				// deleteAction={deleteRepository}
				/>
			</Suspense>
		</div>
	)
}

export default Page