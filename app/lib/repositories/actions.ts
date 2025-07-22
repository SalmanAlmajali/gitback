'use server';

import { UserSelectedRepository } from "@prisma/client";
import prisma from "../prisma";
import { getServerSession } from "next-auth";
import { config } from "../auth";
import { GitHubRepoDataForSelection } from "./definitions";
import { CustomResponse } from "../definitions";
import { checkForSession } from "../utils";

const ITEMS_PER_PAGE = 10;

export async function getUserSelectedRepositories(
    query: string,
    currentPage: number,
): Promise<{
    data?: UserSelectedRepository[]; totalCount?: number, error?: string
}> {
    const session = await getServerSession(config);

    checkForSession(session);

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const searchLower = query.toLowerCase();

    try {
        const whereClause: any = {
            userId: session?.user?.id,
        };

        if (query) {
            whereClause.OR = [
                { user: { name: { contains: searchLower, mode: 'insensitive' } } },
                { user: { email: { contains: searchLower, mode: 'insensitive' } } },
                { name: { contains: searchLower, mode: 'insensitive' } },
                { fullName: { contains: searchLower, mode: 'insensitive' } },
            ];
        }

        // Get total count
        const totalCount = await prisma.userSelectedRepository.count({
            where: whereClause,
        });

        // Get paginated repositories
        const repositories = await prisma.userSelectedRepository.findMany({
            where: whereClause,
            orderBy: {
                updatedAt: 'desc',
            },
            take: ITEMS_PER_PAGE,
            skip: offset,
            include: {
                user: true,
            },
        });

        return { data: repositories, totalCount: totalCount };
    } catch (error) {
        console.error('Failed to read user selected repositories from DB:', error);
        return { error: 'Failed to retrieve selected repositories. Please try again.' };
    }
}

export async function addSelectedRepository(
    githubRepoData: GitHubRepoDataForSelection
): Promise<CustomResponse> {
    const session = await getServerSession(config);

    checkForSession(session);

    try {
        const repoDataForPrisma = {
            githubRepoId: BigInt(githubRepoData.id),
            name: githubRepoData.name,
            fullName: githubRepoData.full_name,
            description: githubRepoData.description,
            htmlUrl: githubRepoData.html_url,
            private: githubRepoData.private,
            language: githubRepoData.language,
            stargazersCount: githubRepoData.stargazers_count,
            forksCount: githubRepoData.forks_count,
            updatedAtGitHub: new Date(githubRepoData.updated_at),
        };

        const existingRepo = await prisma.userSelectedRepository.findFirst({
            where: {
                userId: session?.user?.id,
                githubRepoId: repoDataForPrisma.githubRepoId,
            },
        });

        if (existingRepo) {
            return { success: false, message: 'Repository already selected by this user.' };
        }

        await prisma.userSelectedRepository.create({
            data: {
                userId: session?.user.id,
                ...repoDataForPrisma,
            },
        })

        return { success: true, message: 'Repository added successfully!' };
    } catch (error) {
        console.error('Failed to add selected repository:', error);
        return { error: `Failed to add repository. ${error.message || 'Please try again.'}` };
    }
}
