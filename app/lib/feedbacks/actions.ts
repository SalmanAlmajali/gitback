'use server';

import { auth } from "@/auth";
import { checkForSession } from "../utils";
import { prisma } from "../prisma";
import { Feedback, FeedbackImage, FeedbackStatus, FeedbackType } from "@prisma/client";
import { CustomResponse } from "../definitions";
import { revalidatePath } from "next/cache";
import z from "zod";
import { FeedbacksTableRow } from "./definitions";
import path from "path";
import { randomUUID } from "crypto";
import fs from 'fs/promises';

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
    data?: FeedbacksTableRow[]; totalCount?: number, success?: boolean, error?: string
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

        return { success: true, data: feedbacks, totalCount: totalCount };
    } catch (error) {
        console.error('Failed to read user selected feedbacks from DB:', error);
        return { success: false, error: 'Failed to retrieve selected feedbacks. Please try again.' };
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

        const result = await prisma.feedback.create({
            data: {
                ...feedback,
            },
        });

        const images = formData.getAll('images') as File[];

        const saveImageResult = await saveImages(images, result.id);

        if (!saveImageResult.success) {
            return saveImageResult;
        }

        revalidatePath('/dashboard/feedbacks');
        return { success: true, message: 'Feedback added successfully!' };
    } catch (error: any) {
        console.error('Failed to create feedback:', error);
        return { success: false, error: `Failed to create feedback. ${error.message || 'Please try again.'}` };
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
        return { success: false, error: `Failed to get feedback. ${error.message || 'Please try again.'}` };
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
        return { success: false, error: `Failed to update Feedback. ${error.message || 'Please try again.'}` };
    }
}

export async function deleteFeedback(id: string): Promise<CustomResponse> {
    try {
        const images = await prisma.feedbackImage.findMany({
            where: { feedbackId: id },
        });

        for (const image of images) {
            const result = await deleteImage(image);
            if (!result.success) {
                return result;
            }
        }

        await prisma.feedback.delete({
            where: {
                id,
            },
        });

        revalidatePath('/dashboard/repositories');
        return { success: true, message: 'Repository deleted successfully!' };
    } catch (error: any) {
        console.error('Failed to delete selected repository:', error);
        return { success: false, error: `Failed to delete repository. ${error.message || 'Please try again.'}` };
    }
}

async function saveImages(images: File[], feedbackId: string): Promise<CustomResponse> {
    try {
        if (images.some(image => !(image instanceof File))) {
            return { success: false, error: 'Invalid files. Please try again.' };
        }

        for (const image of images) {
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(image.type)) {
                return { success: false, error: 'Unsupported image type: ' + image.name };
            }
        }

        const savedImages: { url: string }[] = [];

        for (const image of images) {
            const buffer = Buffer.from(await image.arrayBuffer());
            const ext = path.extname(image.name) || '.jpg';
            const fileName = `${randomUUID()}${ext}`;
            const uploadPath = path.join(process.cwd(), 'public', 'uploads', fileName);

            await fs.writeFile(uploadPath, buffer);

            savedImages.push({
                url: `/uploads/${fileName}`,
            });
        }

        if (savedImages.length > 0) {
            await prisma.feedbackImage.createMany({
                data: savedImages.map(img => ({
                    feedbackId: feedbackId,
                    url: img.url,
                })),
            });
        }

        return { success: true, message: 'Images saved successfully!' };
    } catch (error: any) {
        console.error('Failed to save images:', error);
        return { success: false, error: `Failed to save images. ${error.message || 'Please try again.'}` };
    }
}

export async function deleteImage(feedbackImage: FeedbackImage): Promise<CustomResponse> {
    try {
        const imagePath = path.join('public', feedbackImage.url.replace(/^\/+/, ''));

        try {
            await fs.unlink(imagePath);
        } catch (error: any) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }

        await prisma.feedbackImage.delete({
            where: {
                id: feedbackImage.id,
            },
        });

        return { success: true, message: 'Image deleted successfully!' };
    } catch (error: any) {
        console.error('Failed to delete image:', error);
        return { success: false, error: `Failed to delete image. ${error.message || 'Please try again.'}` };
    }
}

export async function deleteImageByRepository(repositoryId: string): Promise<CustomResponse> {
    try {
        const feedbackImages = await prisma.feedbackImage.findMany({
            where: {
                feedback: {
                    repositoryId: repositoryId,
                },
            },
        });

        for (const image of feedbackImages) {
            try {
                const imagePath = path.join('public', image.url.replace(/^\/+/, ''));
                await fs.unlink(imagePath);
            } catch (error: any) {
                if (error.code !== 'ENOENT') {
                    throw error;
                }
            }
        }

        return { success: true, message: 'Images deleted successfully.' };
    } catch (error: any) {
        console.error('Failed to delete images:', error);
        return { success: false, error: `Failed to delete images. ${error.message || 'Please try again.'}` };
    }
}