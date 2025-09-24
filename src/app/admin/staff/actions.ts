
'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { StaffData } from '@/lib/staff-members';

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

export async function deleteStaffMember(memberId: string) {
    try {
        const staffData = await readJsonFile<StaffData>(staffFilePath);

        const memberExists = staffData.staffMembers.some(member => member.id === memberId);
        if (!memberExists) {
            return { success: false, message: 'Staff member not found.' };
        }

        staffData.staffMembers = staffData.staffMembers.filter(member => member.id !== memberId);

        await writeJsonFile(staffFilePath, staffData);

        revalidatePath('/admin/staff');
        revalidatePath('/staff'); 

        return { success: true, message: 'Staff member deleted successfully.' };
    } catch (error) {
        console.error('Error deleting staff member:', error);
        return { success: false, message: 'Failed to delete staff member.' };
    }
}
