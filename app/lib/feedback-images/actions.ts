'use server';

import pLimit from 'p-limit';
import { randomUUID } from 'crypto';
import type { FeedbackImage } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import path from 'path';
import { CustomResponse } from '../definitions';
import { prisma } from '../prisma';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const CONCURRENCY = 3;
const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20MB

function validateTotalSize(files: File[]) {
  let totalSize = 0;
  for (const file of files) {
    if (!(file instanceof File)) {
      return { success: false, error: 'Invalid file upload.' };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: `File "${file.name}" is too large. Max per file is 5MB.` };
    }
    totalSize += file.size;
  }

  if (totalSize > MAX_TOTAL_SIZE) {
    return {
      success: false,
      error: `Total upload size too big. Max combined is ${Math.round(MAX_TOTAL_SIZE / 1024 / 1024)}MB.`,
    };
  }

  return { success: true };
}

async function uploadBufferToCloudinary(buffer: Buffer, originalName: string): Promise<{ url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const ext = path.extname(originalName).replace(/^\./, '') || 'jpg';
    const publicId = `${randomUUID()}`;
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        folder: 'feedback_images',
        resource_type: 'image',
        format: ext === 'jpg' ? 'jpg' : ext,
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Empty upload result'));
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

export async function saveImages(images: File[], feedbackId: string): Promise<CustomResponse> {
  try {
    if (images.length > MAX_FILES + 1) {
      return { success: false, error: `Too many files. Max is ${MAX_FILES}.` };
    }

    const totalCheck = validateTotalSize(images);
    if (!totalCheck.success) {
      return { success: false, error: totalCheck.error! };
    }

    if (images.some(image => !(image instanceof File))) {
      return { success: false, error: 'Invalid files. Please try again.' };
    }

    for (const image of images) {
      if (!ALLOWED_TYPES.includes(image.type)) {
        return { success: false, error: 'Unsupported image type: ' + image.name };
      }
    }

    const limit = pLimit(CONCURRENCY);

    const perImageResults = await Promise.all(
      images.map(image =>
        limit(async () => {
          const arrayBuf = await image.arrayBuffer();
          const buffer = Buffer.from(new Uint8Array(arrayBuf));

          const { url } = await uploadBufferToCloudinary(buffer, image.name);

          return {
            feedbackId,
            url,
          };
        })
      )
    );

    if (perImageResults.length > 0) {
      await prisma.feedbackImage.createMany({
        data: perImageResults,
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
    const publicId = (() => {
      const parts = feedbackImage.url.split('/');
      const last = parts.pop() || '';
      const [filename] = last.split('.');
      return filename;
    })();

    if (publicId) {
      try {
        await cloudinary.uploader.destroy(`feedback_images/${publicId}`, { resource_type: 'image' });
      } catch (e) {
        console.warn('Failed to delete from Cloudinary (ignoring):', e);
      }
    }

    await prisma.feedbackImage.delete({
      where: { id: feedbackImage.id },
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
        feedback: { repositoryId },
      },
    });

    for (const image of feedbackImages) {
      const parts = image.url.split('/');
      const last = parts.pop() || '';
      const [filename] = last.split('.');
      try {
        await cloudinary.uploader.destroy(`feedback_images/${filename}`, { resource_type: 'image' });
      } catch (e) {
        console.warn('Cloudinary delete error:', e);
      }
    }

    return { success: true, message: 'Images deleted successfully.' };
  } catch (error: any) {
    console.error('Failed to delete images:', error);
    return { success: false, error: `Failed to delete images. ${error.message || 'Please try again.'}` };
  }
}
