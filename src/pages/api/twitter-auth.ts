import { NextApiRequest, NextApiResponse } from 'next';
import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID!,
  clientSecret: process.env.TWITTER_CLIENT_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
    'http://localhost:3000/api/twitter-callback',
    { scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'] }
  );

  // Store codeVerifier and state in session or database
  // ...

  res.redirect(url);
} 