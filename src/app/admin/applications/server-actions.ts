
'use server';

import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import type { ApplicationStatus, ApplicationsData, Application } from '@/lib/applications';
import type { StaffData, StaffMember } from '@/lib/staff-members';
import type { EventsData, Event, Booking } from '@/lib/events';

const applicationsFilePath = path.join(process.cwd(), 'src', 'lib', 'applications.json');
const staffFilePath = path.join(process.cwd(), 'src', 'lib', 'staff-members.json');
const eventsFilePath = path.join(process.cwd(), 'src', 'lib', 'events.json');

async function readJsonFile<T>(filePath: string): Promise<T> {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            if (filePath.includes('applications.json')) {
                return { applications: [] } as T;
            }
            if (filePath.includes('staff-members.json')) {
                return { staffMembers: [] } as T;
            }
             if (filePath.includes('events.json')) {
                return { events: [] } as T;
            }
        }
        throw error;
    }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function sendApplicationWebhookNotification(application: Application) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
        console.error('DISCORD_WEBHOOK_URL is not set.');
        return;
    }

    let title = '';
    let color = 0;
    let description = '';

    switch (application.status) {
        case 'Accepted':
            title = `Application Accepted: ${application.id}`;
            color = 5763719; // Green
            description = `Congratulations to **${application.name}**! Their application has been accepted.`;
            break;
        case 'Rejected':
            title = `Application Rejected: ${application.id}`;
            color = 15548997; // Red
            description = `Application for **${application.name}** has been rejected.`;
            break;
        case 'Interview':
            title = `Application Moved to Interview: ${application.id}`;
            color = 3447003; // Blue
            description = `**${application.name}** has been moved to the interview stage.`;
            break;
        default:
            return; // Don't send for 'Pending' or other statuses
    }

    const embed = {
        title: title,
        description: description,
        color: color,
        timestamp: new Date().toISOString(),
        fields: [
            { name: 'Applicant Name', value: application.name, inline: true },
            { name: 'Discord Tag', value: application.discordTag, inline: true },
        ],
        footer: {
            text: 'Tamil Pasanga VTC | Application Status Update',
        },
    };

    const payload = { embeds: [embed] };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error(`Discord webhook failed with status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error sending Discord webhook notification:', error);
    }
}


export async function getApplications(): Promise<Application[]> {
    const data = await readJsonFile<ApplicationsData>(applicationsFilePath);
    // Sort by submission date, newest first
    return data.applications.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export async function updateApplicationStatus(
  applicationId: string,
  newStatus: ApplicationStatus,
  role?: string
): Promise<{ success: boolean; message: string }> {
    try {
        const applicationsData = await readJsonFile<ApplicationsData>(applicationsFilePath);
        const staffData = await readJsonFile<StaffData>(staffFilePath);

        const appIndex = applicationsData.applications.findIndex((app) => app.id === applicationId);

        if (appIndex === -1) {
            return { success: false, message: `Application with ID ${applicationId} not found.` };
        }
        
        const application = applicationsData.applications[appIndex];
        
        // Update status in applications.json
        application.status = newStatus;
        await writeJsonFile(applicationsFilePath, applicationsData);

        // If accepted, add to staff-members.json if not already present
        if (newStatus === 'Accepted') {
            const isAlreadyStaff = staffData.staffMembers.some(member => member.name === application.name);
            if (!isAlreadyStaff) {
                const newMember: StaffMember = {
                    id: `staff-${Date.now()}`,
                    name: application.name,
                    role: role || 'Trainee',
                    imageId: 'testimonial-avatar',
                    imageUrl: "https://media.discordapp.net/attachments/1116720480544636999/1274425873201631304/TP_NEW_WB_PNGxxxhdpi.png?ex=68d4d8d5&is=68d38755&hm=b6d4e0e4ef2c3215a4de4fb2f592189a60ddd94c651f96fe04deac2e7f96ddc6&=&format=webp&quality=lossless&width=826&height=826",
                    steamUrl: application.steamUrl,
                    truckersmpUrl: "",
                };
                staffData.staffMembers.push(newMember);
                await writeJsonFile(staffFilePath, staffData);
            }
        }

        revalidatePath('/admin/applications');
        revalidatePath('/staff');
        
        // Send Discord notification
        await sendApplicationWebhookNotification(application);

        return { success: true, message: 'Application status updated successfully.' };
    } catch (error) {
        console.error('Error updating application status:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

// --- Booking Actions ---

export async function getEventsWithBookings(): Promise<Event[]> {
    const data = await readJsonFile<EventsData>(eventsFilePath);
    return data.events.filter(event => event.slots && event.slots.some(slot => slot.bookings && slot.bookings.length > 0));
}

async function sendBookingWebhookNotification(booking: Booking, event: Event, newStatus: 'approved' | 'rejected', areaId: string) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
        console.error('DISCORD_WEBHOOK_URL is not set.');
        return;
    }

    let title = '';
    let color = 0;
    let description = '';
    let imageUrl = '';

    if (newStatus === 'approved') {
        title = `Booking Approved: ${booking.vtcName}`;
        color = 5763719; // Green
        description = `The booking for **${booking.vtcName}** for slot **#${booking.slotNumber}** at event **${event.title}** has been approved.`;
        
        const area = event.slots?.find(a => a.id === areaId);
        if (area) {
            imageUrl = area.imageUrl;
        }

    } else {
        title = `Booking Rejected: ${booking.vtcName}`;
        color = 15548997; // Red
        description = `The booking for **${booking.vtcName}** for slot **#${booking.slotNumber}** at event **${event.title}** has been rejected.`;
    }

    const embed: any = {
        title: title,
        description: description,
        color: color,
        timestamp: new Date().toISOString(),
        footer: { text: 'Tamil Pasanga VTC | Slot Booking Update' },
    };

    if (newStatus === 'approved' && imageUrl) {
        embed.image = { url: imageUrl };
    }

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] }),
        });
    } catch (error) {
        console.error('Error sending booking status webhook:', error);
    }
}


export async function updateBookingStatus(
    eventId: string,
    areaId: string,
    bookingId: string,
    newStatus: 'approved' | 'rejected'
): Promise<{ success: boolean; message: string }> {
    try {
        const eventsData = await readJsonFile<EventsData>(eventsFilePath);
        const event = eventsData.events.find(e => e.id === eventId);
        if (!event || !event.slots) return { success: false, message: 'Event not found.' };

        const area = event.slots.find(a => a.id === areaId);
        if (!area || !area.bookings) return { success: false, message: 'Slot area not found.' };
        
        const booking = area.bookings.find(b => b.id === bookingId);
        if (!booking) return { success: false, message: 'Booking not found.' };

        booking.status = newStatus;
        
        await writeJsonFile(eventsFilePath, eventsData);
        
        await sendBookingWebhookNotification(booking, event, newStatus, areaId);
        
        revalidatePath('/admin/applications');
        revalidatePath(`/events/${eventId}`);
        
        return { success: true, message: `Booking status updated to ${newStatus}.` };

    } catch (error) {
        console.error('Error updating booking status:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}
