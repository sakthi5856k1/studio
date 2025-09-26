
'use server';

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import {
  InteractionType,
  InteractionResponseType,
  MessageFlags,
  ButtonStyle,
  APIInteraction,
  APIInteractionResponse,
  APIEmbed,
  APIApplicationCommandInteraction,
  APIMessageComponentInteraction,
} from 'discord-api-types/v10';
import { verify } from 'tweetnacl';
import type { ApplicationStatus, ApplicationsData } from '@/lib/applications';
import type { StaffData, StaffMember } from '@/lib/staff-members';
import { revalidatePath } from 'next/cache';

const STAFF_ROLE_ID = '1419223859483115591';
const applicationsFilePath = path.join(process.cwd(), 'src', 'lib', 'applications.json');
const staffFilePath = path.join(process.cwd(), 'src', 'lib', 'staff-members.json');


async function readJsonFile<T>(filePath: string): Promise<T> {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            if (filePath.includes('applications')) return { applications: [] } as any;
            if (filePath.includes('staff-members')) return { staffMembers: [] } as any;
        }
        throw error;
    }
}

async function writeJsonFile(filePath: string, data: any): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function updateApplicationAndStaff(
  applicationId: string,
  newStatus: ApplicationStatus,
  role: string = 'Trainee'
) {
  try {
    const applicationsData = await readJsonFile<ApplicationsData>(applicationsFilePath);
    const staffData = await readJsonFile<StaffData>(staffFilePath);
    
    const appIndex = applicationsData.applications.findIndex(app => app.id === applicationId);

    if (appIndex === -1) {
      console.error(`Application with ID ${applicationId} not found.`);
      return;
    }

    const application = applicationsData.applications[appIndex];
    const oldStatus = application.status;

    // Update status
    application.status = newStatus;

    // If accepting, check if they are already a staff member to avoid duplicates
    if (newStatus === 'Accepted' && oldStatus !== 'Accepted') {
      const isAlreadyStaff = staffData.staffMembers.some(member => member.name === application.name);
      
      if (!isAlreadyStaff) {
        const newMember: StaffMember = {
            id: `staff-${Date.now()}`,
            name: application.name,
            role: role,
            imageId: 'testimonial-avatar',
            imageUrl: "https://media.discordapp.net/attachments/1116720480544636999/1274425873201631304/TP_NEW_WB_PNGxxxhdpi.png?ex=68d4d8d5&is=68d38755&hm=b6d4e0e4ef2c3215a4de4fb2f592189a60ddd94c651f96fe04deac2e7f96ddc6&=&format=webp&quality=lossless&width=826&height=826",
            steamUrl: application.steamUrl,
            truckersmpUrl: "",
        };
        staffData.staffMembers.push(newMember);
        await writeJsonFile(staffFilePath, staffData);
      }
    }

    await writeJsonFile(applicationsFilePath, applicationsData);
    
    // Revalidate paths
    revalidatePath('/admin/applications');
    revalidatePath('/application-status');
    revalidatePath('/staff');

  } catch (error) {
    console.error(`Error processing application ${applicationId}:`, error);
  }
}

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

  if (interaction.type === InteractionType.ApplicationCommand) {
    const command = interaction as APIApplicationCommandInteraction;
    const memberRoles = command.member?.roles as string[] | undefined;

    // Role check for all application commands
    if (!memberRoles || !memberRoles.includes(STAFF_ROLE_ID)) {
        return respondEphimerally('You do not have permission to use this command.');
    }
    
    const staffMember = command.member?.user;

    if (!staffMember) {
      return respondEphimerally("Could not identify the user running the command.");
    }

    if (command.data.name === 'hello') {
      return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: 'Hello! I am the Tamil Pasanga VTC bot, here to help.',
        },
      });
    }

    if (command.data.name === 'accept' || command.data.name === 'reject') {
      const applicationId = (command.data.options?.[0] as any)?.value;
      if (!applicationId) {
        return respondEphimerally('You must provide an Application ID.');
      }
      
      const action = command.data.name;
      let followupMessage = '';
      let newStatus: ApplicationStatus = 'Pending';

      if (action === 'accept') {
        newStatus = 'Accepted';
        followupMessage = `✅ **Application Accepted** | \`${applicationId}\` has been manually accepted by <@${staffMember.id}>.`;
      } else {
        newStatus = 'Rejected';
        followupMessage = `❌ **Application Rejected** | \`${applicationId}\` has been manually rejected by <@${staffMember.id}>.`;
      }
      
      // Update the application status in the background
      updateApplicationAndStaff(applicationId, newStatus).catch(console.error);

      // Acknowledge the command immediately
      return respond({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
              content: followupMessage,
          },
      });
    }
  }

  if (interaction.type === InteractionType.MessageComponent) {
    const componentInteraction = interaction as APIMessageComponentInteraction;
    const memberRoles = componentInteraction.member?.roles as string[] | undefined;
    
    // Role check for all message components
    if (!memberRoles || !memberRoles.includes(STAFF_ROLE_ID)) {
        return respondEphimerally('You do not have permission to use this button.');
    }

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
    let newStatus: ApplicationStatus = 'Pending';

    switch (action) {
      case 'accept':
        statusText = `Accepted by ${staffMember.username}`;
        color = 5763719; // Green
        followupMessage = `✅ **Application Accepted** | \`${applicationId}\` has been accepted by <@${staffMember.id}>.`;
        newStatus = 'Accepted';
        break;
      case 'reject':
        statusText = `Rejected by ${staffMember.username}`;
        color = 15548997; // Red
        followupMessage = `❌ **Application Rejected** | \`${applicationId}\` has been rejected by <@${staffMember.id}>.`;
        newStatus = 'Rejected';
        break;
      case 'interview':
        statusText = `Interview scheduled by ${staffMember.username}`;
        color = 3447003; // Blue
        followupMessage = `💬 **Interview Stage** | \`${applicationId}\` has been moved to the interview stage by <@${staffMember.id}>.`;
        newStatus = 'Interview';
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

    // Use a Promise to send the followup and update data after responding to the interaction
    if (followupMessage) {
      // We don't await these, because we need to send the initial response quickly.
      sendFollowupMessage(interaction.token, followupMessage).catch(console.error);
      updateApplicationAndStaff(applicationId, newStatus).catch(console.error);
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
