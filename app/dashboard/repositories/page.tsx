import React from 'react'
import { PageTitle } from '../layout'
import Table from '@/components/ui/table'
import { fetchFilteredRepositories } from '@/lib/data';
import { Metadata } from 'next';
import Search from '@/components/ui/search';

export const metadata: Metadata = {
	title: "Repositories"
}

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

	const tableHead = [
		{
			label: 'User',
			key: 'username',
			type: 'string',
		},
		{
			label: 'Email',
			key: 'email',
			type: 'string',
		},
		{
			label: 'Name',
			key: 'name',
			type: 'string',
		},
		{
			label: 'Github Owner',
			key: 'github_owner',
			type: 'string',
		},
		{
			label: 'Github Repository',
			key: 'github_repo',
			type: 'string',
		},
		{
			label: 'Created At',
			key: 'created_at',
			type: 'date',
		},
		{
			label: 'Updated At',
			key: 'updated_at',
			type: 'date',
		},
	];

	return (
		<div>
			<PageTitle title='Repositories' />
			<div className="flex items-center justify-between gap-2 md:mt-8">
				<Search placeholder='Search repositories...' />
			</div>
			<Table
				pageName={'Repositories'}
				query={query}
				currentPage={currentPage}
				tableHead={tableHead}
				fetchFilteredFunction={fetchFilteredRepositories}
			/>
		</div>
	)
}

export default Page