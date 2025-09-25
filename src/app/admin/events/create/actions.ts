
'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { EventsData, Event } from '@/lib/events';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  imageId: z.string().min(1, 'Image ID is required'),
  url: z.string().url('Must be a valid URL'),
  type: z.enum(['internal', 'partner'], {
    errorMap: () => ({ message: 'Please select an event type' }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const eventsFilePath = path.join(process.cwd(), 'src', 'lib', 'events.json');

async function readJsonFile<T>(filePath: string): Promise<T> {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { events: [] } as any;
        }
        throw error;
    }
}

async function writeJsonFile(filePath: string, data: any): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function createEvent(values: FormValues) {
  const validation = formSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, message: 'Invalid data provided.' };
  }

  try {
    const eventsData = await readJsonFile<EventsData>(eventsFilePath);

    const newEvent: Event = {
      id: `event-${Date.now()}`,
      ...validation.data,
    };
    
    eventsData.events.unshift(newEvent);

    await writeJsonFile(eventsFilePath, eventsData);
    
    revalidatePath('/admin/events');
    revalidatePath('/events');
    
    return { success: true };
  } catch (error) {
    console.error('Error creating event:', error);
    return { success: false, message: 'Failed to write to data file.' };
  }
}
