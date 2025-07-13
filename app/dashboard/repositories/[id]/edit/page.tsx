import { Breadcrumbs } from '@/app/dashboard/layout'
import { fetchRepositoryByIdFromLocal } from '@/lib/data'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

export const metadata: Metadata = {
	title: "Edit Repository"
}

async function Page(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;
	const id = params.id;

	const repository = await fetchRepositoryByIdFromLocal(id);

	if (!repository) {
		notFound();
	}

	return (
		<div>
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
			<p>Datanya ada di database. Males bikin formnya jadi, gini aja dulu</p>
			<pre className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-md overflow-x-auto">
				<code className="font-mono">
					{JSON.stringify(repository, null, 2)}
				</code>
			</pre>
		</div>
	)
}

export default Page