'use client';

import React, { useState } from 'react'
import MyInput, { MyTextArea } from '../my-input'
import { IconClock, IconCode, IconDeviceFloppy, IconEyeCheck, IconEyeExclamation, IconGitBranch, IconGitFork, IconId, IconLink, IconLoader2, IconStar, IconTextCaption } from '@tabler/icons-react';
import { handleSetState } from '@/app/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { Button } from '../button';
import LinkButton from '../link-button';
import { addSelectedRepository } from '@/app/lib/repositories/actions';
import { GitHubRepoDataForSelection } from '@/app/lib/repositories/definitions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { figtree } from '@/components/fonts';

function CreateForm() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [payload, setPayload] = useState<GitHubRepoDataForSelection>({
        id: 0,
        name: '',
        full_name: '',
        description: '',
        html_url: '',
        private: false,
        language: '',
        stargazers_count: 0,
        forks_count: 0,
        updated_at: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        const result = await addSelectedRepository(payload);

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

        setLoading(false);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className={`${figtree.className} text-2xl font-bold leading-tight`}>Create Repository Manually</CardTitle>
                <CardDescription>If U are logged in using GitHub account or already linked your account, consider importing your repository directly from GitHub. It's so much easier.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
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
                                        checked={payload.private === false}
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