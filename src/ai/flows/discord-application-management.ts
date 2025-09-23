'use server';

/**
 * @fileOverview Discord application management flow.
 *
 * - manageDiscordApplication - A function that handles the Discord application process.
 * - ManageDiscordApplicationInput - The input type for the manageDiscordApplication function.
 * - ManageDiscordApplicationOutput - The return type for the manageDiscordApplication function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ManageDiscordApplicationInputSchema = z.object({
  applicationText: z
    .string()
    .describe('The text content of the driver application from Discord.'),
  requirements: z.string().describe('The specific requirements for the driver position.'),
});
export type ManageDiscordApplicationInput = z.infer<typeof ManageDiscordApplicationInputSchema>;

const ManageDiscordApplicationOutputSchema = z.object({
  analysis: z.string().describe('AI analysis of the application in relation to the requirements.'),
  nextSteps: z.string().describe('Recommended next steps for the application process.'),
  engagementMessage: z
    .string()
    .describe('A message to engage with the potential driver in Discord.'),
});
export type ManageDiscordApplicationOutput = z.infer<typeof ManageDiscordApplicationOutputSchema>;

export async function manageDiscordApplication(input: ManageDiscordApplicationInput): Promise<ManageDiscordApplicationOutput> {
  return manageDiscordApplicationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'discordApplicationPrompt',
  input: {schema: ManageDiscordApplicationInputSchema},
  output: {schema: ManageDiscordApplicationOutputSchema},
  prompt: `You are an AI assistant designed to analyze driver applications from Discord, understand the requirements, and automate the application process. Analyze the application based on the following requirements: {{{requirements}}}.\n\nApplication Text: {{{applicationText}}}.\n\nProvide an analysis of the application, suggest the next steps to process the application, and create an engagement message to communicate with the potential driver in Discord.\n\nAnalysis:
Next Steps:
Engagement Message: `,
});

const manageDiscordApplicationFlow = ai.defineFlow(
  {
    name: 'manageDiscordApplicationFlow',
    inputSchema: ManageDiscordApplicationInputSchema,
    outputSchema: ManageDiscordApplicationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
