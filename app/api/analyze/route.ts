import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { calculateFallbackScore } from '@/lib/scoring';
import { buildUserPrompt, SYSTEM_PROMPT } from '@/lib/prompts';
import { UserInput } from '@/lib/types';

export const maxDuration = 60;


export async function POST(req: NextRequest) {
  try {
    const body: UserInput = await req.json();

    if (!body.jobTitle || !body.dailyTasks || body.dailyTasks.length < 30) {
      return NextResponse.json(
        { error: 'Invalid input. Job title and at least 30 characters of daily tasks are required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NVIDIA_API_KEY;

    if (!apiKey) {
      // Fallback
      console.log('No NVIDIA API key found, using fallback scoring.');
      const result = calculateFallbackScore(body);
      return NextResponse.json(result);
    }

    const openai = new OpenAI({ apiKey, baseURL: 'https://integrate.api.nvidia.com/v1' });
    const userPrompt = buildUserPrompt({
      jobTitle: body.jobTitle,
      company: body.company,
      yearsExperience: body.yearsExperience,
      seniority: body.seniority,
      dailyTasks: body.dailyTasks,
      toolsUsed: body.toolsUsed,
      workStyle: body.workStyle,
      futureRole: body.futureRole,
    });

    try {
      const completion = await openai.chat.completions.create({
        model: 'meta/llama-3.1-70b-instruct',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
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
      console.error('NVIDIA API Error:', apiError);
      // Fallback
      const result = calculateFallbackScore(body);
      return NextResponse.json(result);
    }

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error processing request.' },
      { status: 500 }
    );
  }
}
