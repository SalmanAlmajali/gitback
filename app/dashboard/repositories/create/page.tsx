import React from 'react'
import { Breadcrumbs } from '@/app/dashboard/layout'
import { Metadata } from 'next'
import ImportRepo from '@/components/ui/repositories/import-repo'
import { getAuthenticatedUserRepos } from '@/app/lib/github/api'
import CreateForm from '@/components/ui/repositories/create-form'
import { auth } from '@/auth'

export const metadata: Metadata = {
    title: "Create Repository"
}

async function Page() {
    const session = await auth();

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
            <div className='flex flex-col gap-4 md:flex-row'>
                <ImportRepo repositories={repositories} />
                <CreateForm />
            </div>
        </main>
    )
}

export default Page