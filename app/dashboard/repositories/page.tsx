import { PageTitle } from '../layout'
import Table from '@/components/ui/table'
import { Metadata } from 'next';
import { fetchFilteredRepositories } from '@/app/lib/repositories/actions';
import Search from '@/components/ui/search';
import LinkButton from '@/components/ui/link-button';
import { RepositoriesTableRow } from '@/app/lib/repositories/definitions';
import { RenderCellFunction, TableHeadColumn } from '@/app/lib/definitions';

export const metadata: Metadata = {
	title: "Repositories"
}

const tableHead = [
	{ label: 'Name', key: 'name', type: 'text' },
	{ label: 'Owner', key: 'githubOwner', type: 'text' },
	{ label: 'Repo', key: 'githubRepo', type: 'text' },
	{ label: 'User Name', key: 'user', type: 'text' },
	{ label: 'User Email', key: 'email', type: 'text' },
	{ label: 'Created At', key: 'createdAt', type: 'date' },
	{ label: 'Updated At', key: 'updatedAt', type: 'date' },
];

const renderCell: RenderCellFunction<RepositoriesTableRow> = (
    data: RepositoriesTableRow,
    column: TableHeadColumn
): React.ReactNode => {
    // You can still use `as keyof RepositoriesTableRow` for type safety
    const cellValue = data[column.key as keyof RepositoriesTableRow];

    switch (column.key) {
        case 'user':
            return data.user?.name;
        case 'email':
            return data.user?.email;
        case 'createdAt':
        case 'updatedAt':
            // Ensure cellValue is a Date object, as Prisma returns Dates
            return cellValue instanceof Date
                ? cellValue.toLocaleDateString()
                : String(cellValue || ''); // Fallback for safety
        default:
            return String(cellValue || ''); // Ensure direct string conversion for display
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
					Create Repository
				</LinkButton>
			</div>
			<Table
				pageName={'Repositories'}
				query={query}
				currentPage={currentPage}
				tableHead={tableHead}
				renderCell={renderCell}
				fetchFilteredFunction={fetchFilteredRepositories}
			/>
		</div>
	)
}

export default Page