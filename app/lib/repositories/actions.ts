'use server';

import { UserSelectedRepository } from "@prisma/client";
import prisma from "../prisma";
import { getServerSession } from "next-auth";
import { config } from "../auth";

const ITEMS_PER_PAGE = 10;

export async function getUserSelectedRepositories(
    query: string,
    currentPage: number,
): Promise<{
    data?: UserSelectedRepository[]; totalCount?: number, error?: string
}> {
    const session = await getServerSession(config);
    console.log(session);
    
    if (!session?.user?.id) {
        return {
            error: 'Unauthorized: No active session found.'
        };
    }

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const searchLower = query.toLowerCase();

    try {
        const whereClause: any = {
            userId: session.user.id,
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