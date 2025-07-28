import { Breadcrumbs } from '@/app/dashboard/layout'
import { getRepositoryById } from '@/app/lib/repositories/actions'
import EditForm from '@/components/ui/repositories/edit-form'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

export const metadata: Metadata = {
	title: "Edit Repository"
}

async function Page(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;
	const id = params.id;

	const repository = await getRepositoryById(id);

	if (!repository.data) {
		notFound();
	} else if (!repository.success) {
		toast.error("Error", {
			description: repository?.error || repository?.message, 
		});
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
			<EditForm repository={repository.data} />
		</div>
	)
}

export default Page