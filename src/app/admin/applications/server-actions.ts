
'use server';

import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import type { ApplicationStatus, ApplicationsData, Application } from '@/lib/applications';
import type { StaffData, StaffMember } from '@/lib/staff-members';
import {
  APIEmbed,
  APIInteraction,
  InteractionResponseType,
  MessageFlags,
  ButtonStyle,
  InteractionType,
  APIApplicationCommandInteraction,
  APIMessageComponentInteraction,
  APIInteractionResponse,
} from 'discord-api-types/v10';
import { verify } from 'tweetnacl';

const applicationsFilePath = path.join(process.cwd(), 'src', 'lib', 'applications.json');
const staffFilePath = path.join(process.cwd(), 'src', 'lib', 'staff-members.json');

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
        }
        throw error;
    }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
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
                    truckersmpUrl: "", // This is not in the application form
                };
                staffData.staffMembers.push(newMember);
                await writeJsonFile(staffFilePath, staffData);
            }
        }

        revalidatePath('/admin/applications');
        revalidatePath('/staff');

        return { success: true, message: 'Application status updated successfully.' };
    } catch (error) {
        console.error('Error updating application status:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}
