import { getUserSelectedRepositories } from '@/app/lib/repositories/actions'
import React from 'react'
import { Breadcrumbs } from '../../layout'
import CreateForm from '@/components/ui/feedbacks/create-form'

async function Page() {
    const repositories = await getUserSelectedRepositories()
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Feedbacks', href: '/dashboard/feedbacks' },
                    {
                        label: 'Create Feedback',
                        href: `/dashboard/feedbacks/create`,
                        active: true,
                    },
                ]}
            />
            <CreateForm repositories={repositories.data} />
        </main>
    )
}

export default Page