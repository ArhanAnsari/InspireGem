import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1-5-pro:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GOOGLE_API_KEY}`
      },
      body: JSON.stringify({
        prompt: { text: prompt },
        temperature: 0.7,
        maxOutputTokens: 2048,
        top_p: 0.9,
        frequencyPenalty: 0.5,
        presencePenalty: 0.5
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error?.message || 'Failed to generate content' }, { status: response.status });
    }

    const data = await response.json();
    
    // Adjust the key according to the actual response structure
    const generatedContent = data.generatedText || data.generatedContent || 'No content generated';

    return NextResponse.json({ generatedContent });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'An error occurred while generating content' }, { status: 500 });
  }
}
