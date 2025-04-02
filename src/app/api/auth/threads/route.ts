import { NextResponse } from 'next/server';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const userId = searchParams.get('user_id');

  if (!code || !userId) {
    // Redirect to Threads OAuth URL
    const threadsAuthUrl = `https://threads.net/oauth/authorize?client_id=${process.env.THREADS_CLIENT_ID}&redirect_uri=${process.env.THREADS_REDIRECT_URI}&response_type=code&scope=threads_basic,threads_content_publish&state=${userId}`;
    return NextResponse.redirect(threadsAuthUrl);
  }

  try {
    // Exchange authorization code for access token
    const response = await axios.post('https://threads.net/oauth/token', {
      client_id: process.env.THREADS_CLIENT_ID,
      client_secret: process.env.THREADS_CLIENT_SECRET,
      code,
      redirect_uri: process.env.THREADS_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token, expires_in } = response.data;
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    // Store the access token in Supabase
    const { error } = await supabase
      .from('threads_tokens')
      .upsert({
        user_id: userId,
        access_token,
        expires_at: expiresAt,
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('Error storing access token:', error);
      return NextResponse.json({ error: 'Failed to store access token' }, { status: 500 });
    }

    return NextResponse.redirect('/notes'); // Redirect back to notes page
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return NextResponse.json({ error: 'Failed to authenticate with Threads' }, { status: 500 });
  }
} 