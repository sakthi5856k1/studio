
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

async function sendFollowupMessage(interactionToken: string, content: string) {
  const fetch = (await import('node-fetch')).default;
  const url = `https://discord.com/api/v10/webhooks/${process.env.DISCORD_APPLICATION_ID}/${interactionToken}`;
  
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
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
    let followupMessage = '';

    switch (action) {
      case 'accept':
        statusText = `Accepted by ${staffMember.username}`;
        color = 5763719; // Green
        followupMessage = `✅ **Application Accepted** | \`${applicationId}\` has been accepted by <@${staffMember.id}>.`;
        break;
      case 'reject':
        statusText = `Rejected by ${staffMember.username}`;
        color = 15548997; // Red
        followupMessage = `❌ **Application Rejected** | \`${applicationId}\` has been rejected by <@${staffMember.id}>.`;
        break;
      case 'interview':
        statusText = `Interview scheduled by ${staffMember.username}`;
        color = 3447003; // Blue
        followupMessage = `💬 **Interview Stage** | \`${applicationId}\` has been moved to the interview stage by <@${staffMember.id}>.`;
        break;
      default:
        return respondEphimerally('Unknown action.');
    }
    
    // We must acknowledge the interaction first by updating the message.
    // A follow-up response can be sent after.
    const updatedEmbed: APIEmbed = {
        ...originalEmbed,
        color,
        fields: [
            ...(originalEmbed.fields || []),
            { name: 'Status', value: statusText, inline: false }
        ]
    };

    // Use a Promise to send the followup after responding to the interaction
    if (followupMessage) {
      // We don't await this, because we need to send the initial response quickly.
      sendFollowupMessage(interaction.token, followupMessage).catch(console.error);
    }

    // Respond to the initial interaction to update the message
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
