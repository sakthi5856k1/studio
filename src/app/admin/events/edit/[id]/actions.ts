
'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { EventsData, Event } from '@/lib/events';

export type { Event };

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  imageId: z.string().min(1, 'Image ID is required'),
  url: z.string().url('Must be a valid URL'),
  type: z.enum(['internal', 'partner']),
  attendees: z.coerce.number().min(0, 'Attendees must be a positive number'),
  vtcs: z.coerce.number().min(0, 'VTCs must be a positive number'),
  departure: z.string().min(1, 'Departure location is required'),
  arrival: z.string().min(1, 'Arrival location is required'),
  server: z.string().min(1, 'Server is required'),
  meetupTime: z.string().min(1, 'Meetup time is required'),
  departureTime: z.string().min(1, 'Departure time is required'),
  description: z.string().min(1, 'Description is required'),
  rules: z.string().min(1, 'Rules are required'),
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

export async function getEvent(id: string): Promise<Event | undefined> {
    const eventsData = await readJsonFile<EventsData>(eventsFilePath);
    const event = eventsData.events.find((e) => e.id === id);
    return event;
}

export async function updateEvent(id: string, values: FormValues) {
  const validation = formSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, message: 'Invalid data provided.' };
  }

  try {
    const eventsData = await readJsonFile<EventsData>(eventsFilePath);
    
    const eventIndex = eventsData.events.findIndex((e) => e.id === id);
    if (eventIndex === -1) {
        return { success: false, message: 'Event not found.' };
    }

    eventsData.events[eventIndex] = {
        ...eventsData.events[eventIndex],
        ...validation.data,
    };

    await writeJsonFile(eventsFilePath, eventsData);

    revalidatePath('/admin/events');
    revalidatePath(`/admin/events/edit/${id}`);
    revalidatePath('/events');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating event:', error);
    return { success: false, message: 'Failed to write to data file.' };
  }
}
