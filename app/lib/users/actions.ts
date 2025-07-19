'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const ITEMS_PER_PAGE = 10;

export async function fetchUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
            },
        });
        
        return users;
    } catch (error) {
        console.error('Failed to fetch users:', error);
        throw new Error('Failed to fetch users from the database.');
    } finally {
        await prisma.$disconnect();
    }
}
