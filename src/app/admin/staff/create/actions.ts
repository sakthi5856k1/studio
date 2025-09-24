
'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { StaffData, StaffMember } from '@/lib/staff-members';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  steamUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  truckersmpUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

const staffFilePath = path.join(process.cwd(), 'src', 'lib', 'staff-members.json');

async function readJsonFile<T>(filePath: string): Promise<T> {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { staffMembers: [] } as any;
        }
        throw error;
    }
}

async function writeJsonFile(filePath: string, data: any): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function createStaffMember(values: FormValues) {
  const validation = formSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, message: 'Invalid data provided.' };
  }

  try {
    const staffData = await readJsonFile<StaffData>(staffFilePath);

    const newMember: StaffMember = {
      id: `staff-${Date.now()}`,
      name: validation.data.name,
      role: validation.data.role,
      imageId: 'testimonial-avatar', // Default image
      imageUrl: validation.data.imageUrl,
      steamUrl: validation.data.steamUrl,
      truckersmpUrl: validation.data.truckersmpUrl,
    };
    
    staffData.staffMembers.push(newMember);

    await writeJsonFile(staffFilePath, staffData);
    
    revalidatePath('/admin/staff');
    revalidatePath('/staff');
    
    return { success: true };
  } catch (error) {
    console.error('Error creating staff member:', error);
    return { success: false, message: 'Failed to write to data file.' };
  }
}
