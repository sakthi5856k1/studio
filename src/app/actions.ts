
'use server';

import { applicationSchema, type ApplicationData } from '@/lib/schemas';

export type SubmitResult = {
    success: boolean;
    message: string;
    applicationId?: string;
    errors?: Record<string, string[] | undefined>;
}

// In a real application, you would use a database to generate a unique sequential ID.
// For this prototype, we'll generate a random one.
function generateApplicationId() {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    return `TP-${randomNumber}`;
}

export async function submitApplication(data: ApplicationData): Promise<SubmitResult> {
    const validation = applicationSchema.safeParse(data);

    if (!validation.success) {
        return {
            success: false,
            message: 'Invalid form data.',
            errors: validation.error.flatten().fieldErrors,
        };
    }

    const { name, discordTag, email, steamUrl, experience, howYouFound, friendsMention, othersMention } = validation.data;
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const applicationId = generateApplicationId();

    if (!webhookUrl) {
        console.error('DISCORD_WEBHOOK_URL is not set in .env file');
        return { success: false, message: 'Server configuration error.' };
    }

    let howFoundValue = howYouFound;
    if (howYouFound === 'friends' && friendsMention) {
        howFoundValue = `Friends: ${friendsMention}`;
    } else if (howYouFound === 'others' && othersMention) {
        howFoundValue = `Others: ${othersMention}`;
    }


    const embed = {
        title: `New VTC Application - ${applicationId}`,
        color: 3977201, // Medium Sea Green
        fields: [
            { name: 'Name', value: name, inline: true },
            { name: 'Discord Tag', value: discordTag, inline: true },
            { name: 'Email', value: email, inline: true },
            { name: 'Steam Profile', value: steamUrl, inline: false },
            { name: 'Experience', value: experience },
            { name: 'How they found us', value: howFoundValue },
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: 'Tamil Pasanga VTC Application',
        },
    };
    
    const payload = {
        content: `New application from ${name}`,
        embeds: [embed],
        components: [
          {
            type: 1, // Action Row
            components: [
              {
                type: 2, // Button
                style: 3, // Success
                label: 'Accept',
                custom_id: `accept_${applicationId}`,
              },
              {
                type: 2, // Button
                style: 4, // Danger
                label: 'Reject',
                custom_id: `reject_${applicationId}`,
              },
              {
                type: 2, // Button
                style: 1, // Primary
                label: 'Accept for Interview',
                custom_id: `interview_${applicationId}`,
              },
            ],
          },
        ],
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error(`Discord webhook failed with status: ${response.status}`);
            const errorBody = await response.text();
            console.error('Error body:', errorBody);
            return { success: false, message: 'Failed to submit application.' };
        }

        return { success: true, message: 'Application submitted successfully!', applicationId };
    } catch (error) {
        console.error('Error submitting application to Discord:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}
