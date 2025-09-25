
'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { EventsData, Booking } from '@/lib/events';

const eventsFilePath = path.join(process.cwd(), 'src', 'lib', 'events.json');

const bookingFormSchema = z.object({
  discordId: z.string().min(1, 'Discord ID is required'),
  vtcName: z.string().min(1, 'VTC Name is required'),
  position: z.string().min(1, 'Position is required'),
  estimatedDrivers: z.coerce.number().min(1, 'Estimated drivers must be at least 1'),
  truckersmpUrl: z.string().url('A valid TruckersMP URL is required'),
  slotNumber: z.coerce.number().min(1, 'Please select a slot'),
  eventId: z.string(),
  areaId: z.string(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

async function readEvents(): Promise<EventsData> {
    try {
        const data = await fs.readFile(eventsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { events: [] };
        }
        throw error;
    }
}

async function writeEvents(data: EventsData): Promise<void> {
    await fs.writeFile(eventsFilePath, JSON.stringify(data, null, 2));
}

async function sendBookingWebhook(data: BookingFormValues, eventTitle: string) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
        console.error('DISCORD_WEBHOOK_URL is not set.');
        return;
    }

    const embed = {
        title: 'New Slot Booking Request',
        color: 16776960, // Yellow
        fields: [
            { name: 'Event', value: eventTitle, inline: false },
            { name: 'VTC Name', value: data.vtcName, inline: true },
            { name: 'Slot Requested', value: `#${data.slotNumber}`, inline: true },
            { name: 'Estimated Drivers', value: String(data.estimatedDrivers), inline: true },
            { name: 'Discord ID', value: data.discordId, inline: false },
            { name: 'Position', value: data.position, inline: true },
            { name: 'TruckersMP URL', value: data.truckersmpUrl, inline: false },
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: 'Tamil Pasanga VTC | Slot Booking',
        },
    };

    const payload = {
        content: `New booking request from **${data.vtcName}** for event: **${eventTitle}**.`,
        embeds: [embed],
    };

     try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
             console.error(`Discord webhook failed for booking with status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error sending Discord webhook for booking:', error);
    }
}


export async function submitBooking(values: BookingFormValues) {
    const validation = bookingFormSchema.safeParse(values);
    if (!validation.success) {
        return { success: false, message: 'Invalid data provided.' };
    }

    const { eventId, areaId, slotNumber, vtcName } = validation.data;

    try {
        const eventsData = await readEvents();
        const eventIndex = eventsData.events.findIndex(e => e.id === eventId);

        if (eventIndex === -1) {
            return { success: false, message: 'Event not found.' };
        }

        const event = eventsData.events[eventIndex];
        const areaIndex = event.slots?.findIndex(a => a.id === areaId);

        if (areaIndex === undefined || areaIndex === -1 || !event.slots) {
            return { success: false, message: 'Slot area not found.' };
        }
        
        const area = event.slots[areaIndex];

        // Check if slot is already booked
        const isSlotBooked = area.bookings.some(b => b.slotNumber === slotNumber && b.status === 'approved');
        if (isSlotBooked) {
             return { success: false, message: `Slot #${slotNumber} is already booked.` };
        }
        
        // Check if VTC has already booked a slot in this area
        const hasVTCBooked = area.bookings.some(b => b.vtcName.toLowerCase() === vtcName.toLowerCase());
        if(hasVTCBooked) {
            return { success: false, message: `Your VTC (${vtcName}) has already requested a slot in this area.` };
        }

        const newBooking: Booking = {
            id: `booking-${Date.now()}`,
            slotNumber: slotNumber,
            vtcName: vtcName,
            status: 'pending',
        };

        event.slots[areaIndex].bookings.push(newBooking);

        await writeEvents(eventsData);
        
        // Send webhook notification
        await sendBookingWebhook(validation.data, event.title);
        
        revalidatePath(`/events/${eventId}`);

        return { success: true, message: 'Your slot request has been submitted for review.' };

    } catch (error) {
        console.error('Error submitting booking:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}
