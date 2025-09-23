
'use server';

import { z } from 'zod';

const applicationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    discordTag: z.string().min(1, 'Discord Tag is required'),
    email: z.string().email('Invalid email address'),
    steamUrl: z.string().url('Invalid Steam profile URL. Please enter a full URL.'),
    experience: z.enum(['fresher', 'experienced'], {
        errorMap: () => ({ message: 'Please select your experience level' }),
    }),
    howYouFound: z.enum(['truckersmp', 'friends', 'others'], {
        errorMap: () => ({ message: 'Please select an option' }),
    }),
    friendsMention: z.string().optional(),
    othersMention: z.string().optional(),
    terms: z.literal<boolean>(true, {
        errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
}).refine(data => {
    if (data.howYouFound === 'friends') {
        return !!data.friendsMention && data.friendsMention.trim().length > 0;
    }
    return true;
}, {
    message: 'Please mention your friend(s)',
    path: ['friendsMention'],
}).refine(data => {
    if (data.howYouFound === 'others') {
        return !!data.othersMention && data.othersMention.trim().length > 0;
    }
    return true;
}, {
    message: 'Please specify how you found us',
    path: ['othersMention'],
});


export type ApplicationData = z.infer<typeof applicationSchema>;

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
        content: '',
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


export type StatusResult = {
    applicationId: string;
    status: 'Pending' | 'Accepted' | 'Rejected' | 'Interview' | 'NotFound';
}

// This is a mock function. In a real application, you would query a database.
export async function getApplicationStatus(applicationId: string): Promise<StatusResult> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    const statusId = parseInt(applicationId.slice(-1)) % 4; // Use last digit to get a status

    let status: StatusResult['status'];
    switch (statusId) {
        case 0:
            status = 'Pending';
            break;
        case 1:
            status = 'Accepted';
            break;
        case 2:
            status = 'Rejected';
            break;
        case 3:
            status = 'Interview';
            break;
        default:
            status = 'Pending';
    }

    // Simulate a not found case as well
    if (applicationId.slice(-1) === '9') {
        return { applicationId, status: 'NotFound' };
    }

    return { applicationId, status };
}
