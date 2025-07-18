import { Breadcrumbs } from '@/app/dashboard/layout'
import { fetchRepositoryById } from '@/app/lib/repositories/actions'
import { fetchUsers } from '@/app/lib/users/actions'
import EditForm from '@/components/ui/repositories/edit-form'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
	title: "Edit Repository"
}

async function Page(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;
	const id = params.id;

	const [repository, users] = await Promise.all([
		fetchRepositoryById(id),
		fetchUsers()
	]);

	if (!repository) {
		notFound();
	}

	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: 'Repositories', href: '/dashboard/repositories' },
					{
						label: 'Edit Repository',
						href: `/dashboard/repositories/${id}/edit`,
						active: true,
					},
				]}
			/>
			<EditForm repository={repository} users={users} />
		</main>
	)
}

export default Page