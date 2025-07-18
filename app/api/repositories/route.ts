import { PrismaClient } from "@/app/generated/prisma";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

const ITEMS_PER_PAGE = 10;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const currentPage = Number(searchParams.get('currentPage')) || 1;
    
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const repositories = await prisma.repository.findMany({
            where: {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { githubOwner: { contains: search, mode: 'insensitive' } },
                    { githubRepo: { contains: search, mode: 'insensitive' } },
                    {
                        user: {
                            name: { contains: search, mode: 'insensitive' },
                        }
                    },
                    {
                        user: {
                            email: { contains: search, mode: 'insensitive' },
                        }
                    }
                ]
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: ITEMS_PER_PAGE, // LIMIT in SQL
            skip: offset,        // OFFSET in SQL
        });

        return new Response(JSON.stringify(repositories), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    } catch (error) {
        console.error('Error fetching repositories:', error);
        return new Response(JSON.stringify({
            message: 'Internal Server Error'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
        })
    } finally {
        await prisma.$disconnect(); // Disconnect Prisma Client after the request
    }
}
