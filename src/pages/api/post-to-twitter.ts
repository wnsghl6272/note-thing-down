import { NextApiRequest, NextApiResponse } from 'next';
import { TwitterApi } from 'twitter-api-v2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { content } = req.body;

  // Retrieve accessToken from secure storage
  const accessToken = 'stored-access-token';

  const client = new TwitterApi(accessToken);

  try {
    await client.v2.tweet(content);
    res.status(200).json({ message: 'Tweet posted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to post tweet' });
  }
} 