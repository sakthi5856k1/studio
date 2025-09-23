
'use server';

import { NextRequest, NextResponse } from 'next/server';
import {
  InteractionType,
  InteractionResponseType,
  MessageFlags,
  ButtonStyle,
  APIInteraction,
  APIInteractionResponse,
  APIEmbed,
} from 'discord-api-types/v10';
import { verify } from 'tweetnacl';

function respond(response: APIInteractionResponse) {
  return new NextResponse(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' },
  });
}

function respondEphimerally(content: string) {
    return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content,
            flags: MessageFlags.Ephemeral,
        },
    });
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-signature-ed25519');
  const timestamp = req.headers.get('x-signature-timestamp');
  const rawBody = await req.text();

  if (!signature || !timestamp) {
    return new NextResponse('Missing signature headers', { status: 401 });
  }

  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  if (!publicKey) {
    console.error('DISCORD_PUBLIC_KEY is not set');
    return new NextResponse('Server configuration error', { status: 500 });
  }

  const isVerified = verify(
    Buffer.from(timestamp + rawBody),
    Buffer.from(signature, 'hex'),
    Buffer.from(publicKey, 'hex')
  );

  if (!isVerified) {
    return new NextResponse('Invalid signature', { status: 401 });
  }

  const interaction = JSON.parse(rawBody) as APIInteraction;

  if (interaction.type === InteractionType.Ping) {
    return respond({ type: InteractionResponseType.Pong });
  }

  if (interaction.type === InteractionType.MessageComponent) {
    if (!interaction.member) {
        return respondEphimerally("Could not identify the user clicking the button.");
    }
    
    const customId = interaction.data.custom_id;
    const [action, applicationId] = customId.split('_');
    const staffMember = interaction.member.user;

    const originalMessage = interaction.message;
    const originalEmbed = originalMessage.embeds[0];

    let statusText = '';
    let color = originalEmbed.color;
    let dmMessage = '';

    switch (action) {
      case 'accept':
        statusText = `Accepted by ${staffMember.username}`;
        color = 5763719; // Green
        dmMessage = `🎉 Congratulations! Your application (\`${applicationId}\`) to Tamil Pasanga VTC has been **Accepted**! Welcome to the team!`;
        break;
      case 'reject':
        statusText = `Rejected by ${staffMember.username}`;
        color = 15548997; // Red
        dmMessage = `😔 We regret to inform you that your application (\`${applicationId}\`) to Tamil Pasanga VTC has been **Rejected**. Thank you for your interest.`;
        break;
      case 'interview':
        statusText = `Interview scheduled by ${staffMember.username}`;
        color = 3447003; // Blue
        dmMessage = `👍 Your application (\`${applicationId}\`) has passed the initial screening! Please join our Discord server and contact a staff member to schedule your interview.`;
        break;
      default:
        return respondEphimerally('Unknown action.');
    }
    
    // TODO: Find the applicant's Discord user ID to send a DM.
    // This currently requires you to manually find the user based on the application details.
    // A future improvement could be storing the user's Discord ID during application.

    // For now, we just update the original message.
    const updatedEmbed: APIEmbed = {
        ...originalEmbed,
        color,
        fields: [
            ...(originalEmbed.fields || []),
            { name: 'Status', value: statusText, inline: false }
        ]
    };

    return respond({
        type: InteractionResponseType.UpdateMessage,
        data: {
            embeds: [updatedEmbed],
            // Disable buttons after action
            components: [
              {
                type: 1, // Action Row
                components: [
                  { type: 2, style: ButtonStyle.Success, label: 'Accept', custom_id: 'accept_disabled', disabled: true },
                  { type: 2, style: ButtonStyle.Danger, label: 'Reject', custom_id: 'reject_disabled', disabled: true },
                  { type: 2, style: ButtonStyle.Primary, label: 'Accept for Interview', custom_id: 'interview_disabled', disabled: true },
                ]
              }
            ]
        },
    });
  }

  return respondEphimerally('Interaction type not supported.');
}
