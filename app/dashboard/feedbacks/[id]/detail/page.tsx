import { Breadcrumbs } from '@/app/dashboard/layout'
import { getFeedbackId } from '@/app/lib/feedbacks/actions';
import DetailCard from '@/components/ui/feedbacks/detail-card';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';

export const metadata: Metadata = {
	title: "Detail Feedback"
}

async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;

    const feedback = await getFeedbackId(id);

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
                        label: 'Detail Feedback',
                        href: `/dashboard/feedbacks/${id}/detail`,
                        active: true,
                    },
                ]}
            />
            <DetailCard feedback={feedback.data} />
        </main>
    )
}

export default Page