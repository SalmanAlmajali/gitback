import { UserField } from '@/app/lib/users/definitions';
import { IconBookmarks, IconBrandGit, IconBrandGithub, IconUserCircle } from '@tabler/icons-react';
import { Button } from '../button';
import Link from 'next/link';
import { createRepository } from '@/app/lib/repositories/actions';

export default function CreateForm({
    users,
}: {
    users: UserField[];
}) {

    return (
        <form
            action={async (formData: FormData) => {
                'use server';
                await createRepository(formData);
            }}
            className="my-8"
        >
            <div className="rounded-md bg-neutral-100 dark:bg-neutral-900 p-4 md:p-6">
                {/* User Name */}
                <div className="mb-4">
                    <label htmlFor="user_id" className="mb-2 block text-sm font-medium">
                        Choose user
                    </label>
                    <div className="relative">
                        <select
                            id="user_id"
                            name="user_id"
                            className="peer block w-full cursor-pointer rounded-md border py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        >
                            <option value="">
                                Select a user
                            </option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id} className='text-black'>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        <IconUserCircle className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                </div>

                {/* Name */}
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        Enter repository name
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter repository name"
                                className="peer block w-full rounded-md border py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                            <IconBookmarks className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Github Owner */}
                <div className="mb-4">
                    <label htmlFor="github_owner" className="mb-2 block text-sm font-medium">
                        Github owner
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="github_owner"
                                name="github_owner"
                                type="text"
                                placeholder="Enter github owner"
                                className="peer block w-full rounded-md border py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                            <IconBrandGithub className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Github Repo */}
                <div className="mb-4">
                    <label htmlFor="github_repo" className="mb-2 block text-sm font-medium">
                        Github repository
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="github_repo"
                                name="github_repo"
                                type="text"
                                placeholder="Enter github repository"
                                className="peer block w-full rounded-md border py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                            <IconBrandGit className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>
                </div>

            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    className="flex items-center rounded-lg bg-gray-100 dark:bg-gray-900 px-4 text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-200 dark:hover:bg-gray-800"
                    href={'/dashboard/repositories'}
                >
                    Cancel
                </Link>
                <Button type="submit">Create Repository</Button>
            </div>
        </form >
    );
}