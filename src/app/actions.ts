'use server';

import {
  manageDiscordApplication,
  type ManageDiscordApplicationInput,
  type ManageDiscordApplicationOutput,
} from '@/ai/flows/discord-application-management';

export async function handleDiscordApplication(
  input: ManageDiscordApplicationInput
): Promise<ManageDiscordApplicationOutput> {
  try {
    const result = await manageDiscordApplication(input);
    return result;
  } catch (error) {
    console.error('Error in handleDiscordApplication:', error);
    throw new Error('Failed to process application. Please try again.');
  }
}
