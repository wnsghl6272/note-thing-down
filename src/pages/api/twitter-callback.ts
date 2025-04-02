import { NextApiRequest, NextApiResponse } from 'next';
import { TwitterApi } from 'twitter-api-v2';
import cookie from 'cookie';

const client = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID!,
  clientSecret: process.env.TWITTER_CLIENT_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { state, code } = req.query;

  try {
    // Retrieve codeVerifier and state from session or database
    // ...

    const { client: loggedClient, accessToken, refreshToken } = await client.loginWithOAuth2({
      code: code as string,
      codeVerifier: 'stored-code-verifier',
      redirectUri: 'http://localhost:3000/api/twitter-callback',
    });

    // Set the access token as an httpOnly cookie
    res.setHeader('Set-Cookie', cookie.serialize('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    }));

    res.redirect('/notes');
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).send('Something went wrong during the authentication process.');
  }
} 