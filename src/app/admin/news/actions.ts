'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { NewsData } from '@/lib/news-articles';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

const newsFilePath = path.join(process.cwd(), 'src', 'lib', 'news-articles.json');
const imagesFilePath = path.join(process.cwd(), 'src', 'lib', 'placeholder-images.json');

async function readJsonFile<T>(filePath: string): Promise<T> {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            // If the file doesn't exist, return a default structure
            if (filePath.includes('news-articles')) return { newsletters: [] } as any;
            if (filePath.includes('placeholder-images')) return { placeholderImages: [] } as any;
        }
        throw error;
    }
}

async function writeJsonFile(filePath: string, data: any): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function deleteNewsArticle(articleId: string) {
    try {
        const newsData = await readJsonFile<NewsData>(newsFilePath);
        const imagesData = await readJsonFile<{ placeholderImages: ImagePlaceholder[] }>(imagesFilePath);

        const articleToDelete = newsData.newsletters.find(article => article.id === articleId);
        if (!articleToDelete) {
            return { success: false, message: 'Article not found.' };
        }

        // Filter out the article and its corresponding image
        newsData.newsletters = newsData.newsletters.filter(article => article.id !== articleId);
        imagesData.placeholderImages = imagesData.placeholderImages.filter(image => image.id !== articleToDelete.imageId);

        await writeJsonFile(newsFilePath, newsData);
        await writeJsonFile(imagesFilePath, imagesData);

        revalidatePath('/admin/news');
        revalidatePath('/');
        revalidatePath('/news');

        return { success: true, message: 'Article deleted successfully.' };
    } catch (error) {
        console.error('Error deleting news article:', error);
        return { success: false, message: 'Failed to delete article.' };
    }
}
