
'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { EventsData, Event, SlotArea } from '@/lib/events';

const bookingSchema = z.object({
  id: z.string(),
  slotNumber: z.coerce.number(),
  vtcName: z.string(),
  status: z.enum(['approved', 'pending', 'rejected']),
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

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  imageId: z.string().min(1, 'Image ID is required'),
  url: z.string().url('Must be a valid URL'),
  type: z.enum(['internal', 'partner'], {
    errorMap: () => ({ message: 'Please select an event type' }),
  }),
  attendees: z.coerce.number().min(0, 'Attendees must be a positive number'),
  vtcs: z.coerce.number().min(0, 'VTCs must be a positive number'),
  departure: z.string().min(1, 'Departure location is required'),
  arrival: z.string().min(1, 'Arrival location is required'),
  server: z.string().min(1, 'Server is required'),
  meetupTime: z.string().min(1, 'Meetup time is required'),
  departureTime: z.string().min(1, 'Departure time is required'),
  description: z.string().min(1, 'Description is required'),
  rules: z.string().min(1, 'Rules are required'),
  slots: z.array(slotAreaSchema).optional(),
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
    console.error(validation.error.flatten().fieldErrors);
    return { success: false, message: 'Invalid data provided.' };
  }

  try {
    const eventsData = await readJsonFile<EventsData>(eventsFilePath);

    const newEvent: Event = {
      id: `event-${Date.now()}`,
      ...validation.data,
      slots: validation.data.slots || [],
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
