'use server';

import { UserSelectedRepository } from "@prisma/client";
import { GitHubRepoDataForSelection } from "./definitions";
import { CustomResponse } from "../definitions";
import { checkForSession } from "../utils";
import { revalidatePath } from "next/cache";
import z from "zod";
import { auth } from "@/auth";
import { prisma } from "../prisma";

const ITEMS_PER_PAGE = 10;

const FormSchema = z.object({
    id: z.coerce.bigint(),
    name: z.string(),
    full_name: z.string(),
    description: z.string().nullable(),
    html_url: z.string().url(),
    private: z.boolean(),
    language: z.string().nullable(),
    stargazers_count: z.coerce.number(),
    forks_count: z.coerce.number(),
    updated_at: z.string(),
});


export async function getUserSelectedRepositories(
    query?: string | undefined,
    currentPage?: number | undefined,
): Promise<{
    data?: UserSelectedRepository[]; totalCount?: number, error?: string
}> {
    const session = await auth();
    let offset = 0;

    checkForSession(session);

    try {
        const whereClause: any = {
            userId: session?.user?.id,
        };

        if (currentPage) {
            offset = (currentPage - 1) * ITEMS_PER_PAGE;
        }

        if (query) {
            const searchLower = query.toLowerCase();
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
    const session = await auth();

    checkForSession(session);

    try {
        const repository = FormSchema.parse(githubRepoData)

        const repoDataForPrisma = {
            githubRepoId: repository.id,
            name: repository.name,
            fullName: repository.full_name,
            description: repository.description,
            htmlUrl: repository.html_url,
            private: repository.private,
            language: repository.language,
            stargazersCount: repository.stargazers_count,
            forksCount: repository.forks_count,
            updatedAtGitHub: new Date(repository.updated_at),
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
                userId: session?.user?.id,
                ...repoDataForPrisma,
            },
        })

        revalidatePath('/dashboard/repositories');
        return { success: true, message: 'Repository added successfully!' };
    } catch (error) {
        console.error('Failed to add selected repository:', error);
        return { error: `Failed to add repository. ${error.message || 'Please try again.'}` };
    }
}

export async function getRepositoryById(id: string): Promise<CustomResponse> {
    try {
        const respository = await prisma.userSelectedRepository.findUnique({
            where: {
                id,
            },
        });

        return { success: true, data: respository };
    } catch (error) {
        console.error('Failed to get selected repository:', error);
        return { error: `Failed to get repository. ${error.message || 'Please try again.'}` };
    }
}

export async function updateRepository(id: string, githubRepoData: GitHubRepoDataForSelection): Promise<CustomResponse> {
    try {
        const repository = FormSchema.parse(githubRepoData);

        const repoDataForPrisma = {
            githubRepoId: repository.id,
            name: repository.name,
            fullName: repository.full_name,
            description: repository.description,
            htmlUrl: repository.html_url,
            private: repository.private,
            language: repository.language,
            stargazersCount: repository.stargazers_count,
            forksCount: repository.forks_count,
            updatedAtGitHub: new Date(repository.updated_at),
        };

        const existingRepo = await prisma.userSelectedRepository.findFirst({
            where: {
                id,
            },
        });

        if (!existingRepo) {
            return { success: false, message: 'Repository with this id is not exist.' };
        }

        await prisma.userSelectedRepository.update({
            where: {
                id,
            },
            data: {
                ...repoDataForPrisma,
            },
        });

        revalidatePath('/dashboard/repositories');
        return { success: true, message: 'Repository updated successfully!' };
    } catch (error) {
        console.error('Failed to update selected repository:', error);
        return { error: `Failed to update repository. ${error.message || 'Please try again.'}` };
    }
}

export async function deleteRepository(id: string): Promise<CustomResponse> {
    try {
        await prisma.userSelectedRepository.delete({
            where: {
                id,
            },
        });

        revalidatePath('/dashboard/repositories');
        return { success: true, message: 'Repository deleted successfully!' };
    } catch (error) {
        console.error('Failed to delete selected repository:', error);
        return { error: `Failed to delete repository. ${error.message || 'Please try again.'}` };
    }
}