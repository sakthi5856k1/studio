
'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { EventsData, Event } from '@/lib/events';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

export type { Event };

const bookingSchema = z.object({
  id: z.string(),
  slotNumber: z.coerce.number(),
  vtcName: z.string(),
  status: z.enum(['approved', 'pending', 'rejected', 'hold']),
});

const slotAreaSchema = z.object({
  id: z.string(),
  areaName: z.string().min(1, 'Area name is required'),
  imageUrl: z.string().url('Image URL must be a valid URL'),
  startSlot: z.coerce.number().min(1, 'Start slot must be at least 1'),
  endSlot: z.coerce.number().min(1, 'End slot must be at least 1'),
  bookings: z.array(bookingSchema),
}).refine(data => data.endSlot >= data.startSlot, {
    message: "End slot must be greater than or equal to start slot",
    path: ["endSlot"],
});

const timeSchema = z.object({
  hour: z.string().min(1, { message: 'HH' }),
  minute: z.string().min(1, { message: 'MM' }),
  timezone: z.string().min(1, { message: 'Zone' })
});

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  eventDate: z.date({ required_error: "An event date is required." }),
  imageUrl: z.string().url('Must be a valid URL'),
  url: z.string().url('Must be a valid URL'),
  routeMapUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  type: z.enum(['internal', 'partner']),
  departure: z.string().min(1, 'Departure location is required'),
  arrival: z.string().min(1, 'Arrival location is required'),
  server: z.string().min(1, 'Server is required'),
  meetupTime: timeSchema,
  departureTime: timeSchema,
  description: z.string().min(1, 'Description is required'),
  rules: z.string().min(1, 'Rules are required'),
  slots: z.array(slotAreaSchema).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const eventsFilePath = path.join(process.cwd(), 'src', 'lib', 'events.json');
const imagesFilePath = path.join(process.cwd(), 'src', 'lib', 'placeholder-images.json');


async function readJsonFile<T>(filePath: string): Promise<T> {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            if (filePath.includes('events.json')) return { events: [] } as any;
            if (filePath.includes('placeholder-images.json')) return { placeholderImages: [] } as any;
        }
        throw error;
    }
}

async function writeJsonFile(filePath: string, data: any): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export type EventWithImageUrl = Event & { imageUrl: string };

export async function getEvent(id: string): Promise<EventWithImageUrl | undefined> {
    const eventsData = await readJsonFile<EventsData>(eventsFilePath);
    const event = eventsData.events.find((e) => e.id === id);

    if (!event) return undefined;
    
    const imagesData = await readJsonFile<{ placeholderImages: ImagePlaceholder[] }>(imagesFilePath);
    const image = imagesData.placeholderImages.find(img => img.id === event.imageId);
    
    return {
        ...event,
        imageUrl: image?.imageUrl || '',
    };
}

const formatDateTime = (date: Date, time: z.infer<typeof timeSchema>): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year} | ${time.hour}:${time.minute} ${time.timezone}`;
};

export async function updateEvent(id: string, values: FormValues) {
  const validation = formSchema.safeParse(values);
  if (!validation.success) {
    console.error(validation.error.flatten().fieldErrors)
    return { success: false, message: 'Invalid data provided.' };
  }

  try {
    const eventsData = await readJsonFile<EventsData>(eventsFilePath);
    const imagesData = await readJsonFile<{ placeholderImages: ImagePlaceholder[] }>(imagesFilePath);
    
    const eventIndex = eventsData.events.findIndex((e) => e.id === id);
    if (eventIndex === -1) {
        return { success: false, message: 'Event not found.' };
    }

    const { eventDate, meetupTime, departureTime, imageUrl, ...restOfData } = validation.data;

    eventsData.events[eventIndex] = {
        ...eventsData.events[eventIndex],
        ...restOfData,
        date: formatDateTime(eventDate, meetupTime),
        meetupTime: formatDateTime(eventDate, meetupTime),
        departureTime: formatDateTime(eventDate, departureTime),
        slots: validation.data.slots || [],
    };
    
    const imageIndex = imagesData.placeholderImages.findIndex(img => img.id === eventsData.events[eventIndex].imageId);
    if (imageIndex !== -1) {
        imagesData.placeholderImages[imageIndex].imageUrl = imageUrl;
        imagesData.placeholderImages[imageIndex].description = `Image for ${validation.data.title}`;
    }

    await writeJsonFile(eventsFilePath, eventsData);
    await writeJsonFile(imagesFilePath, imagesData);

    revalidatePath('/admin/events');
    revalidatePath(`/admin/events/edit/${id}`);
    revalidatePath('/events');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating event:', error);
    return { success: false, message: 'Failed to write to data file.' };
  }
}
