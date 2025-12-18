
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// --- STORY GENERATOR ---
const StorySchema = z.object({
  title: z.string(),
  content: z.string(),
  question: z.string(),
  answer: z.string(),
  emojiIcon: z.string()
});

export async function generateJuniorStory(topic: string) {
  try {
    const prompt = `
      You are a kindergarten teacher. Write a short, educational story (max 4 sentences) for a 5-year-old about: ${topic}.
      Rules:
      1. Use simple words.
      2. Include emojis.
      3. Return JSON: { title, content, question, answer, emojiIcon }
      4. 'emojiIcon' should be a single emoji representing the story (e.g., 🦖).
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      output: {
        schema: StorySchema
      }
    });

    if (!output) {
      throw new Error("AI did not return a valid story object.");
    }
    
    return { success: true, data: output };
  } catch (error) {
    console.error("Story Generation Error:", error);
    return { success: false, error: "The story robot is sleeping." };
  }
}

// --- SCIENCE FACT GENERATOR ---
const ScienceFactSchema = z.object({
  title: z.string(),
  fact: z.string(),
  emojiIcon: z.string()
});

export async function generateJuniorScience(topic: string) {
  try {
    const prompt = `
      Explain "${topic}" to a 4-year-old.
      Rules:
      1. Keep it under 20 words.
      2. Make it sound magical.
      3. Return JSON: { title, fact, emojiIcon }
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      output: {
        schema: ScienceFactSchema
      }
    });

    if (!output) {
      throw new Error("AI did not return a valid science fact object.");
    }

    return { success: true, data: output };
  } catch (error) {
    console.error("Science Generation Error:", error);
    return { success: false, error: "Science lab is closed." };
  }
}
