import { z } from 'zod';

const applicationSchemaBase = z.object({
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
});

const refinedApplicationSchema = applicationSchemaBase.superRefine((data, ctx) => {
    if (data.howYouFound === 'friends' && (!data.friendsMention || data.friendsMention.trim().length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please mention your friend(s)',
            path: ['friendsMention'],
        });
    }
    if (data.howYouFound === 'others' && (!data.othersMention || data.othersMention.trim().length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please specify how you found us',
            path: ['othersMention'],
        });
    }
});

export const applicationSchema = refinedApplicationSchema;

export type ApplicationData = z.infer<typeof applicationSchema>;
