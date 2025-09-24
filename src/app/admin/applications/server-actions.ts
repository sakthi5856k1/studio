
'use server';

import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import type { ApplicationStatus, ApplicationsData } from '@/lib/applications';

const applicationsFilePath = path.join(process.cwd(), 'src', 'lib', 'applications.json');

async function readApplications(): Promise<ApplicationsData> {
    try {
        const data = await fs.readFile(applicationsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { applications: [] };
        }
        throw error;
    }
}

async function writeApplications(data: ApplicationsData): Promise<void> {
    await fs.writeFile(applicationsFilePath, JSON.stringify(data, null, 2));
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
) {
  try {
    const applicationsData = await readApplications();
    const appIndex = applicationsData.applications.findIndex(
      (app) => app.id === applicationId
    );

    if (appIndex === -1) {
      return { success: false, message: 'Application not found.' };
    }

    applicationsData.applications[appIndex].status = status;

    await writeApplications(applicationsData);

    revalidatePath('/admin/applications');
    revalidatePath('/application-status');

    return { success: true };
  } catch (error) {
    console.error('Error updating application status:', error);
    return { success: false, message: 'Failed to update application status.' };
  }
}
