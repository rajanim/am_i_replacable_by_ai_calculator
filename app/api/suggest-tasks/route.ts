import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { SUGGEST_TASKS_PROMPT } from '@/lib/prompts';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.jobTitle) {
      return NextResponse.json(
        { error: 'Job title is required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NVIDIA_API_KEY;

    if (!apiKey) {
      // Fallback
      return NextResponse.json({
        suggestedTasks: [
          'Checking and responding to emails',
          'Attending sync meetings and taking notes',
          'Reviewing documents or data',
          'Writing reports or summaries',
          'Collaborating with team members',
          'Planning and organizing tasks'
        ]
      });
    }

    const openai = new OpenAI({ apiKey, baseURL: 'https://integrate.api.nvidia.com/v1' });
    
    const contextStr = `Job Title: ${body.jobTitle}
Company: ${body.company || 'Not specified'}
Years Experience: ${body.yearsExperience || 'Not specified'}
Seniority: ${body.seniority || 'Not specified'}`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'meta/llama-3.1-8b-instruct', // Faster and cheaper for this simple generation
        messages: [
          { role: 'system', content: SUGGEST_TASKS_PROMPT },
          { role: 'user', content: contextStr }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      let responseContent = completion.choices[0].message.content;
      if (!responseContent) {
        throw new Error('No content returned from NVIDIA API');
      }

      // Strip markdown code block formatting if present
      responseContent = responseContent.replace(/```json/g, '').replace(/```/g, '').trim();

      const parsedResult = JSON.parse(responseContent);
      return NextResponse.json(parsedResult);
      
    } catch (apiError) {
      console.error('NVIDIA API Error in suggest-tasks:', apiError);
      // Fallback
      return NextResponse.json({
        suggestedTasks: [
          'Checking and responding to emails',
          'Attending sync meetings and taking notes',
          'Reviewing documents or data',
          'Writing reports or summaries',
          'Collaborating with team members',
          'Planning and organizing tasks'
        ]
      });
    }

  } catch (error) {
    console.error('API Route Error in suggest-tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error processing request.' },
      { status: 500 }
    );
  }
}
