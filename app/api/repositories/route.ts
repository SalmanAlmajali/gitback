import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { NextRequest } from "next/server";

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const ITEMS_PER_PAGE = 10;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const currentPage = Number(searchParams.get('currentPage')) || 1;
    const session = await auth();

    if (!session) {
        return new Response(JSON.stringify({
            message: 'Unauthorized: No active session found.'
        }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            },
        })
    }

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const whereClause: any = {
            userId: session?.user?.id,
        };

        if (search) {
            whereClause.OR = [
                { user: { name: { contains: search, mode: 'insensitive' } } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
                { name: { contains: search, mode: 'insensitive' } },
                { fullName: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Get paginated repositories
        const repositories = await prisma.userSelectedRepository.findMany({
            where: whereClause,
            orderBy: {
                updatedAt: 'desc',
            },
            take: ITEMS_PER_PAGE,
            skip: offset,
            include: {
                user: {
                    omit: {
                        hashedPassword: true,
                    }
                },
            },
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
    }
}
