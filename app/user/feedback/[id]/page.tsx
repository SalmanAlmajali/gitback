import { getRepositoryById } from '@/app/lib/repositories/actions'
import UserFeedbackForm from '@/components/ui/feedbacks/user-feedback-form'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import { toast, Toaster } from 'sonner'

export const metadata: Metadata = {
	title: 'User Feedback'
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
		<div className="flex min-h-svh w-full items-center justify-center p-0 md:p-10">
			<div className="w-full max-w-5xl">
				<UserFeedbackForm repository={repository.data} />
				<Toaster />
			</div>
		</div>
	)
}

export default Page