
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';
import { checkAndSpendCredits } from '@/app/actions/credits';

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

export async function generateJuniorStory(input: { topic: string; wordCount?: number; schoolId: string; }) {
  try {
    const creditResult = await checkAndSpendCredits(input.schoolId, 3);
    if (!creditResult.success) {
      return { success: false, error: creditResult.error || "Insufficient AI credits to generate a story." };
    }

    const prompt = `
      You are a kindergarten teacher. Write an educational story for a 5-year-old about: ${input.topic}.
      
      RULES:
      1. The story must be engaging and approximately ${input.wordCount || 100} words long.
      2. Use simple, age-appropriate words.
      3. The output MUST be a JSON object that strictly follows the provided schema.
      4. The 'questions' array must contain exactly 3 comprehension questions about the story.
    `;

    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: prompt,
      output: {
        schema: JuniorStorySchema
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
const JuniorScienceSchema = z.object({
  title: z.string().describe("The science topic, e.g., 'Volcanoes'."),
  emojiIcon: z.string().emoji().describe("A single relevant emoji."),
  fact: z.string().describe("A single, simple, 'wow' science fact for a 6-year-old."),
  observation: z.string().describe("A one-sentence observation related to the fact. e.g., 'This is why bubbles pop!'"),
  experiment: z.string().describe("A very simple, safe at-home activity. e.g., 'Mix baking soda and vinegar to see bubbles!'"),
});

export async function generateJuniorScience(input: { topic: string; schoolId: string; }) {
  try {
    const creditResult = await checkAndSpendCredits(input.schoolId, 2);
    if (!creditResult.success) {
      return { success: false, error: creditResult.error || "Insufficient AI credits." };
    }

    const prompt = `
      Generate a super simple and fun science 'discovery' for a 6-year-old child about "${input.topic}".
      Provide a title, an emoji, a simple one-sentence 'wow' fact, a related observation, and a very easy, safe home experiment suggestion.
      Output strictly JSON.
    `;
    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
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

export async function generateWordDetails(input: { word: string; schoolId: string; }) {
  try {
    const creditResult = await checkAndSpendCredits(input.schoolId, 1);
    if (!creditResult.success) {
      return { success: false, error: creditResult.error || "Insufficient AI credits." };
    }
    const prompt = `
      For the word "${input.word}", provide:
      1. A simple phonetic spelling (e.g., /kat/).
      2. A very simple sentence a 5-year-old would understand.
      3. A single, relevant emoji.
      Output strictly JSON.
    `;
    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt,
      output: { schema: WordDetailSchema }
    });
    if (!output) throw new Error("AI did not return data.");
    return { success: true, data: { ...output, word: input.word } };
  } catch (error) {
    console.error("AI Word Detail Error:", error);
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
    schoolId: z.string(),
});

export async function generateTTSAction(input: z.infer<typeof TTSInputSchema>) {
    try {
        const creditResult = await checkAndSpendCredits(input.schoolId, 1);
        if (!creditResult.success) {
          return { success: false, error: creditResult.error || "Insufficient AI credits." };
        }
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
export const generateLessonImageAction = async (input: { prompt: string; schoolId: string; }): Promise<{ success: boolean; data?: string | null, error?: string }> => {
    try {
      const creditResult = await checkAndSpendCredits(input.schoolId, 5);
      if (!creditResult.success) {
        return { success: false, error: creditResult.error || "Insufficient AI credits." };
      }
      const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: input.prompt,
      });
  
      if (media && media.url) {
        return { success: true, data: media.url };
      }
      return { success: true, data: null };
    } catch (error) {
      console.error("Image generation error:", error);
      return { success: false, error: "Image generation failed." };
    }
};

// --- HANDWRITING ASSESSMENT ACTION ---
export async function assessHandwritingAction(input: { imageDataUri: string; targetCharacter: string, schoolId: string; }) {
  try {
    const creditResult = await checkAndSpendCredits(input.schoolId, 3);
    if (!creditResult.success) {
      return { success: false, isCorrect: false, error: creditResult.error || "Insufficient AI credits." };
    }
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
    return { success: false, isCorrect: false, error: "The AI teacher is busy right now." };
  }
}

// Dummy placeholder functions for newly added features
export async function generateSkillDetails(input: { skill: string; schoolId: string }) {
  // In a real implementation, call Genkit AI here
  return {
    success: true,
    data: {
      title: input.skill,
      description: `This is a placeholder description for the '${input.skill}' life skill.`,
      imagePrompt: `3d illustration of a child learning about ${input.skill}`,
    },
  };
}

export async function generateRhyme(input: { topic: string; schoolId: string }) {
  // In a real implementation, call Genkit AI here
  return {
    success: true,
    data: {
      title: `Rhyme about ${input.topic}`,
      rhyme: `The ${input.topic} is great,\nIt's never too late,\nTo learn and to wait!`,
      imagePrompt: `3d illustration of a child rhyming about ${input.topic}`,
    },
  };
}
