
import { NextResponse } from 'next/server';

export async function GET() {
    // This could fetch a dynamic voice chat link from a database or API
    const voiceChatUrl = 'https://discord.com/invite/paRCYhJphH';
    return NextResponse.redirect(voiceChatUrl);
}
