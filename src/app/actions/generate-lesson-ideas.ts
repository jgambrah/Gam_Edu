'use server';

import { generateLessonIdeas, GenerateLessonIdeasInput } from '@/ai/flows/generate-lesson-ideas-flow';

/**
 * Server Action to securely call the AI lesson idea generation flow.
 * This acts as a bridge between the client component and the server-side Genkit code.
 * @param topic The topic for which to generate lesson ideas.
 * @returns An object indicating success or failure, with data or an error message.
 */
export async function generateLessonIdeasAction(topic: string) {
  try {
    const result = await generateLessonIdeas({ topic });
    return { success: true, data: result };
  } catch (error) {
    console.error('AI Error in generateLessonIdeasAction:', error);
    // Return a user-friendly error message to the client
    return { success: false, error: 'Failed to generate lesson ideas. Please try again.' };
  }
}
