import { Metadata } from 'next'
import React, { Suspense } from 'react'
import { PageTitle } from './layout'
import { CardsSkeleton, FeedbackChartSkeleton, LatestFeedbackSkeleton } from '@/components/ui/dashboard/skeletons'
import CardWrapper from '@/components/ui/dashboard/cards'
import FeedbackChart from '@/components/ui/dashboard/feedback-chart'
import LatestFeedback from '@/components/ui/dashboard/latest-feedback'

export const metadata: Metadata = {
	title: "Dashboard"
}

function Page() {
	return (
		<div>
			<PageTitle title='Dashboard' />
			<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
				<Suspense fallback={<CardsSkeleton />}>
					<CardWrapper />
				</Suspense>
			</div>
			<div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
				<Suspense fallback={<FeedbackChartSkeleton />}>
					<FeedbackChart />
				</Suspense>
				<Suspense fallback={<LatestFeedbackSkeleton />}>
					<LatestFeedback />
				</Suspense>
			</div>
		</div>
	)
}

export default Page