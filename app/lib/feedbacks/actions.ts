'use server';

import { auth } from "@/auth";
import { checkForSession } from "../utils";
import { prisma } from "../prisma";
import { Feedback, FeedbackStatus, FeedbackType } from "@prisma/client";
import { CustomResponse } from "../definitions";
import { revalidatePath } from "next/cache";
import z from "zod";
import { FeedbacksTableRow } from "./definitions";

const ITEMS_PER_PAGE = 10;

const FormSchema = z.object({
    userName: z.string(),
    userEmail: z.string(),
    repositoryId: z.string(),
    title: z.string(),
    content: z.string(),
    type: z.enum(FeedbackType),
    status: z.enum(FeedbackStatus),
});

const type = (formData: FormData) => {
    switch (formData.get('type')) {
        case 'BUG':
            return FeedbackType.BUG;
        case 'FEATURE_REQUEST':
            return FeedbackType.FEATURE_REQUEST;
        default:
            return FeedbackType.OTHER;
    }
};

const status = (formData: FormData) => {
    switch (formData.get('status')) {
        case 'PENDING':
            return FeedbackStatus.PENDING;
        case 'SUBMITTED':
            return FeedbackStatus.SUBMITTED;
        default:
            return FeedbackStatus.REJECTED;
    }
};

export async function getFeedbacks(
    query: string,
    currentPage: number,
): Promise<{
    data?: FeedbacksTableRow[]; totalCount?: number, error?: string
}> {
    const session = await auth();

    checkForSession(session);

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const searchLower = query.toLowerCase();

    try {
        const whereClause: any = {
            repository: {
                userId: session?.user?.id,
            }
        };

        if (query) {
            const enumType = Object.values(FeedbackType).includes(searchLower.toUpperCase() as FeedbackType)
                ? { type: searchLower.toUpperCase() as FeedbackType }
                : null;

            const enumStatus = Object.values(FeedbackStatus).includes(searchLower.toUpperCase() as FeedbackStatus)
                ? { status: searchLower.toUpperCase() as FeedbackStatus }
                : null;

            whereClause.OR = [
                { userName: { contains: searchLower, mode: 'insensitive' } },
                { userEmail: { contains: searchLower, mode: 'insensitive' } },
                { repository: { name: { contains: searchLower, mode: 'insensitive' } } },
                { title: { contains: searchLower, mode: 'insensitive' } },
                ...(enumType ? [enumType] : []),
                ...(enumStatus ? [enumStatus] : []),
            ];
        }

        // Get total count
        const totalCount = await prisma.feedback.count({
            where: whereClause,
        });

        // Get paginated feedbacks
        const feedbacks = await prisma.feedback.findMany({
            where: whereClause,
            orderBy: {
                updatedAt: 'desc',
            },
            take: ITEMS_PER_PAGE,
            skip: offset,
            include: {
                repository: true,
            },
        });

        return { data: feedbacks, totalCount: totalCount };
    } catch (error) {
        console.error('Failed to read user selected feedbacks from DB:', error);
        return { error: 'Failed to retrieve selected feedbacks. Please try again.' };
    }
}

export async function createFeedback(formData: FormData): Promise<CustomResponse> {
    try {
        const feedback = FormSchema.parse({
            userName: formData.get('userName'),
            userEmail: formData.get('userEmail'),
            repositoryId: formData.get('repositoryId'),
            title: formData.get('title'),
            content: formData.get('content'),
            type: type(formData),
            status: status(formData),
        });

        await prisma.feedback.create({
            data: {
                ...feedback,
            },
        });

        revalidatePath('/dashboard/feedbacks');
        return { success: true, message: 'Feedback added successfully!' };
    } catch (error: any) {
        console.error('Failed to create feedback:', error);
        return { error: `Failed to create feedback. ${error.message || 'Please try again.'}` };
    }
}

export async function getFeedbackId(id: string): Promise<CustomResponse<Feedback>> {
    try {
        const feedback = await prisma.feedback.findUnique({
            where: {
                id,
            },
        });

        return { success: true, data: feedback };
    } catch (error: any) {
        console.error('Failed to get selected feedback:', error);
        return { error: `Failed to get feedback. ${error.message || 'Please try again.'}` };
    }
}

export async function updateFeedback(id: string, formData: FormData): Promise<CustomResponse> {
    try {
        const feedback = FormSchema.parse({
            userName: formData.get('userName'),
            userEmail: formData.get('userEmail'),
            repositoryId: formData.get('repositoryId'),
            title: formData.get('title'),
            content: formData.get('content'),
            type: type(formData),
            status: status(formData),
        });

        const existingFeedback = await prisma.feedback.findFirst({
            where: {
                id,
            },
        });

        if (!existingFeedback) {
            return { success: false, message: 'Feedback with this id is not exist.' };
        }

        await prisma.feedback.update({
            where: {
                id,
            },
            data: {
                ...feedback,
            },
        });

        revalidatePath('/dashboard/feedbacks');
        return { success: true, message: 'Feedback updated successfully!' };
    } catch (error: any) {
        console.error('Failed to update selected Feedback:', error);
        return { error: `Failed to update Feedback. ${error.message || 'Please try again.'}` };
    }
}

export async function deleteFeedback(id: string): Promise<CustomResponse> {
    try {
        await prisma.feedback.delete({
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
