import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that transforms text into Twitter/X-style messages. Make the text more casual, engaging, and suitable for social media while maintaining the core message. Generate 3 different variations. Each variation should be concise, use appropriate hashtags, and capture Twitter's conversational tone."
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.7,
    });

    const variations = completion.choices.map(choice => choice.message.content);

    return NextResponse.json({ variations });
  } catch (error) {
    console.error('Error transforming text:', error);
    return NextResponse.json(
      { error: 'Failed to transform text' },
      { status: 500 }
    );
  }
} 