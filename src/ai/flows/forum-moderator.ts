
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// --- SCHEMA 1: SAFETY CHECK ---
const SafetySchema = z.object({
  isSafe: z.boolean(),
  reason: z.string().optional(),
});

export async function validateContentSafety(input: { content: string }) {
  try {
    const prompt = `
      Analyze the following text for a school forum.
      Text: "${input.content}"
      
      Is this content safe, appropriate, and free of bullying/hate speech?
      Return strictly JSON.
    `;

    const { output } = await ai.generate({
      model: 'googleai/gemini-3-flash-preview',
      prompt: prompt,
      output: { schema: SafetySchema },
    });

    if (!output) return { isSafe: true, reason: '' }; // Default to safe if AI fails

    return output;
  } catch (error) {
    console.error("AI Safety Check Error:", error);
    return { isSafe: true, reason: '' }; // Fail open to avoid blocking users
  }
}

// --- SCHEMA 2: MODERATOR COMMENT ---
const ModeratorSchema = z.object({
  comment: z.string(),
});

export async function generateAIModeratorComment(input: { 
  threadTitle: string; 
  threadContent: string; 
  previousReplies: string; 
}) {
  try {
    const prompt = `
      You are an AI Moderator in a school discussion forum. Your goal is to facilitate healthy discussion.
      
      Thread Title: "${input.threadTitle}"
      Original Post: "${input.threadContent}"
      
      Recent Replies:
      ${input.previousReplies}
      
      Task:
      Based on the last reply, generate a short, encouraging, and constructive comment.
      - If the student is correct, praise them.
      - If the discussion is stalling, ask a follow-up question.
      - If there is a disagreement, mediate gently.
      - Keep it under 2 sentences.
      
      Output strictly JSON.
    `;

    const { output } = await ai.generate({
      model: 'googleai/gemini-3-flash-preview',
      prompt: prompt,
      output: { schema: ModeratorSchema },
    });

    if (!output) throw new Error("No comment generated");

    return output;
  } catch (error) {
    console.error("AI Moderator Error:", error);
    throw error;
  }
}
