import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('threads_tokens')
      .select('access_token, expires_at')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Access token not found' }, { status: 404 });
    }

    const { access_token, expires_at } = data;
    const isExpired = new Date(expires_at) < new Date();

    if (isExpired) {
      return NextResponse.json({ error: 'Access token expired' }, { status: 401 });
    }

    return NextResponse.json({ accessToken: access_token });
  } catch (error) {
    console.error('Error retrieving access token:', error);
    return NextResponse.json({ error: 'Failed to retrieve access token' }, { status: 500 });
  }
} 