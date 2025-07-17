import { Breadcrumbs } from '@/app/dashboard/layout'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
	title: "Edit Repository"
}

async function Page(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;
	const id = params.id;

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
		</main>
	)
}

export default Page