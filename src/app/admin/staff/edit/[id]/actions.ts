
'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { StaffData, StaffMember } from '@/lib/staff-members';

export type { StaffMember };

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
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

export async function getStaffMember(id: string): Promise<StaffMember | undefined> {
    const staffData = await readJsonFile<StaffData>(staffFilePath);
    const member = staffData.staffMembers.find((m) => m.id === id);
    return member;
}

export async function updateStaffMember(id: string, values: FormValues) {
  const validation = formSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, message: 'Invalid data provided.' };
  }

  try {
    const staffData = await readJsonFile<StaffData>(staffFilePath);
    
    const memberIndex = staffData.staffMembers.findIndex((m) => m.id === id);
    if (memberIndex === -1) {
        return { success: false, message: 'Staff member not found.' };
    }

    staffData.staffMembers[memberIndex] = {
        ...staffData.staffMembers[memberIndex],
        name: validation.data.name,
        role: validation.data.role,
    };

    await writeJsonFile(staffFilePath, staffData);

    revalidatePath('/admin/staff');
    revalidatePath(`/admin/staff/edit/${id}`);
    revalidatePath('/staff');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating staff member:', error);
    return { success: false, message: 'Failed to write to data file.' };
  }
}
