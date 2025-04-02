import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { notes } = await request.json();

    // Assuming you have stored the access token securely
    const accessToken = 'YOUR_ACCESS_TOKEN'; // Replace with actual access token retrieval

    // Post each note to Threads
    for (const note of notes) {
      await axios.post('https://threads.com/api/v1/posts', {
        content: note.content,
        title: note.title,
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error posting to Threads:', error);
    return NextResponse.json({ error: 'Failed to post to Threads' }, { status: 500 });
  }
} 