import { GitHubRepoApiData } from "../repositories/definitions";

export async function getAuthenticatedUserRepos(accessToken: string | undefined): Promise<GitHubRepoApiData[]> {
    let allRepos: GitHubRepoApiData[] = [];
    
    if (!accessToken) {
        return allRepos;
    }

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

        const repos: GitHubRepoApiData[] = await response.json();
        allRepos = allRepos.concat(repos);

        const linkHeader = response.headers.get('Link');
        const hasNextPage = linkHeader && linkHeader?.includes('rel="next"');

        if (!hasNextPage || repos.length < per_page) {
            break;
        }
        page++
    }

    return allRepos;
}
