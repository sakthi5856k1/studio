
'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { EventsData } from '@/lib/events';

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

export async function deleteEvent(eventId: string) {
    try {
        const eventsData = await readJsonFile<EventsData>(eventsFilePath);

        const eventExists = eventsData.events.some(event => event.id === eventId);
        if (!eventExists) {
            return { success: false, message: 'Event not found.' };
        }

        eventsData.events = eventsData.events.filter(event => event.id !== eventId);

        await writeJsonFile(eventsFilePath, eventsData);

        revalidatePath('/admin/events');
        revalidatePath('/events'); 

        return { success: true, message: 'Event deleted successfully.' };
    } catch (error) {
        console.error('Error deleting event:', error);
        return { success: false, message: 'Failed to delete event.' };
    }
}
