'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { NewsArticle, NewsData } from '@/lib/news-articles';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
});

type FormValues = z.infer<typeof formSchema>;

const newsFilePath = path.join(process.cwd(), 'src', 'lib', 'news-articles.json');

async function readNewsFile(): Promise<NewsData> {
    const fileContent = await fs.readFile(newsFilePath, 'utf-8');
    return JSON.parse(fileContent);
}

async function writeNewsFile(data: NewsData): Promise<void> {
    await fs.writeFile(newsFilePath, JSON.stringify(data, null, 2));
}

export async function getNewsArticle(id: string): Promise<NewsArticle | undefined> {
    const data = await readNewsFile();
    return data.newsletters.find((article) => article.id === id);
}

export async function updateNewsArticle(id: string, values: FormValues) {
  const validation = formSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, message: 'Invalid data provided.' };
  }

  try {
    const data = await readNewsFile();
    const articleIndex = data.newsletters.findIndex((article) => article.id === id);

    if (articleIndex === -1) {
        return { success: false, message: 'Article not found.' };
    }

    data.newsletters[articleIndex] = {
        ...data.newsletters[articleIndex],
        title: validation.data.title,
        author: validation.data.author,
    };

    await writeNewsFile(data);

    revalidatePath('/admin/news');
    revalidatePath('/');
    revalidatePath(`/admin/news/edit/${id}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating news article:', error);
    return { success: false, message: 'Failed to write to news file.' };
  }
}
