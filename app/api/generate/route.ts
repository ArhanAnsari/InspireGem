// app/api/generate/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta2/models/gemini-1-5-pro:generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GOOGLE_API_KEY}`
      },
      body: JSON.stringify({
        prompt: { text: prompt },
        temperature: 0.7,          // Controls randomness
        maxOutputTokens: 2048,     // Maximum length of the response
        top_p: 0.9,                // Nucleus sampling parameter
        frequencyPenalty: 0.5,    // Penalty for frequent tokens
        presencePenalty: 0.5,     // Penalty for repeated topics
        safetySettings: {
          safeSearch: true,       // Safe search to filter explicit content
          contentFiltering: true, // Content filtering for appropriateness
          moderation: true        // Content moderation
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error?.message || 'Failed to generate content' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ generatedContent: data.generatedText || 'No content generated' });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'An error occurred while generating content' }, { status: 500 });
  }
}
