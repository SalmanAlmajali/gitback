import { auth } from "@/auth";
import { prisma } from "../prisma";
import { checkForSession, fillMonthGaps } from "../utils";
import { FeedbackStatus } from "@prisma/client";

export async function getCardData() {
    const session = await auth();

    checkForSession(session);

    try {
        const repositories = prisma.userSelectedRepository.count({
            where: {
                userId: session?.user.id
            }
        });

        const feedbacks = prisma.feedback.findMany({
            where: {
                repository: {
                    userId: session?.user.id
                }
            }
        });

        const data = await Promise.all([
            repositories,
            feedbacks,
        ]);


        const pendingFeedback = data[1].filter(item => item.status === FeedbackStatus.PENDING);

        const submittedFeedback = data[1].filter(item => item.status === FeedbackStatus.SUBMITTED);


        return {
            success: true,
            data: {
                'repositories': data[0],
                'feedbacks': data[1].length,
                'pendingFeedback': pendingFeedback.length,
                'submittedFeedback': submittedFeedback.length
            },
        };
    } catch (error) {
        console.error('Failed to retrieve card data:', error);
        return { success: false, error: 'Failed to retrieve card data. Please try again.' };
    }
}

export async function getMonthlyFeedbackTrend() {
    const session = await auth();

    checkForSession(session);

    try {
        const rows: { month: string; count: string }[] = await prisma.$queryRaw`
            SELECT to_char(date_trunc('month', "Feedback"."createdAt"), 'YYYY-MM') AS month,
                COUNT(*)::text AS count
            FROM "Feedback"
            JOIN "user_selected_repositories" ON "user_selected_repositories"."id" = "Feedback"."repositoryId"
            WHERE "user_selected_repositories"."userId" = ${session?.user.id}
            GROUP BY 1
            ORDER BY 1
        `;

        const parsed: { month: string; count: number }[] = rows.map(r => ({
            month: r.month,
            count: Number(r.count),
        }));

        return {
            success: true,
            data: fillMonthGaps(parsed),
        };
    } catch (error) {
        console.error('Failed to retrieve feedback chart data:', error);
        return { success: false, error: 'Failed to retrieve feedback chart data. Please try again.' };
    }
}

export async function getLatestFeedback() {
    const session = await auth();

    checkForSession(session);

    try {
        const latestFeedbacks = await prisma.feedback.findMany({
            where: {
                repository: {
                    userId: session?.user.id
                }
            },
            include: {
                repository: true,
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        });

        return {
            success: true,
            data: latestFeedbacks,
        };
    } catch (error) {
        console.error('Failed to retrieve latest feedbacks data:', error);
        return { success: false, error: 'Failed to retrieve latest feedbacks data. Please try again.' };
    }
}