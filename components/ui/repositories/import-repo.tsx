'use client';

import { GitHubRepoApiData } from '@/app/lib/repositories/definitions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { figtree } from '@/components/fonts';
import MyInput from '../my-input';
import React, { useEffect, useMemo, useState } from 'react';
import { IconArrowLeft, IconArrowRight, IconLoader2, IconSearch } from '@tabler/icons-react';
import { Button } from '../button';
import { addSelectedRepository } from '@/app/lib/repositories/actions';
import { toast } from 'sonner';
import clsx from 'clsx';
import { formatDateToLocal } from '@/app/lib/utils';
import { getLanguageColorClass, getLanguageHexColor } from '@/app/lib/language-color-map';
import { useSession } from 'next-auth/react';
import ConnectGitHub from '../connect-github';
import { useSearchParams } from 'next/navigation';

export default function ImportRepo({
    repositories,
}: {
    repositories: GitHubRepoApiData[];
}) {
    const session = useSession();

    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [addingRepoId, setAddingRepoId] = useState<number | null>(null);
    const [selectedRepoIds, setSelectedRepoIds] = useState<Set<number>>(new Set());

    const itemsPerPage = 10;

    const filteredRepos = useMemo(() => {
        const lowerCaseQuery = search.toLowerCase();
        return repositories.filter(repo =>
            repo.name.toLowerCase().includes(lowerCaseQuery) ||
            repo.full_name.toLowerCase().includes(lowerCaseQuery) ||
            (repo.description && repo.description.toLowerCase().includes(lowerCaseQuery)) ||
            (repo.language && repo.language.toLowerCase().includes(lowerCaseQuery))
        );
    }, [repositories, search]);

    const totalFilteredRepos = filteredRepos.length;
    const totalPages = Math.ceil(totalFilteredRepos / itemsPerPage);

    const paginatedRepos = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredRepos.slice(startIndex, endIndex);
    }, [filteredRepos, currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const handleAddRepo = async (repo: GitHubRepoApiData) => {
        setAddingRepoId(repo.id);

        const formData = new FormData();
        formData.append("githubRepoId", repo.id.toString());
        formData.append("name", repo.name);
        formData.append("fullName", repo.full_name);
        formData.append("description", repo.description ?? '');
        formData.append("htmlUrl", repo.html_url);
        formData.append("private", repo.private ? 'true' : 'false');
        formData.append("language", repo.language ?? '');
        formData.append("stargazersCount", repo.stargazers_count.toString());
        formData.append("forksCount", repo.forks_count.toString());
        formData.append("updatedAtGitHub", repo.updated_at);

        const result = await addSelectedRepository(formData);

        if (result.success) {
            toast.success('Success!', {
                description: result.message,
            });
            setSelectedRepoIds(prev => new Set(prev).add(repo.id));
        } else {
            toast.error('Error', {
                description: result.error || result.message,
            });
        }
        setAddingRepoId(null);
    };


    const goToPage = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const goToPreviousPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

    const paginationItems = useMemo(() => {
        return getPaginationItems(currentPage, totalPages);
    }, [currentPage, totalPages]);

    const searchParams = useSearchParams();
    const githubLinkedStatus = searchParams.get('githubLinked');

    useEffect(() => {
        if (githubLinkedStatus === 'success') {
            toast.success('Success', {
                description: 'GitHub account successfully linked!',
            });
        }
    }, [githubLinkedStatus]);

    return (
        <>
            <Card className='shadow-none ring-0 md:ring-1'>
                <CardHeader className='p-0 md:px-6'>
                    <CardTitle className={`${figtree.className} text-2xl font-bold leading-tight`}>Import Git Repository</CardTitle>
                    <CardDescription>All repositories below are fetch from your GitHub account. Cool isn't it</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4 p-0 md:px-6'>
                    <MyInput
                        name='query'
                        type='search'
                        placeholder='Search...'
                        onChange={e => setSearch(e.target.value)}
                        isHidden={session.data?.accessToken === undefined}
                        icon={<IconSearch className={clsx("pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500",
                            {
                                'hidden': session.data?.accessToken === undefined
                            }
                        )} />}
                    />
                    {!session?.data?.accessToken && (
                        <div className="text-center p-8 space-y-4">
                            <p className="text-gray-600">This feature is only available to users who are logged in using GitHub account.</p>
                            <p className="text-gray-600">Or</p>
                            <ConnectGitHub />
                        </div>
                    )}
                    {repositories.length === 0 && search === '' && session.data?.accessToken && (
                        <div className="text-center p-8">
                            <p className="text-gray-600">No GitHub repositories found for your account.</p>
                            <p className="text-gray-600">Ensure your GitHub account has public or private repositories, and that you've granted the necessary permissions.</p>
                        </div>
                    )}
                    {paginatedRepos.length === 0 && search !== '' && (
                        <div className="text-center p-8">
                            <p className="text-gray-600">No repositories found matching "{search}".</p>
                        </div>
                    )}
                    <div className={clsx("rounded-xl h-screen overflow-y-scroll no-scrollbar border border-neutral-300 dark:border-neutral-700",
                        {
                            'hidden': session.data?.accessToken === undefined || filteredRepos.length === 0,
                        }
                    )}>
                        {paginatedRepos.map((repo, i) => (
                            <Card key={repo.id} className={clsx('shadow-none ring-0 border-b rounded-none',
                                {
                                    'rounded-t-xl': i === 0,
                                    'rounded-b-xl': i === itemsPerPage - 1,
                                }
                            )}>
                                <CardHeader>
                                    <CardTitle className={`${figtree.className} text-xl font-bold truncate`}>
                                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">
                                            {repo.full_name}
                                        </a>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-secondary-foreground mb-2">{repo.description || 'No description provided.'}</p>
                                    <div className="flex items-center text-sm text-gray-500 space-x-2">
                                        {repo.language && (
                                            <span className="flex items-center">
                                                {repo.language && (
                                                    <span className={`flex items-center ${getLanguageColorClass(repo.language)}`}>
                                                        <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: getLanguageHexColor(repo.language) }}></span>
                                                        {repo.language}
                                                    </span>
                                                )}
                                            </span>
                                        )}
                                        <span>⭐ {repo.stargazers_count}</span>
                                        <span>🍴 {repo.forks_count}</span>
                                        <span className={clsx('px-2 py-0.5 rounded-full text-xs',
                                            {
                                                'bg-red-100 text-red-800': repo.private === true,
                                                'bg-green-100 text-green-800': repo.private === false,
                                            }
                                        )}>
                                            {repo.private ? 'Private' : 'Public'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Last updated on GitHub: {formatDateToLocal(repo.updated_at)}
                                    </p>
                                    <Button
                                        onClick={() => handleAddRepo(repo)}
                                        disabled={addingRepoId === repo.id || selectedRepoIds.has(repo.id)}
                                        className="mt-4 w-full"
                                    >
                                        {addingRepoId === repo.id ? (
                                            <>
                                                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                                            </>
                                        ) : selectedRepoIds.has(repo.id) ? (
                                            'Already Added'
                                        ) : (
                                            'Add to My Repos'
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-4 items-center mt-8">
                            <Button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                variant="outline"
                                size="sm"
                            >
                                <IconArrowLeft />
                            </Button>
                            {paginationItems.map((item, index) => (
                                <React.Fragment key={index}> {/* Use Fragment for keys */}
                                    {typeof item === 'number' ? (
                                        <Button
                                            onClick={() => goToPage(item)}
                                            variant={item === currentPage ? 'default' : 'outline'}
                                            size="sm"
                                        >
                                            {item}
                                        </Button>
                                    ) : (
                                        <span className="px-2 py-1 text-gray-500">...</span>
                                    )}
                                </React.Fragment>
                            ))}
                            <Button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                variant="outline"
                                size="sm"
                            >
                                <IconArrowRight />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}


function getPaginationItems(currentPage: number, totalPages: number) {
    const items: (number | string)[] = [];
    const ellipsis = '...';

    const SMALL_PAGES_THRESHOLD = 5;

    if (totalPages <= SMALL_PAGES_THRESHOLD) {
        for (let i = 1; i <= totalPages; i++) {
            items.push(i);
        }
        return items;
    }

    if (currentPage === 1) {
        items.push(1);
        items.push(2);
        items.push(ellipsis);
        items.push(totalPages);
    }
    else if (currentPage >= totalPages - 1) {
        items.push(1);
        items.push(ellipsis);
        items.push(totalPages - 1);
        items.push(totalPages);
    }
    else if (currentPage >= totalPages - 2) {
        items.push(1);
        items.push(ellipsis);
        items.push(totalPages - 2);
        items.push(totalPages - 1);
    }
    else {
        items.push(currentPage);
        items.push(currentPage + 1);
        items.push(ellipsis);
        items.push(totalPages);
    }

    return items;
}
