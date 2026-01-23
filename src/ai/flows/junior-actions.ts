
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';

// --- STORY GENERATOR ---
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

// --- SCIENCE FACT GENERATOR ---
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

// --- PHONICS WORLD ENTRY GENERATOR ---
const PhonicsWorldEntrySchema = z.object({
    title: z.string(),
    sound: z.string(),
    description: z.string(),
    imagePrompt: z.string(),
    icon: z.string(),
});

export async function generatePhonicsWorldEntry(topic: string, category: string) {
    try {
        const prompt = `Create a nursery phonics entry for "${topic}" in category "${category}". 
        Return JSON: { "title": "string", "sound": "string", "description": "string", "imagePrompt": "string", "icon": "string" }`;
        const { output } = await ai.generate({
            model: 'googleai/gemini-1.5-flash',
            prompt,
            output: { schema: PhonicsWorldEntrySchema }
        });
        if (!output) throw new Error("AI did not generate a valid phonics entry.");
        return { success: true, data: output };
    } catch (error: any) {
        console.error("Phonics World AI Error:", error);
        return { success: false, error: (error as Error).message };
    }
}

// --- MATH WORLD ENTRY GENERATOR (NEW) ---
const MathWorldEntrySchema = z.object({
    title: z.string(),
    question: z.string(),
    imageUrl: z.string().url().optional(),
    imagePrompt: z.string(),
    options: z.array(z.string()).length(4),
    correctAnswer: z.string(),
    icon: z.string(),
});

export async function generateMathWorldEntry(topic: string, category: string) {
    try {
        const prompt = `
            Create a nursery math activity for a child.
            The topic is "${topic}" and it should fit within the category "${category}".
            Provide a simple question, 4 options (one must be correct), the correct answer, an emoji icon, and a creative DALL-E style prompt to generate an image for the question.
            Output strictly JSON.
        `;

        const { output } = await ai.generate({
            model: 'googleai/gemini-1.5-flash',
            prompt,
            output: { schema: MathWorldEntrySchema }
        });
        if (!output) throw new Error("AI did not generate a valid math entry.");
        return { success: true, data: output };
    } catch (error: any) {
        console.error("Math World AI Error:", error);
        return { success: false, error: (error as Error).message };
    }
}


// --- SCIENCE WORLD ENTRY GENERATOR ---
const ScienceWorldEntrySchema = z.object({
    name: z.string(),
    fact: z.string(),
    imagePrompt: z.string(),
    icon: z.string(),
});

export async function generateScienceWorldEntry(topic: string, category: string) {
    try {
        const prompt = `
            Create a nursery science discovery entry for a child.
            The topic is "${topic}" and it should fit within the category "${category}".
            Provide a short, amazing fact and a simple emoji icon.
            Also, provide a creative DALL-E style prompt to generate an image for this fact.
            Output strictly JSON.
        `;

        const { output } = await ai.generate({
            model: 'googleai/gemini-1.5-flash',
            prompt,
            output: { schema: ScienceWorldEntrySchema }
        });
        if (!output) throw new Error("AI did not generate a valid science entry.");
        return { success: true, data: output };
    } catch (error: any) {
        console.error("Science World AI Error:", error);
        return { success: false, error: (error as Error).message };
    }
}


// --- TTS HELPER ---
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

// --- TTS ACTION ---
const TTSInputSchema = z.object({
    text: z.string(),
    voice: z.enum(['Puck', 'Algenib', 'Achernar', 'Enif', 'Kore']),
});

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


// --- IMAGE GENERATION ACTION ---
export const generateLessonImageAction = async (prompt: string): Promise<string | null> => {
    try {
      const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt,
      });
  
      if (media && media.url) {
        return media.url;
      }
      return null;
    } catch (error) {
      console.error("Image generation error:", error);
      return null;
    }
};

// --- HANDWRITING ASSESSMENT ACTION ---
export async function assessHandwritingAction(input: { imageDataUri: string; targetCharacter: string }) {
  try {
    const prompt = `
      You are an expert in early childhood education.
      Analyze the attached image. The user was trying to write the letter or digit "${input.targetCharacter}".
      Is this a recognizable attempt? Answer only with the word YES or the word NO.
    `;

    const { text } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: [
        { text: prompt },
        { media: { url: input.imageDataUri } },
      ],
      config: { temperature: 0.1 }
    });

    const isYes = text.toUpperCase().includes('YES');
    return { success: true, isCorrect: isYes };

  } catch (error: any) {
    console.error("AI Handwriting Assessment Error:", error);
    return { success: false, error: "The AI teacher is busy right now." };
  }
}

// --- Dummy Server Actions (replace with actual AI flows) ---
export async function generateArtDetailsAction(input: { item: string, type: 'shapes' | 'textures' }): Promise<any> {
    // This is a placeholder. Implement the actual Genkit flow here.
    return { success: true, data: { description: 'Generated description', parts: ['Circle'], prompt: 'Generated prompt' } };
}

export async function generateNumeracyTask(input: { task: string, topic: string }): Promise<any> {
    return { success: true, data: { question: `What is 1+1?`, answer: 2, options: [1,2,3] } };
}

export async function generateDictionDetails(word: string): Promise<any> {
    return { success: true, data: { syllables: 'AP-PLE', instruction: 'Say it loud!' } };
}

export async function generateStorytellingScene(topic: string): Promise<any> {
    return { success: true, data: { title: topic, prompt: `A picture of ${topic}`, questions: [`What is the ${topic}?`] } };
}

export async function generateThemedVocab(theme: string): Promise<any> {
    return { success: true, data: { name: theme, words: ['one', 'two'], prompt: `A picture of ${theme}` } };
}

export async function generateMissingLetterChallenge(word: string): Promise<any> {
    return { success: true, data: { word: 'D_G', missing: 'O', options: ['A','E','I','O'], prompt: 'A dog' } };
}

export async function generateSentence(topic: string): Promise<any> {
    return { success: true, data: { text: `The ${topic} is big.` } };
}

export async function generateRhymingWords(ending: string): Promise<any> {
    return { success: true, data: { ending, words: [{word: `c${ending}`}, {word: `b${ending}`}] } };
}

export async function generateBlendsExample(blend: string): Promise<any> {
    return { success: true, data: { blend, words: [{word: `${blend}ip`}]} };
}
