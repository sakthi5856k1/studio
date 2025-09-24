
'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { GalleryData } from '@/lib/gallery-images';

const galleryFilePath = path.join(process.cwd(), 'src', 'lib', 'gallery-images.json');

async function readJsonFile<T>(filePath: string): Promise<T> {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { galleryImages: [] } as any;
        }
        throw error;
    }
}

async function writeJsonFile(filePath: string, data: any): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function deleteGalleryImage(imageId: string) {
    try {
        const galleryData = await readJsonFile<GalleryData>(galleryFilePath);

        const imageExists = galleryData.galleryImages.some(image => image.id === imageId);
        if (!imageExists) {
            return { success: false, message: 'Image not found.' };
        }

        galleryData.galleryImages = galleryData.galleryImages.filter(image => image.id !== imageId);

        await writeJsonFile(galleryFilePath, galleryData);

        revalidatePath('/admin/gallery');
        revalidatePath('/gallery'); 

        return { success: true, message: 'Image deleted successfully.' };
    } catch (error) {
        console.error('Error deleting gallery image:', error);
        return { success: false, message: 'Failed to delete image.' };
    }
}
