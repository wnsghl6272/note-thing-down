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
    // Redirect to Facebook OAuth URL
    const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&response_type=code&scope=public_profile,email,publish_to_groups&state=${userId}`;
    return NextResponse.redirect(facebookAuthUrl);
  }

  try {
    // Exchange authorization code for access token
    const response = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: process.env.FACEBOOK_CLIENT_ID,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        code,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
      },
    });

    const { access_token, expires_in } = response.data;
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    // Store the access token in Supabase
    const { error } = await supabase
      .from('facebook_tokens')
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
    return NextResponse.json({ error: 'Failed to authenticate with Facebook' }, { status: 500 });
  }
} 