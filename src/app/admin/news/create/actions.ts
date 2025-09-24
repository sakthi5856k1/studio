'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { NewsData } from '@/lib/news-articles';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  description: z.string().min(1, 'Description is required'),
});

type FormValues = z.infer<typeof formSchema>;

const newsFilePath = path.join(process.cwd(), 'src', 'lib', 'news-articles.json');
const imagesFilePath = path.join(process.cwd(), 'src', 'lib', 'placeholder-images.json');

async function readJsonFile<T>(filePath: string): Promise<T> {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
}

async function writeJsonFile(filePath: string, data: any): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function createNewsArticle(values: FormValues) {
  const validation = formSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, message: 'Invalid data provided.' };
  }

  try {
    const newsData = await readJsonFile<NewsData>(newsFilePath);
    const imagesData = await readJsonFile<{ placeholderImages: ImagePlaceholder[] }>(imagesFilePath);

    const articleId = `newsletter-${Date.now()}`;

    const newImage: ImagePlaceholder = {
        id: articleId,
        description: `Image for ${validation.data.title}`,
        imageUrl: validation.data.imageUrl,
        imageHint: "custom article",
    };
    imagesData.placeholderImages.unshift(newImage);
    
    const newArticle = {
      id: articleId,
      title: validation.data.title,
      description: validation.data.description,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      author: validation.data.author,
      imageId: articleId,
    };
    newsData.newsletters.unshift(newArticle);

    await writeJsonFile(newsFilePath, newsData);
    await writeJsonFile(imagesFilePath, imagesData);
    
    revalidatePath('/admin/news');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error creating news article:', error);
    return { success: false, message: 'Failed to write to data files.' };
  }
}
