'use server';

import { UserSelectedRepository } from "@prisma/client";
import { CustomResponse } from "../definitions";
import { checkForSession } from "../utils";
import { revalidatePath } from "next/cache";
import z from "zod";
import { auth } from "@/auth";
import { prisma } from "../prisma";
import { deleteImageByRepository } from "../feedbacks/actions";

const ITEMS_PER_PAGE = 10;

const FormSchema = z.object({
    githubRepoId: z.coerce.bigint(),
    name: z.string(),
    fullName: z.string(),
    description: z.string().nullable(),
    htmlUrl: z.string().url(),
    private: z.boolean(),
    language: z.string().nullable(),
    stargazersCount: z.coerce.number(),
    forksCount: z.coerce.number(),
    updatedAtGitHub: z.string(),
});

export async function getUserSelectedRepositories(
    query?: string | undefined,
    currentPage?: number | undefined,
): Promise<{
    success?: boolean, data?: UserSelectedRepository[]; totalCount?: number, totalPages?: number, error?: string
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
        });

        return {
            success: true,
            data: repositories,
            totalCount: totalCount,
            totalPages: Math.ceil(Number(totalCount) / ITEMS_PER_PAGE),
        };
    } catch (error) {
        console.error('Failed to read user selected repositories from DB:', error);
        return { success: false, error: 'Failed to retrieve selected repositories. Please try again.' };
    }
}

export async function addSelectedRepository(
    formData: FormData
): Promise<CustomResponse> {
    const session = await auth();

    checkForSession(session);

    try {
        const repository = FormSchema.parse({
            githubRepoId: formData.get('githubRepoId'),
            name: formData.get('name'),
            fullName: formData.get('fullName'),
            description: formData.get('description'),
            htmlUrl: formData.get('htmlUrl'),
            private: formData.get('private') === 'true' ? true : false,
            language: formData.get('language'),
            stargazersCount: formData.get('stargazersCount'),
            forksCount: formData.get('forksCount'),
            updatedAtGitHub: new Date((formData.get('updatedAtGitHub') as string)).toISOString(),
        })

        const existingRepo = await prisma.userSelectedRepository.findFirst({
            where: {
                userId: session?.user?.id,
                githubRepoId: repository.githubRepoId,
            },
        });

        if (existingRepo) {
            return { success: false, message: 'Repository already selected by this user.' };
        }

        await prisma.userSelectedRepository.create({
            data: {
                userId: session!.user.id,
                ...repository,
            },
        })

        revalidatePath('/dashboard/repositories');
        return { success: true, message: 'Repository added successfully!' };
    } catch (error: any) {
        console.error('Failed to add selected repository:', error);
        return { error: `Failed to add repository. ${error.message || 'Please try again.'}` };
    }
}

export async function getRepositoryById(id: string): Promise<CustomResponse<UserSelectedRepository>> {
    try {
        const respository = await prisma.userSelectedRepository.findUnique({
            where: {
                id,
            },
        });

        return { success: true, data: respository };
    } catch (error: any) {
        console.error('Failed to get selected repository:', error);
        return { error: `Failed to get repository. ${error.message || 'Please try again.'}` };
    }
}

const UpdateScheme = FormSchema.omit({ githubRepoId: true })

export async function updateRepository(id: string, formData: FormData): Promise<CustomResponse> {
    try {
        const repository = UpdateScheme.parse({
            name: formData.get('name'),
            fullName: formData.get('fullName'),
            description: formData.get('description'),
            htmlUrl: formData.get('htmlUrl'),
            private: formData.get('private') === 'true' ? true : false,
            language: formData.get('language'),
            stargazersCount: formData.get('stargazersCount'),
            forksCount: formData.get('forksCount'),
            updatedAtGitHub: new Date((formData.get('updatedAtGitHub') as string)).toISOString(),
        });

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
                ...repository,
            },
        });

        revalidatePath('/dashboard/repositories');
        return { success: true, message: 'Repository updated successfully!' };
    } catch (error: any) {
        console.error('Failed to update selected repository:', error);
        return { error: `Failed to update repository. ${error.message || 'Please try again.'}` };
    }
}

export async function deleteRepository(id: string): Promise<CustomResponse> {
    try {
        const result = await deleteImageByRepository(id);
        if (!result.success) {
            return result;
        }
        
        await prisma.userSelectedRepository.delete({
            where: {
                id,
            },
        });

        revalidatePath('/dashboard/repositories');
        return { success: true, message: 'Repository deleted successfully!' };
    } catch (error: any) {
        console.error('Failed to delete selected repository:', error);
        return { error: `Failed to delete repository. ${error.message || 'Please try again.'}` };
    }
}
