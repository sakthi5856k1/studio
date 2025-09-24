
'use server';

import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import type { ApplicationStatus, ApplicationsData, Application } from '@/lib/applications';
import type { StaffData, StaffMember } from '@/lib/staff-members';

const applicationsFilePath = path.join(process.cwd(), 'src', 'lib', 'applications.json');
const staffFilePath = path.join(process.cwd(), 'src', 'lib', 'staff-members.json');

async function readJsonFile<T>(filePath: string): Promise<T> {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            if (filePath.includes('applications')) return { applications: [] } as any;
            if (filePath.includes('staff-members')) return { staffMembers: [] } as any;
        }
        throw error;
    }
}

async function writeJsonFile(filePath: string, data: any): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function addStaffMember(application: Application, role: string) {
    const staffData = await readJsonFile<StaffData>(staffFilePath);
    
    const newMember: StaffMember = {
        id: `staff-${Date.now()}`,
        name: application.name,
        role: role,
        imageId: 'testimonial-avatar',
        imageUrl: "https://media.discordapp.net/attachments/1116720480544636999/1274425873201631304/TP_NEW_WB_PNGxxxhdpi.png?ex=68d4d8d5&is=68d38755&hm=b6d4e0e4ef2c3215a4de4fb2f592189a60ddd94c651f96fe04deac2e7f96ddc6&=&format=webp&quality=lossless&width=826&height=826",
        steamUrl: application.steamUrl,
        truckersmpUrl: "", // Not in application form
    };

    staffData.staffMembers.push(newMember);
    await writeJsonFile(staffFilePath, staffData);
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  role: string = 'Trainee'
) {
  try {
    const applicationsData = await readJsonFile<ApplicationsData>(applicationsFilePath);
    const appIndex = applicationsData.applications.findIndex(
      (app) => app.id === applicationId
    );

    if (appIndex === -1) {
      return { success: false, message: 'Application not found.' };
    }

    const application = applicationsData.applications[appIndex];
    const oldStatus = application.status;

    // Prevent re-processing an already accepted application
    if (oldStatus === 'Accepted' && status === 'Accepted') {
      return { success: false, message: 'This application has already been accepted.' };
    }

    application.status = status;

    if (status === 'Accepted') {
        await addStaffMember(application, role);
    }

    await writeJsonFile(applicationsFilePath, applicationsData);

    revalidatePath('/admin/applications');
    revalidatePath('/application-status');
    revalidatePath('/staff');

    return { success: true };
  } catch (error) {
    console.error('Error updating application status:', error);
    return { success: false, message: 'Failed to update application status.' };
  }
}
