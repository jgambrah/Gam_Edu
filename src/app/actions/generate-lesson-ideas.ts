'use server';

import { generateLessonIdeas } from '@/ai/flows/generate-lesson-ideas-flow';

export async function generateLessonIdeasAction(topic: string) {
  try {
    const result = await generateLessonIdeas({ topic });
    return { success: true, data: result };
  } catch (error) {
    console.error('AI Error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate lesson ideas' 
    };
  }
}
