import { figtree } from '@/components/fonts'
import { Metadata } from 'next'
import React from 'react'
import { PageTitle } from './layout'

export const metadata: Metadata = {
	title: "Dashboard"
}

function Page() {
	return (
		<div>
			<PageTitle title='Dashboard' />
			<p>Ini halaman dashboard yang masih statis</p>
		</div>
	)
}

export default Page