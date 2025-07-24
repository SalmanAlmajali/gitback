'use client';

import { IconClock, IconCode, IconDeviceFloppy, IconEyeCheck, IconEyeExclamation, IconGitBranch, IconGitFork, IconId, IconLink, IconLoader2, IconRefresh, IconStar, IconTextCaption } from '@tabler/icons-react';
import { Button } from '../button';
import { UserSelectedRepository } from '@prisma/client';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { figtree } from '@/components/fonts';
import MyInput, { MyTextArea } from '../my-input';
import { handleSetState } from '@/app/lib/utils';
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

    const [payload, setPayload] = useState({
        id: 0,
        name: repository?.name,
        full_name: repository?.fullName,
        description: repository?.description,
        html_url: repository?.htmlUrl,
        private: repository?.private,
        language: repository?.language,
        stargazers_count: repository?.stargazersCount,
        forks_count: repository?.forksCount,
        updated_at: repository?.updatedAt.toString(),
    });

    const updateRepositoryWithId = async (e) => {
        e.preventDefault();

        setLoading(prevState => ({
            ...prevState,
            update: true,
        }))

        const result = await updateRepository(repository.id, payload)

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

        setLoading(prevState => ({
            ...prevState,
            update: false,
        }))
    }

    const handleSync = async (e) => {
        e.preventDefault();

        setLoading(prevState => ({
            ...prevState,
            sync: true,
        }))

        const owner = repository.fullName.split('/', 1)[0];
        const result = await getARepository(session.data?.accessToken, owner, repository.name)

        const updateResult = await updateRepository(repository.id, {
            id: result!.id,
            name: result!.name,
            full_name: result!.full_name,
            description: result!.description,
            html_url: result!.html_url,
            private: result!.private,
            language: result!.language,
            stargazers_count: result!.stargazers_count,
            forks_count: result!.forks_count,
            updated_at: result!.updated_at,
        });

        if (updateResult?.success) {
            toast.success('Success', {
                description: updateResult?.message
            });
            router.push('/dashboard/repositories');
        } else {
            toast.error("Error", {
                description: updateResult?.error || updateResult?.message,
            });
        }

        setLoading(prevState => ({
            ...prevState,
            sync: false,
        }))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className={`${figtree.className} text-2xl font-bold leading-tight`}>Update Repository</CardTitle>
                <CardDescription>If U are logged in using GitHub account or already linked your account, U can automaticaly sync your repository directly from GitHub or edit manually.</CardDescription>
                <CardAction>
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
                                    Sync with GitHub repository
                                </>
                            )}
                        </Button>
                    ) : (
                        <ConnectGitHub />
                    )}
                </CardAction>
            </CardHeader>
            <CardContent>
                <form onSubmit={updateRepositoryWithId}>
                    <div className="mb-4">
                        <label htmlFor="id" className="mb-2 block text-sm font-medium">
                            GitHub Repository Id
                        </label>
                        <MyInput
                            name={'id'}
                            type={'number'}
                            placeholder={"Enter your GitHub repository Id"}
                            icon={<IconId className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                            onChange={e => handleSetState('id', e.target.value, setPayload)}
                            defaultValue={repository.githubRepoId}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="name" className="mb-2 block text-sm font-medium">
                            GitHub Repository Name
                        </label>
                        <MyInput
                            name={'name'}
                            type={'text'}
                            placeholder={"Enter your GitHub repository name"}
                            icon={<IconGitBranch className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                            onChange={e => handleSetState('name', e.target.value, setPayload)}
                            defaultValue={repository.name}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="full_name" className="mb-2 block text-sm font-medium">
                            GitHub Repository Full Name
                        </label>
                        <MyInput
                            name={'full_name'}
                            type={'text'}
                            placeholder={"GitHub repository full name (ownername/repo_name)"}
                            icon={<IconGitBranch className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                            onChange={e => handleSetState('full_name', e.target.value, setPayload)}
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
                            onChange={e => handleSetState('description', e.target.value, setPayload)}
                            defaultValue={repository.description}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="html_url" className="mb-2 block text-sm font-medium">
                            URL To The Repository On GitHub
                        </label>
                        <MyInput
                            name={'html_url'}
                            type={'url'}
                            placeholder={'Enter the repository URL'}
                            icon={<IconLink className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                            onChange={e => handleSetState('html_url', e.target.value, setPayload)}
                            defaultValue={repository.htmlUrl}
                            required
                        />
                    </div>
                    <fieldset className='mb-4'>
                        <legend className="mb-2 block text-sm font-medium">
                            Repository Visibility
                        </legend>
                        <div className="rounded-md border px-[14px] py-3">
                            <div className="flex gap-4">
                                <div className="flex items-center">
                                    <input
                                        id="public"
                                        name="private"
                                        type="radio"
                                        value="public"
                                        className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                        onChange={() => setPayload((prevState) => ({
                                            ...prevState,
                                            private: false
                                        }))}
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
                                        value="private"
                                        className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                        onChange={() => setPayload((prevState) => ({
                                            ...prevState,
                                            private: true
                                        }))}
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
                            onChange={e => handleSetState('language', e.target.value, setPayload)}
                            defaultValue={repository.language}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="stargazers_count" className="mb-2 block text-sm font-medium">
                            Repository Stars Count
                        </label>
                        <MyInput
                            name={'stargazers_count'}
                            type={'number'}
                            placeholder={'Enter the repository stars count'}
                            icon={<IconStar className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                            onChange={e => handleSetState('stargazers_count', e.target.value, setPayload)}
                            min={0}
                            defaultValue={repository.stargazersCount}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="forks_count" className="mb-2 block text-sm font-medium">
                            Repository Fork Count
                        </label>
                        <MyInput
                            name={'forks_count'}
                            type={'number'}
                            placeholder={'Enter the repository fork count'}
                            icon={<IconGitFork className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                            onChange={e => handleSetState('forks_count', e.target.value, setPayload)}
                            min={0}
                            defaultValue={repository.forksCount}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="updated_at" className="mb-2 block text-sm font-medium">
                            Last Repository Updated Time
                        </label>
                        <MyInput
                            name={'updated_at'}
                            type={'datetime-local'}
                            placeholder={'Enter the last repository updated time'}
                            icon={<IconClock className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                            onChange={e => handleSetState('updated_at', e.target.value, setPayload)}
                            min={0}
                            defaultValue={repository.updatedAt.toISOString().split('Z', 1)[0]}
                        />
                    </div>
                    <div className='flex justify-end gap-x-2'>
                        <LinkButton
                            href="/dashboard/repositories"
                            className='px-4 rounded-lg'
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
                </form>
            </CardContent>
        </Card>
    );
}