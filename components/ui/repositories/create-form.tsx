'use client';

import React, { useState } from 'react'
import MyInput from '../my-input'
import { IconDeviceFloppy, IconGitBranch, IconLoader2 } from '@tabler/icons-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { Button } from '../button';
import LinkButton from '../link-button';
import { addSelectedRepository } from '@/app/lib/repositories/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { figtree } from '@/components/fonts';
import { getARepository } from '@/app/lib/github/api';
import { useSession } from 'next-auth/react';

function CreateForm() {
    const session = useSession();

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);

        const [name, fullName] = [formData.get('name')?.toString(), formData.get('fullName')?.toString()];

        const repository = await getRepository(name, fullName);

        if (repository.success && repository.data) {
            const formData = new FormData();
            formData.append("githubRepoId", repository.data.id.toString());
            formData.append("name", repository.data.name);
            formData.append("fullName", repository.data.full_name);
            formData.append("description", repository.data.description ?? '');
            formData.append("htmlUrl", repository.data.html_url);
            formData.append("private", repository.data.private ? 'true' : 'false');
            formData.append("language", repository.data.language ?? '');
            formData.append("stargazersCount", repository.data.stargazers_count.toString());
            formData.append("forksCount", repository.data.forks_count.toString());
            formData.append("updatedAtGitHub", repository.data.updated_at);

            const result = await addSelectedRepository(formData);

            if (result?.success) {
                toast.success('Success', {
                    description: result?.message
                });
                router.push('/dashboard/repositories');
            } else {
                toast.error("Error", {
                    description: result?.error || result?.message,
                });
            }
        }

        setLoading(false);
    }

    const getRepository = async (name: string | undefined, fullName: string | undefined) => {
        if (name !== undefined && fullName !== undefined) {
            const owner = fullName.split('/', 1)[0];
            const result = await getARepository(session.data?.accessToken, owner, name)

            if (result.success && result.data) {
                return { success: true, data: result.data };
            } else {
                toast.error("Error", {
                    description: result.error
                })
            }
        }

        return { success: false };
    }

    return (
        <Card className='w-full h-fit sticky top-7'>
            <CardHeader>
                <CardTitle className={`${figtree.className} text-2xl font-bold leading-tight`}>Create Repository Manually</CardTitle>
                <CardDescription>If U are logged in using GitHub account or already linked your account, consider importing your repository directly from GitHub. It&apos;s so much easier.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="mb-2 block text-sm font-medium">
                            GitHub Repository Name
                        </label>
                        <MyInput
                            name={'name'}
                            type={'text'}
                            placeholder={"Enter your GitHub repository name"}
                            icon={<IconGitBranch className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="fullName" className="mb-2 block text-sm font-medium">
                            GitHub Repository Full Name
                        </label>
                        <MyInput
                            name={'fullName'}
                            type={'text'}
                            placeholder={"GitHub repository full name (ownername/repo_name)"}
                            icon={<IconGitBranch className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                            required
                        />
                    </div>
                    <div className='flex flex-col-reverse md:flex-row md:justify-end gap-2'>
                        <LinkButton
                            href="/dashboard/repositories"
                            className='px-4 py-2 rounded-lg'
                            variant='secondary'
                        >
                            Cancel
                        </LinkButton>
                        <Button type='submit' disabled={loading}>
                            {loading ? (
                                <>
                                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                                </>
                            ) : (
                                <>
                                    <IconDeviceFloppy />
                                    Add Repository
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default CreateForm