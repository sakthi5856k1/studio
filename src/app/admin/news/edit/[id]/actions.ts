'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { NewsArticle, NewsData } from '@/lib/news-articles';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  description: z.string().min(1, 'Description is required'),
});

type FormValues = z.infer<typeof formSchema>;
export type NewsArticleWithImage = NewsArticle & { imageUrl: string };


const newsFilePath = path.join(process.cwd(), 'src', 'lib', 'news-articles.json');
const imagesFilePath = path.join(process.cwd(), 'src', 'lib', 'placeholder-images.json');


async function readJsonFile<T>(filePath: string): Promise<T> {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
}

async function writeJsonFile(filePath: string, data: any): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function getNewsArticle(id: string): Promise<NewsArticleWithImage | undefined> {
    const newsData = await readJsonFile<NewsData>(newsFilePath);
    const article = newsData.newsletters.find((article) => article.id === id);

    if (!article) return undefined;

    const imagesData = await readJsonFile<{ placeholderImages: ImagePlaceholder[] }>(imagesFilePath);
    const image = imagesData.placeholderImages.find(img => img.id === article.imageId);

    return {
        ...article,
        imageUrl: image?.imageUrl || '',
    };
}

export async function updateNewsArticle(id: string, values: FormValues) {
  const validation = formSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, message: 'Invalid data provided.' };
  }

  try {
    const newsData = await readJsonFile<NewsData>(newsFilePath);
    const imagesData = await readJsonFile<{ placeholderImages: ImagePlaceholder[] }>(imagesFilePath);
    
    const articleIndex = newsData.newsletters.findIndex((article) => article.id === id);
    if (articleIndex === -1) {
        return { success: false, message: 'Article not found.' };
    }

    // Update article details
    newsData.newsletters[articleIndex] = {
        ...newsData.newsletters[articleIndex],
        title: validation.data.title,
        author: validation.data.author,
        description: validation.data.description,
    };

    // Update image details
    const imageIndex = imagesData.placeholderImages.findIndex(img => img.id === newsData.newsletters[articleIndex].imageId);
    if (imageIndex !== -1) {
        imagesData.placeholderImages[imageIndex].imageUrl = validation.data.imageUrl;
        imagesData.placeholderImages[imageIndex].description = `Image for ${validation.data.title}`;
    }

    await writeJsonFile(newsFilePath, newsData);
    await writeJsonFile(imagesFilePath, imagesData);

    revalidatePath('/admin/news');
    revalidatePath('/');
    revalidatePath(`/admin/news/edit/${id}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating news article:', error);
    return { success: false, message: 'Failed to write to data files.' };
  }
}
