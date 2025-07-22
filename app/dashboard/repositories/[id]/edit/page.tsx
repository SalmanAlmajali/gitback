import { Breadcrumbs } from '@/app/dashboard/layout'
import EditForm from '@/components/ui/repositories/edit-form'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

export const metadata: Metadata = {
	title: "Edit Repository"
}

async function Page(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;
	const id = params.id;

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
		</div>
	)
}

export default Page