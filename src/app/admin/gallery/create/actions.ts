
'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { GalleryData, GalleryImage } from '@/lib/gallery-images';

const formSchema = z.object({
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

export async function createGalleryImage(values: FormValues) {
  const validation = formSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, message: 'Invalid data provided.' };
  }

  try {
    const galleryData = await readJsonFile<GalleryData>(galleryFilePath);

    const newImage: GalleryImage = {
      id: `gallery-${Date.now()}`,
      imageUrl: validation.data.imageUrl,
    };
    
    galleryData.galleryImages.unshift(newImage);

    await writeJsonFile(galleryFilePath, galleryData);
    
    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    
    return { success: true };
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return { success: false, message: 'Failed to write to data file.' };
  }
}
