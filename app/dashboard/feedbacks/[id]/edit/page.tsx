import { Breadcrumbs } from '@/app/dashboard/layout'
import { getFeedbackId } from '@/app/lib/feedbacks/actions';
import { getUserSelectedRepositories } from '@/app/lib/repositories/actions';
import EditForm from '@/components/ui/feedbacks/edit-form';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';

export const metadata: Metadata = {
	title: "Edit Feedback"
}

async function Page(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;
	const id = params.id;

	const [feedback, repositories] = await Promise.all([
		getFeedbackId(id),
		getUserSelectedRepositories(),
	])

	if (!feedback.data) {
		notFound();
	} else if (!feedback.success) {
		toast.error("Error", {
			description: feedback?.error || feedback?.message, 
		});
	}

	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: 'Feedbacks', href: '/dashboard/feedbacks' },
					{
						label: 'Edit Feedback',
						href: `/dashboard/feedbacks/${id}/edit`,
						active: true,
					},
				]}
			/>
			<EditForm feedback={feedback.data} repositories={repositories.data} />
		</main>
	)
}

export default Page