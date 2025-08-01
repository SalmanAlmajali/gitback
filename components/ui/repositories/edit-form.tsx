'use client';

import { IconClock, IconCode, IconDeviceFloppy, IconEyeCheck, IconEyeExclamation, IconGitBranch, IconGitFork, IconLink, IconLoader2, IconRefresh, IconStar, IconTextCaption } from '@tabler/icons-react';
import { Button } from '../button';
import { UserSelectedRepository } from '@prisma/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { figtree } from '@/components/fonts';
import MyInput, { MyTextArea } from '../my-input';
import { useState } from 'react';
import LinkButton from '../link-button';
import { updateRepository } from '@/app/lib/repositories/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getARepository } from '@/app/lib/github/api';
import { useSession } from 'next-auth/react';
import ConnectGitHub from '../connect-github';

export default function EditForm({
    repository,
}: {
    repository: UserSelectedRepository;
}) {
    const session = useSession();

    const router = useRouter();
    const [loading, setLoading] = useState({
        sync: false,
        update: false,
    });

    const setLoadingFlag = (key: keyof typeof loading, value: boolean) =>
        setLoading(prev => ({ ...prev, [key]: value }));

    const updateRepositoryWithId = async (e: any) => {
        e.preventDefault();

        setLoadingFlag('update', true)

        const form = e.target;
        const formData = new FormData(form);

        const result = await updateRepository(repository.id, formData)

        if (result?.success) {
            toast.success('Success', {
                description: result?.message
            });
            setLoadingFlag('update', false);
            router.push('/dashboard/repositories');
        } else {
            toast.error("Error", {
                description: result?.error || result?.message,
            });


            setLoadingFlag('update', false)
        }
    }

    const handleSync = async (e: any) => {
        e.preventDefault();

        setLoadingFlag('sync', true)

        const owner = repository.fullName.split('/', 1)[0];
        const result = await getARepository(session.data?.accessToken, owner, repository.name)

        if (result.data) {
            const formData = new FormData();
            formData.append("githubRepoId", result.data.id.toString());
            formData.append("name", result.data.name);
            formData.append("fullName", result.data.full_name);
            formData.append("description", result.data.description ?? '');
            formData.append("htmlUrl", result.data.html_url);
            formData.append("private", result.data.private ? 'true' : 'false');
            formData.append("language", result.data.language ?? '');
            formData.append("stargazersCount", result.data.stargazers_count.toString());
            formData.append("forksCount", result.data.forks_count.toString());
            formData.append("updatedAtGitHub", result.data.updated_at);

            const updateResult = await updateRepository(repository.id, formData);

            if (updateResult?.success) {
                toast.success('Success', {
                    description: updateResult?.message
                });
                setLoadingFlag('sync', false)
                router.push('/dashboard/repositories');
            } else {
                toast.error("Error", {
                    description: updateResult?.error || updateResult?.message,
                });
            }
        } else {
            toast.error("Error", {
                description: result.error
            })

            setLoadingFlag('sync', false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className={`${figtree.className} text-2xl font-bold leading-tight`}>Update Repository</CardTitle>
                <CardDescription>If U are logged in using GitHub account or already linked your account, U can automaticaly sync your repository directly from GitHub or edit manually.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={updateRepositoryWithId} encType='multipart/form-data'>
                    <div className="mb-4">
                        <label htmlFor="name" className="mb-2 block text-sm font-medium">
                            GitHub Repository Name
                        </label>
                        <MyInput
                            name={'name'}
                            type={'text'}
                            placeholder={"Enter your GitHub repository name"}
                            icon={<IconGitBranch className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                            defaultValue={repository.name}
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
                            defaultValue={repository.fullName}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="mb-2 block text-sm font-medium">
                            Description
                        </label>
                        <MyTextArea
                            name={'description'}
                            icon={<IconTextCaption className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                            defaultValue={repository.description ?? ''}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="htmlUrl" className="mb-2 block text-sm font-medium">
                            URL To The Repository On GitHub
                        </label>
                        <MyInput
                            name={'htmlUrl'}
                            type={'url'}
                            placeholder={'Enter the repository URL'}
                            icon={<IconLink className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                            defaultValue={repository.htmlUrl}
                            required
                        />
                    </div>
                    <fieldset className='mb-4'>
                        <legend className="mb-2 block text-sm font-medium">
                            Repository Visibility
                        </legend>
                        <div className="rounded-md border px-[14px] py-3">
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center">
                                    <input
                                        id="public"
                                        name="private"
                                        type="radio"
                                        value="false"
                                        className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                        defaultChecked={repository.private === false}
                                    />
                                    <label
                                        htmlFor="public"
                                        className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                                    >
                                        Public <IconEyeCheck className="h-4 w-4" />
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="private"
                                        name="private"
                                        type="radio"
                                        value="true"
                                        className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                        defaultChecked={repository.private === true}
                                    />
                                    <label
                                        htmlFor="private"
                                        className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white"
                                    >
                                        Private <IconEyeExclamation className="h-4 w-4" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <div className="mb-4">
                        <label htmlFor="language" className="mb-2 block text-sm font-medium">
                            Repository Primary Language
                        </label>
                        <MyInput
                            name={'language'}
                            type={'text'}
                            placeholder={'Enter the repository primary language'}
                            icon={<IconCode className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                            defaultValue={repository.language ?? ''}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="stargazersCount" className="mb-2 block text-sm font-medium">
                            Repository Stars Count
                        </label>
                        <MyInput
                            name={'stargazersCount'}
                            type={'number'}
                            placeholder={'Enter the repository stars count'}
                            icon={<IconStar className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                            min={0}
                            defaultValue={repository.stargazersCount}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="forksCount" className="mb-2 block text-sm font-medium">
                            Repository Fork Count
                        </label>
                        <MyInput
                            name={'forksCount'}
                            type={'number'}
                            placeholder={'Enter the repository fork count'}
                            icon={<IconGitFork className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                            min={0}
                            defaultValue={repository.forksCount}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="updatedAtGitHub" className="mb-2 block text-sm font-medium">
                            Last Repository Updated Time
                        </label>
                        <MyInput
                            name={'updatedAtGitHub'}
                            type={'datetime-local'}
                            placeholder={'Enter the last repository updated time'}
                            icon={<IconClock className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                            min={0}
                            defaultValue={repository.updatedAt.toISOString().split('Z', 1)[0]}
                        />
                    </div>
                    <div className='flex flex-col-reverse md:flex-row-reverse justify-between w-full mt-4 gap-2'>
                        <div className='flex flex-col-reverse md:flex-row md:justify-end gap-2'>
                            <LinkButton
                                href="/dashboard/repositories"
                                className='px-4 py-2 rounded-lg'
                                variant='secondary'
                            >
                                Cancel
                            </LinkButton>
                            <Button type='submit' disabled={loading.update}>
                                {loading.update ? (
                                    <>
                                        <IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                                    </>
                                ) : (
                                    <>
                                        <IconDeviceFloppy />
                                        Update Repository
                                    </>
                                )}
                            </Button>
                        </div>
                        {session.data?.accessToken !== undefined ? (
                            <Button
                                onClick={handleSync}
                                disabled={loading.sync}
                            >
                                {loading.sync ? (
                                    <>
                                        <IconRefresh className="mr-2 h-4 w-4 animate-spin" /> Sync...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path
                                                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        Sync with GitHub
                                    </>
                                )}
                            </Button>
                        ) : (
                            <ConnectGitHub />
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}