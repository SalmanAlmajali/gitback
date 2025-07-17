import React from 'react'
import { Breadcrumbs } from '@/app/dashboard/layout'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Create Repository"
}

async function Page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Repositories', href: '/dashboard/repositories' },
                    {
                        label: 'Create Repository',
                        href: `/dashboard/repositories/create`,
                        active: true,
                    },
                ]}
            />
        </main>
    )
}

export default Page