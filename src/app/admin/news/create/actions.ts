'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
});

type FormValues = z.infer<typeof formSchema>;

const newsFilePath = path.join(process.cwd(), 'src', 'lib', 'news-articles.json');
const placeholderImages = ["newsletter-1", "newsletter-2", "newsletter-3"];

export async function createNewsArticle(values: FormValues) {
  const validation = formSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, message: 'Invalid data provided.' };
  }

  try {
    const fileContent = await fs.readFile(newsFilePath, 'utf-8');
    const data = JSON.parse(fileContent);

    const newArticle = {
      id: `newsletter-${Date.now()}`,
      title: validation.data.title,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      author: validation.data.author,
      imageId: placeholderImages[Math.floor(Math.random() * placeholderImages.length)],
    };

    data.newsletters.unshift(newArticle);

    await fs.writeFile(newsFilePath, JSON.stringify(data, null, 2));

    // Revalidate paths to show the new article immediately
    revalidatePath('/admin/news');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error creating news article:', error);
    return { success: false, message: 'Failed to write to news file.' };
  }
}
