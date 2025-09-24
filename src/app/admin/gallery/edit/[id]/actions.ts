
'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { GalleryData, GalleryImage } from '@/lib/gallery-images';

export type { GalleryImage };

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url('Must be a valid URL'),
});

type FormValues = z.infer<typeof formSchema>;

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

export async function getGalleryImage(id: string): Promise<GalleryImage | undefined> {
    const galleryData = await readJsonFile<GalleryData>(galleryFilePath);
    const image = galleryData.galleryImages.find((img) => img.id === id);
    return image;
}

export async function updateGalleryImage(id: string, values: FormValues) {
  const validation = formSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, message: 'Invalid data provided.' };
  }

  try {
    const galleryData = await readJsonFile<GalleryData>(galleryFilePath);
    
    const imageIndex = galleryData.galleryImages.findIndex((img) => img.id === id);
    if (imageIndex === -1) {
        return { success: false, message: 'Image not found.' };
    }

    galleryData.galleryImages[imageIndex] = {
        ...galleryData.galleryImages[imageIndex],
        title: validation.data.title,
        description: validation.data.description,
        imageUrl: validation.data.imageUrl,
    };

    await writeJsonFile(galleryFilePath, galleryData);

    revalidatePath('/admin/gallery');
    revalidatePath(`/admin/gallery/edit/${id}`);
    revalidatePath('/gallery');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return { success: false, message: 'Failed to write to data file.' };
  }
}
