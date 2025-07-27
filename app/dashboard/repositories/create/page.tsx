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
            <div className='grid grid-rows-2 grid-cols-1 gap-4 lg:grid-rows-1 lg:grid-cols-2'>
                <ImportRepo repositories={repositories} />
                <CreateForm />
            </div>
        </main>
    )
}

export default Page