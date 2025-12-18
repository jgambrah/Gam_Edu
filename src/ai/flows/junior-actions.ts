
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const StorySchema = z.object({
  title: z.string().describe("A short, catchy title for the story."),
  content: z.string().describe("The story content, max 4 sentences, with an emoji at the start of each sentence."),
  question: z.string().describe("A simple comprehension question about the story."),
  answer: z.string().describe("The answer to the comprehension question.")
});

export async function generateJuniorStory(topic: string) {
  try {
    const prompt = `
      You are a kindergarten teacher. Write a very short, engaging story (max 4 sentences) for a 5-year-old child about: ${topic}.
      
      Rules:
      1. Use simple words.
      2. Include an emoji at the start of every sentence.
      3. Make it funny or cute.
      4. Return JSON with title, content, question, and answer.
      (The question checks if they listened, e.g., "What color was the cat?")
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      output: {
        schema: StorySchema,
      }
    });
    
    if (!output) {
        throw new Error("AI did not return a valid story.");
    }

    return { success: true, data: output };
  } catch (error: any) {
    console.error("Story Generation Error:", error);
    return { success: false, error: "Oops! The story robot is sleeping." };
  }
}
