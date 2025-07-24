import { GitHubRepoApiData } from "../repositories/definitions";
import { getServerSession } from "next-auth";
import { config } from "../auth";
import { checkForSession } from "../utils";
import prisma from "../prisma";

export async function getAuthenticatedUserRepos(accessToken: string | undefined): Promise<GitHubRepoApiData[]> {
    let allFilteredRepos: GitHubRepoApiData[] = [];

    if (!accessToken) {
        return allFilteredRepos;
    }

    const dbReposResult = await dbSelectedRepositories();
    if (dbReposResult.error) {
        console.error("Error fetching selected repositories from DB:", dbReposResult.error);
        throw new Error(`Failed to retrieve user's selected repositories from database: ${dbReposResult.error}`);
    }

    const dbRepos = dbReposResult.data || [];
    const selectedRepoIds = new Set<number>(
        dbRepos.map(repo => Number(repo.githubRepoId))
    );

    let page = 1;
    const per_page = 100;

    while (true) {
        const response = await fetch(`https://api.github.com/user/repos?per_page=${per_page}&page=${page}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github+json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`GitHub API error (status: ${response.status}):`, errorText);
            throw new Error(`Failed to fetch GitHub repositories: ${response.statusText}. Details: ${errorText}`);
        }

        const reposOnCurrentPage: GitHubRepoApiData[] = await response.json();

        const filteredPageRepos = reposOnCurrentPage.filter(repo => {
            return !selectedRepoIds.has(repo.id);
        });

        allFilteredRepos = allFilteredRepos.concat(filteredPageRepos);

        const linkHeader = response.headers.get('Link');
        const hasNextPage = linkHeader && linkHeader?.includes('rel="next"');

        if (!hasNextPage || reposOnCurrentPage.length < per_page) {
            break;
        }
        page++;
    }

    return allFilteredRepos;
}

async function dbSelectedRepositories(): Promise<{
    data?: { githubRepoId: bigint }[]; error?: string
}> {
    const session = await getServerSession(config);

    checkForSession(session);

    try {
        const repositories: { githubRepoId: bigint }[] = await prisma.userSelectedRepository.findMany({
            where: {
                userId: session?.user?.id,
            },
            select: {
                githubRepoId: true,
            },
        });

        return { data: repositories };
    } catch (error) {
        console.error('Failed to read user selected repositories from DB:', error);
        return { error: 'Failed to retrieve selected repositories. Please try again.' };
    }
}
