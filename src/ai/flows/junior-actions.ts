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


// --- PHONICS CHALLENGE GENERATOR ---
const PhonicsChallengeSchema = z.object({
    word: z.string().describe("The target word (e.g. Splash)"),
    phonetic: z.string().describe("How it sounds (e.g. s-p-l-a-sh)"),
    sentence: z.string().describe("A simple sentence using the word."),
    emoji: z.string().describe("A visual icon")
});

export async function generatePhonicsChallenge(level: 'easy' | 'medium' | 'hard') {
  try {
    const prompt = `
      Generate a Phonics/Pronunciation challenge for a child (Level: ${level}).
      Return JSON:
      {
        "word": "The target word (e.g. Splash)",
        "phonetic": "How it sounds (e.g. s-p-l-a-sh)",
        "sentence": "A simple sentence using the word.",
        "emoji": "A visual icon"
      }
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      output: {
        schema: PhonicsChallengeSchema
      }
    });

    if (!output) {
        throw new Error("AI did not return a valid phonics challenge object.");
    }

    return { success: true, data: output };
  } catch (error: any) {
    console.error("Phonics Generation Error:", error);
    return { success: false, error: "Phonics engine offline." };
  }
}

// --- NEW: GENERATE DATA FOR A SPECIFIC WORD ---
const WordDetailsSchema = z.object({
    word: z.string(),
    phonetic: z.string(),
    sentence: z.string(),
    emoji: z.string()
});

export async function generateWordDetails(word: string) {
  try {
    const prompt = `
      I need phonics data for the word: "${word}".
      Target audience: 5-year-old child.
      
      Return JSON:
      {
        "word": "${word}",
        "phonetic": "Simple phonetic spelling (e.g. 'el-e-fant')",
        "sentence": "A very simple, fun sentence using the word.",
        "emoji": "A single matching emoji"
      }
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      output: {
        schema: WordDetailsSchema,
      }
    });

    if (!output) {
        throw new Error("AI did not return a valid word details object.");
    }

    return { success: true, data: output };
  } catch (error) {
    console.error("Word Details Generation Error:", error);
    return { success: false, error: "Could not analyze word." };
  }
}