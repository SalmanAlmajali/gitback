import React from 'react'
import { Breadcrumbs } from '@/app/dashboard/layout'
import { Metadata } from 'next'
import CreateForm from '@/components/ui/repositories/create-form'
import { getAuthenticatedUserRepos } from '@/app/lib/github/api'
import { getServerSession } from 'next-auth'
import { config } from '@/app/lib/auth'

export const metadata: Metadata = {
    title: "Create Repository"
}

async function Page() {
    const session = await getServerSession(config);

    const repositories = await getAuthenticatedUserRepos(session?.accessToken);
    
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
            <CreateForm repositories={repositories} />
        </main>
    )
}

export default Page