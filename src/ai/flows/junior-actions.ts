'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// --- STORY GENERATION ---
const JuniorStorySchema = z.object({
  title: z.string().describe("A fun, simple title for a short children's story."),
  emojiIcon: z.string().emoji().describe("A single emoji that represents the story."),
  content: z.string().describe("The full story text. It should be simple, positive, and easy for a 5-7 year old to understand."),
  questions: z.array(z.object({
    question: z.string().describe("A simple comprehension question about the story."),
    answer: z.string().describe("A short, one or two-word answer to the question.")
  })).length(3).describe("Exactly three simple questions to check understanding.")
});

export async function generateJuniorStory(topic: string, wordCount: number) {
  try {
    const prompt = `
      Generate a very simple, happy, and imaginative story for a 5-7 year old child.
      The story should be about: "${topic}".
      It must be approximately ${wordCount} words long.
      Also generate 3 simple comprehension questions with short, one-word answers.
      Include a single emoji for the story.
      Output strictly JSON.
    `;
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt,
      output: { schema: JuniorStorySchema }
    });
    if (!output) throw new Error("AI did not return data.");
    return { success: true, data: output };
  } catch (error) {
    console.error("AI Story Error:", error);
    return { success: false, error: (error as Error).message };
  }
}

// --- SCIENCE FACT GENERATION ---
const JuniorScienceSchema = z.object({
  title: z.string().describe("The science topic, e.g., 'Volcanoes'."),
  emojiIcon: z.string().emoji().describe("A single relevant emoji."),
  fact: z.string().describe("A single, simple, 'wow' science fact for a 6-year-old."),
  observation: z.string().describe("A one-sentence observation related to the fact. e.g., 'This is why bubbles pop!'"),
  experiment: z.string().describe("A very simple, safe at-home activity. e.g., 'Mix baking soda and vinegar to see bubbles!'"),
});

export async function generateJuniorScience(topic: string) {
  try {
    const prompt = `
      Generate a super simple and fun science 'discovery' for a 6-year-old child about "${topic}".
      Provide a title, an emoji, a simple one-sentence 'wow' fact, a related observation, and a very easy, safe home experiment suggestion.
      Output strictly JSON.
    `;
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt,
      output: { schema: JuniorScienceSchema }
    });
    if (!output) throw new Error("AI did not return data.");
    return { success: true, data: output };
  } catch (error) {
    console.error("AI Science Error:", error);
    return { success: false, error: (error as Error).message };
  }
}

// --- WORD DETAILS GENERATION (for Voice Coach) ---
const WordDetailSchema = z.object({
  word: z.string(),
  phonetic: z.string().describe("A simple phonetic spelling, e.g., /kat/"),
  sentence: z.string().describe("A very simple sentence using the word, for a 5-year-old."),
  emoji: z.string().emoji().describe("A single emoji for the word."),
});

export async function generateWordDetails(word: string) {
  try {
    const prompt = `
      For the word "${word}", provide:
      1. A simple phonetic spelling (e.g., /kat/).
      2. A very simple sentence a 5-year-old would understand.
      3. A single, relevant emoji.
      Output strictly JSON.
    `;
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt,
      output: { schema: WordDetailSchema }
    });
    if (!output) throw new Error("AI did not return data.");
    return { success: true, data: { ...output, word } };
  } catch (error) {
    console.error("AI Word Detail Error:", error);
    return { success: false, error: (error as Error).message };
  }
}

// --- PHONICS CHALLENGE (Not currently used but ready) ---
const PhonicsChallengeSchema = z.object({
  sound: z.string(),
  correctWord: z.string(),
  distractors: z.array(z.string()).length(3),
});

export async function generatePhonicsChallenge() {
    // This can be expanded later
    const sample = { sound: "sh", correctWord: "ship", distractors: ["chip", "sip", "shop"] };
    return { success: true, data: sample };
}