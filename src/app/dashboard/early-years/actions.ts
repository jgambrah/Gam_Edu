
'use client';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase'; // Use the shared firestore instance

// --- Text-to-Speech Action ---
const TTSInputSchema = z.object({
    text: z.string(),
    voice: z.enum(['Puck', 'Algenib', 'Achernar', 'Enif', 'Kore']),
});

async function toWav(pcmData: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
        const writer = new wav.Writer({ channels: 1, sampleRate: 24000, bitDepth: 16 });
        const chunks: Buffer[] = [];
        writer.on('data', (chunk) => chunks.push(chunk));
        writer.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
        writer.on('error', reject);
        writer.write(pcmData);
        writer.end();
    });
}

export async function generateTTSAction(input: z.infer<typeof TTSInputSchema>) {
    try {
        const { media } = await ai.generate({
            model: 'googleai/gemini-2.5-flash-preview-tts',
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: input.voice } },
                },
            },
            prompt: input.text,
        });

        if (!media || !media.url) throw new Error("No audio returned from TTS.");

        const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
        const wavBase64 = await toWav(audioBuffer);

        return { success: true, data: wavBase64 };

    } catch (error: any) {
        console.error("TTS Generation Error:", error);
        return { success: false, error: error.message || "Failed to generate speech." };
    }
}


// --- Other AI Actions from junior-actions.ts ---

// STORY GENERATOR
const StorySchema = z.object({
  title: z.string(),
  content: z.string().describe("A story for a 5-year-old that is at least 4-5 paragraphs long."),
  questions: z.array(
    z.object({
      question: z.string().describe("A simple comprehension question about the story."),
      answer: z.string().describe("The answer to the question.")
    })
  ).length(3).describe("An array containing exactly 3 question-answer objects."),
  emojiIcon: z.string().describe("A single emoji representing the story (e.g., 🦖).")
});

export async function generateJuniorStory(topic: string, wordCount: number = 100) {
  try {
    const prompt = `You are a kindergarten teacher. Write an educational story for a 5-year-old about: ${topic}.
      RULES:
      1. The story must be engaging and approximately ${wordCount} words long.
      2. Use simple, age-appropriate words.
      3. The output MUST be a JSON object that strictly follows the provided schema.
      4. The 'questions' array must contain exactly 3 comprehension questions about the story.`;
    const { output } = await ai.generate({ prompt, output: { schema: StorySchema } });
    if (!output) throw new Error("AI did not return a valid story object.");
    return { success: true, data: output };
  } catch (error) {
    console.error("Story Generation Error:", error);
    return { success: false, error: "The story robot is sleeping." };
  }
}

// SCIENCE FACT
const ScienceFactSchema = z.object({
  title: z.string(),
  fact: z.string(),
  emojiIcon: z.string()
});

export async function generateJuniorScience(topic: string) {
  try {
    const prompt = `Explain "${topic}" to a 4-year-old.
      Rules:
      1. Keep it under 20 words.
      2. Make it sound magical.
      3. Return JSON: { title, fact, emojiIcon }`;
    const { output } = await ai.generate({ prompt, output: { schema: ScienceFactSchema } });
    if (!output) throw new Error("AI did not return a valid science fact object.");
    return { success: true, data: output };
  } catch (error) {
    console.error("Science Generation Error:", error);
    return { success: false, error: "Science lab is closed." };
  }
}

// PHONICS
const PhonicsChallengeSchema = z.object({
    word: z.string().describe("The target word (e.g. Splash)"),
    phonetic: z.string().describe("How it sounds (e.g. s-p-l-a-sh)"),
    sentence: z.string().describe("A simple sentence using the word."),
    emoji: z.string().describe("A visual icon")
});

export async function generatePhonicsChallenge(level: 'easy' | 'medium' | 'hard') {
  try {
    const prompt = `Generate a Phonics/Pronunciation challenge for a child (Level: ${level}). Return JSON: { "word": "The target word", "phonetic": "How it sounds", "sentence": "A simple sentence using the word.", "emoji": "A visual icon" }`;
    const { output } = await ai.generate({ prompt, output: { schema: PhonicsChallengeSchema } });
    if (!output) throw new Error("AI did not return a valid phonics challenge object.");
    return { success: true, data: output };
  } catch (error: any) {
    console.error("Phonics Generation Error:", error);
    return { success: false, error: "Phonics engine offline." };
  }
}

// WORD DETAILS
const WordDetailsSchema = z.object({
    word: z.string(),
    phonetic: z.string(),
    sentence: z.string(),
    emoji: z.string()
});

export async function generateWordDetails(word: string) {
  try {
    const prompt = `I need phonics data for the word: "${word}". Target audience: 5-year-old child. Return JSON: { "word": "${word}", "phonetic": "Simple phonetic spelling (e.g. 'el-e-fant')", "sentence": "A very simple, fun sentence using the word.", "emoji": "A single matching emoji" }`;
    const { output } = await ai.generate({ prompt, output: { schema: WordDetailsSchema } });
    if (!output) throw new Error("AI did not return a valid word details object.");
    return { success: true, data: output };
  } catch (error) {
    console.error("Word Details Generation Error:", error);
    return { success: false, error: "Could not analyze word." };
  }
}

// IMAGE GENERATION
export const generateLessonImageAction = async (prompt: string): Promise<{ success: boolean; data?: string | null, error?: string }> => {
    try {
      const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt,
      });
      return { success: true, data: media?.url };
    } catch (error: any) {
      console.error("Image generation error:", error);
      return { success: false, error: error.message };
    }
};

// --- NEW PUZZLE ACTION ---
export async function saveNewPuzzle(puzzleData: any) {
  if (!firestore) {
    return { success: false, error: "Firestore is not initialized." };
  }
  try {
    const docRef = await addDoc(collection(firestore, 'junior_puzzles'), {
      ...puzzleData,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding puzzle: ", error);
    return { success: false, error: (error as Error).message };
  }
}


// DUMMY/PLACEHOLDER ACTIONS
export async function generateArtDetailsAction(input: { item: string, type: 'shapes' | 'textures' }): Promise<any> { return { success: true, data: { description: 'Generated description', parts: ['Circle'], prompt: 'Generated prompt' } }; }
export async function generateNumeracyTask(input: { task: string, topic: string }): Promise<any> { return { success: true, data: { question: `What is 1+1?`, answer: 2, options: [1,2,3] } }; }
export async function generateDictionDetails(word: string): Promise<any> { return { success: true, data: { syllables: 'AP-PLE', instruction: 'Say it loud!' } }; }
export async function generateStorytellingScene(topic: string): Promise<any> { return { success: true, data: { title: topic, prompt: `A picture of ${topic}`, questions: [`What is the ${topic}?`] } }; }
export async function generateThemedVocab(theme: string): Promise<any> { return { success: true, data: { name: theme, words: ['one', 'two'], prompt: `A picture of ${theme}` } }; }
export async function generateMissingLetterChallenge(word: string): Promise<any> { return { success: true, data: { word: 'D_G', missing: 'O', options: ['A','E','I','O'], prompt: 'A dog' } }; }
export async function generateSentence(topic: string): Promise<any> { return { success: true, data: { text: `The ${topic} is big.` } }; }
export async function generateRhymingWords(ending: string): Promise<any> { return { success: true, data: { ending, words: [{word: `c${ending}`}, {word: `b${ending}`}] } }; }
export async function generateBlendsExample(blend: string): Promise<any> { return { success: true, data: { blend, words: [{word: `${blend}ip`}]} }; }
export async function evaluateHandwritingAction(input: { imageDataUrl: string, target: string }): Promise<any> { return { success: true, data: { isCorrect: true } }; }
export async function generateRhymeAction(topic: string): Promise<any> { return { success: true, data: `Twinkle, twinkle, little ${topic}` }; }
export async function generateSongVideoAction(prompt: string): Promise<any> { return { success: true, data: null }; }
export async function generateWaterExample(topic: string): Promise<any> { return { success: true, data: { source: 'Cloud', use: 'Makes rain', prompt: 'A fluffy cloud', icon: 'fa-cloud' } }; }
export async function generateFloatSinkExample(topic: string): Promise<any> { return { success: true, data: { name: 'Feather', result: 'Float', prompt: 'A feather on water' } }; }
export async function generateLivingNeedExample(topic: string): Promise<any> { return { success: true, data: { name: 'Child', need: 'Food', before: 'A hungry child', after: 'A happy child' } }; }
export async function generateDietExample(topic: string): Promise<any> { return { success: true, data: { name: 'Broccoli', group: 'Healthy', type: 'Vegetable' } }; }
export async function generateDentistExample(topic: string): Promise<any> { return { success: true, data: { task: 'Flossing', instruction: 'Floss between your teeth' } }; }
export async function generateHealthScenario(topic: string): Promise<any> { return { success: true, data: { state: 'Energized', feeling: 'I want to run!', care: 'Play outside!' } }; }
export async function generateConceptDetails(name: string, type: 'colors' | 'shapes' | 'feelings' | 'sizes'): Promise<any> { return { success: true, data: { prompt: `A prompt for ${name}`, explanation: 'An explanation', meta: '#FF0000' } }; }
