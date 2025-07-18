'use server'

import { PrismaClient } from "@/app/generated/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { RepositoryForm } from "./definitions";

const prisma = new PrismaClient();

const ITEMS_PER_PAGE = 10;

const FormSchema = z.object({
    id: z.string(),
    userId: z.string(),
    name: z.string(),
    githubOwner: z.string(),
    githubRepo: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export async function fetchFilteredRepositories(
    query: string,
    currentPage: number,
) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const searchLower = query.toLowerCase();

    try {
        const repositories = await prisma.repository.findMany({
            where: {
                OR: [
                    { user: { name: { contains: searchLower, mode: 'insensitive' } } },
                    { user: { email: { contains: searchLower, mode: 'insensitive' } } },
                    { name: { contains: searchLower, mode: 'insensitive' } },
                    { githubOwner: { contains: searchLower, mode: 'insensitive' } },
                    { githubRepo: { contains: searchLower, mode: 'insensitive' } },
                ],
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: ITEMS_PER_PAGE,
            skip: offset,
        });

        return repositories;
    } catch (error) {
        console.error('Failed to fetch repositories:', error);
        throw new Error('Failed to fetch repositories from the database.');
    } finally {
        await prisma.$disconnect();
    }
}

const CreateRepository = FormSchema.omit({ id: true, createdAt: true, updatedAt: true });

export async function createRepository(formData: FormData) {
    const { userId, name, githubOwner, githubRepo } = CreateRepository.parse({
        userId: formData.get('user_id'),
        name: formData.get('name'),
        githubOwner: formData.get('github_owner'),
        githubRepo: formData.get('github_repo'),
    });

    try {
        await prisma.repository.create({
            data: {
                userId,
                name,
                githubOwner,
                githubRepo
            },
        });
    } catch (error) {
        console.error('Failed to create repository:', error);
        throw new Error('Failed to create repository.');
    } finally {
        await prisma.$disconnect();
        revalidatePath('/dashboard/repositories');
        redirect('/dashboard/repositories');
    }
}

export async function fetchRepositoryById(id: string) {
    try {
        const repository: RepositoryForm = await prisma.repository.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                userId: true,
                name: true,
                githubOwner: true,
                githubRepo: true,
            },
        });

        return repository;
    } catch (error) {
        console.error('Failed to create repository:', error);
        throw new Error('Failed to create repository.');
    } finally {
        await prisma.$disconnect();
    }
}

const UpdateRepository = FormSchema.omit({ id: true, createdAt: true, updatedAt: true });

export async function updateRepository(id: string | undefined, formData: FormData) {
    const { userId, name, githubOwner, githubRepo } = UpdateRepository.parse({
        userId: formData.get('user_id'),
        name: formData.get('name'),
        githubOwner: formData.get('github_owner'),
        githubRepo: formData.get('github_repo'),
    });

    try {
        await prisma.repository.update({
            where: {
                id,
            },
            data: {
                userId,
                name,
                githubOwner,
                githubRepo
            }
        });
    } catch (error) {
        console.error('Failed to update repository:', error);
        throw new Error('Failed to update repository.');
    } finally {
        await prisma.$disconnect();
        revalidatePath('/dashboard/repositories');
        redirect('/dashboard/repositories');
    }
}

export async function deleteRepository(id: string) {
    try {
        await prisma.repository.delete({
            where: {
                id,
            }
        })
    } catch (error) {
        console.error('Failed to delete repository:', error);
        throw new Error('Failed to delete repository.');
    } finally {
        await prisma.$disconnect();
        revalidatePath('/dashboard/repositories');
        redirect('/dashboard/repositories');
    }
}
