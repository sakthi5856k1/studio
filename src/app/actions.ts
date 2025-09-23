'use server';

import { z } from 'zod';

const applicationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    discordTag: z.string().min(1, 'Discord Tag is required'),
    email: z.string().email('Invalid email address'),
    steamId: z.string().min(1, 'Steam ID is required'),
    experience: z.string().min(1, 'Experience is required'),
    howYouFound: z.string().min(1, 'This field is required'),
    terms: z.literal<boolean>(true, {
        errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
});

export type ApplicationData = z.infer<typeof applicationSchema>;

export async function submitApplication(data: ApplicationData) {
    const validation = applicationSchema.safeParse(data);

    if (!validation.success) {
        return {
            success: false,
            message: 'Invalid form data.',
            errors: validation.error.flatten().fieldErrors,
        };
    }

    const { name, discordTag, email, steamId, experience, howYouFound } = validation.data;
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        console.error('DISCORD_WEBHOOK_URL is not set in .env file');
        return { success: false, message: 'Server configuration error.' };
    }

    const embed = {
        title: 'New VTC Application',
        color: 3977201, // Medium Sea Green
        fields: [
            { name: 'Name', value: name, inline: true },
            { name: 'Discord Tag', value: discordTag, inline: true },
            { name: 'Email', value: email, inline: true },
            { name: 'Steam ID', value: steamId, inline: true },
            { name: 'Experience', value: experience },
            { name: 'How they found us', value: howYouFound },
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: 'Tamil Pasanga VTC Application',
        },
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ embeds: [embed] }),
        });

        if (!response.ok) {
            console.error(`Discord webhook failed with status: ${response.status}`);
            return { success: false, message: 'Failed to submit application.' };
        }

        return { success: true, message: 'Application submitted successfully!' };
    } catch (error) {
        console.error('Error submitting application to Discord:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}
