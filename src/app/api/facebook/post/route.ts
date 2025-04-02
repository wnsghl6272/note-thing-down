import { NextResponse } from 'next/server';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { notes, userId } = await request.json();

    // Retrieve the access token from Supabase
    const { data, error } = await supabase
      .from('facebook_tokens')
      .select('access_token')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Access token not found' }, { status: 404 });
    }

    const { access_token } = data;

    // Post each note to Facebook
    for (const note of notes) {
      await axios.post(`https://graph.facebook.com/v18.0/me/feed`, {
        message: note.content,
      }, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error posting to Facebook:', error);
    return NextResponse.json({ error: 'Failed to post to Facebook' }, { status: 500 });
  }
} 