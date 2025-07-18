import React from 'react'
import { Breadcrumbs } from '@/app/dashboard/layout'
import { Metadata } from 'next'
import CreateForm from '@/components/ui/repositories/create-form'
import { fetchUsers } from '@/app/lib/users/actions'

export const metadata: Metadata = {
    title: "Create Repository"
}

async function Page() {
    const users = await fetchUsers();

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
            <CreateForm users={users} />
        </main>
    )
}

export default Page