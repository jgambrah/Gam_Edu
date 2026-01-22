

'use client';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';
import { generateLessonImageAction as generateLessonImage } from '@/ai/flows/junior-actions';

// --- STORY GENERATOR ---
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
    const prompt = `
      You are a kindergarten teacher. Write an educational story for a 5-year-old about: ${topic}.
      
      RULES:
      1. The story must be engaging and approximately ${wordCount} words long.
      2. Use simple, age-appropriate words.
      3. The output MUST be a JSON object that strictly follows the provided schema.
      4. The 'questions' array must contain exactly 3 comprehension questions about the story.
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

const ArtDetailsShapesSchema = z.object({
  description: z.string().describe("A simple, one-sentence description of how to draw the item using basic shapes."),
  parts: z.array(z.string()).describe("A list of 1 to 3 basic shapes needed (e.g., 'Circle', 'Square', 'Triangle', 'Star')."),
  prompt: z.string().describe("A DALL-E style prompt for generating the final drawing from the shapes."),
});

const ArtDetailsTexturesSchema = z.object({
  description: z.string().describe("A short, sensory reaction a child might have when touching the texture (e.g., 'Ooh, it feels bumpy!')."),
  prompt: z.string().describe("A DALL-E style prompt for generating a super detailed, close-up, macro photograph of the texture, with a nursery aesthetic."),
});

export async function generateArtDetailsAction(input: { item: string; type: 'shapes' | 'textures' }): Promise<{ success: boolean, data?: any, error?: string }> {
  try {
    if (input.type === 'shapes') {
      const prompt = `
        You are a preschool art teacher. 
        Describe how to draw a simple "${input.item}" using only basic shapes.
        - description: A simple, encouraging one-sentence description.
        - parts: An array of 1 to 3 basic shapes needed (from 'Circle', 'Square', 'Triangle', 'Star').
        - prompt: A DALL-E style prompt for generating the final drawing from the shapes.
        Return JSON.
      `;
      const { output } = await ai.generate({
        prompt,
        model: 'googleai/gemini-2.5-flash',
        output: { schema: ArtDetailsShapesSchema }
      });
      return { success: true, data: output };
    } 
    
    if (input.type === 'textures') {
      const prompt = `
        You are a sensory guide for toddlers. 
        For the texture "${input.item}":
        - description: Write a short, exclamatory reaction a child might have when touching it.
        - prompt: Write a detailed DALL-E style prompt for a super detailed, close-up, macro photograph of this texture, with a nursery aesthetic.
        Return JSON.
      `;
      const { output } = await ai.generate({
        prompt,
        model: 'googleai/gemini-2.5-flash',
        output: { schema: ArtDetailsTexturesSchema }
      });
      return { success: true, data: output };
    }
    
    return { success: false, error: 'Invalid type provided' };
  } catch (error: any) {
    console.error("AI Art Details Error:", error);
    return { success: false, error: error.message };
  }
}

const NumeracyTaskSchema = z.object({
    question: z.string(),
    answer: z.number(),
    options: z.array(z.number()),
    target: z.string().optional(),
    position: z.string().optional(),
    refObject: z.string().optional(),
    prompt: z.string().optional()
});

export async function generateNumeracyTask(input: { task: string; topic: string }): Promise<any> {
    try {
        const prompt = `
            You are a preschool math teacher.
            Generate a simple numeracy task for a 5-year-old.
            Task type: "${input.task}"
            Topic: "${input.topic}"
            - question: A very simple question.
            - answer: A numeric answer.
            - options: An array of 3 numbers, one of which is the answer.
            If the task is 'spatial', also provide:
            - target: The object being placed.
            - position: 'above', 'below', or 'beside'.
            - refObject: The reference object.
            - prompt: A DALL-E prompt to generate the scene.
            Return JSON.
        `;
        const { output } = await ai.generate({
            prompt,
            model: 'googleai/gemini-2.5-flash',
            output: { schema: NumeracyTaskSchema }
        });
        return { success: true, data: output };

    } catch (error: any) {
        console.error("Numeracy Task Error:", error);
        return { success: false, error: error.message };
    }
}

const DictionDetailsSchema = z.object({
    syllables: z.string(),
    instruction: z.string()
});
export async function generateDictionDetails(word: string): Promise<any> {
    const prompt = `For the word "${word}", provide a simple syllable breakdown (e.g., "AP-PLE") and a fun 1-sentence instruction for a 5-year-old on how to pronounce it. Return JSON with keys "syllables" and "instruction".`;
    const { output } = await ai.generate({ prompt, model: 'googleai/gemini-2.5-flash', output: { schema: DictionDetailsSchema } });
    return { success: true, data: output };
}

const StorytellingSceneSchema = z.object({
    title: z.string(),
    prompt: z.string(),
    questions: z.array(z.string())
});
export async function generateStorytellingScene(topic: string): Promise<any> {
    const prompt = `Generate a storytelling scene for a 5-year-old about "${topic}". Provide a title, a DALL-E image prompt, and an array of 3 simple "What do you see?" questions. Return JSON.`;
    const { output } = await ai.generate({ prompt, model: 'googleai/gemini-2.5-flash', output: { schema: StorytellingSceneSchema } });
    return { success: true, data: output };
}

const ThemedVocabSchema = z.object({
    name: z.string(),
    words: z.array(z.string()),
    prompt: z.string()
});
export async function generateThemedVocab(theme: string): Promise<any> {
    const prompt = `For the theme "${theme}", generate 3 simple vocabulary words for a 5-year-old and a DALL-E prompt for an image representing the theme. Return JSON with keys "name", "words", "prompt".`;
    const { output } = await ai.generate({ prompt, model: 'googleai/gemini-2.5-flash', output: { schema: ThemedVocabSchema } });
    return { success: true, data: output };
}

const MissingLetterSchema = z.object({
    word: z.string(),
    missing: z.string(),
    options: z.array(z.string()),
    prompt: z.string()
});
export async function generateMissingLetterChallenge(word: string): Promise<any> {
    const missingIndex = Math.floor(Math.random() * word.length);
    const missingLetter = word[missingIndex];
    const displayWord = word.substring(0, missingIndex) + '_' + word.substring(missingIndex + 1);
    const options = [missingLetter, 'A', 'E', 'I', 'O', 'U'].filter((v, i, a) => a.indexOf(v) === i).sort(() => Math.random() - 0.5).slice(0, 4);
    const data = {
        word: displayWord,
        missing: missingLetter,
        options: options.includes(missingLetter) ? options : [...options.slice(0,3), missingLetter].sort(() => Math.random() - 0.5),
        prompt: `A picture of a ${word}`
    };
    return { success: true, data };
}

const SentenceSchema = z.object({ text: z.string() });
export async function generateSentence(topic: string): Promise<any> {
    const prompt = `Write a very simple sentence for a 5-year-old about a "${topic}". Return JSON with key "text".`;
    const { output } = await ai.generate({ prompt, model: 'googleai/gemini-2.5-flash', output: { schema: SentenceSchema } });
    return { success: true, data: output };
}

const RhymingWordsSchema = z.object({ ending: z.string(), words: z.array(z.object({word: z.string()})) });
export async function generateRhymingWords(ending: string): Promise<any> {
    const prompt = `Generate 3 simple CVC words that rhyme with "-${ending}". Return JSON with keys "ending" and "words" (an array of objects with a "word" key).`;
    const { output } = await ai.generate({ prompt, model: 'googleai/gemini-2.5-flash', output: { schema: RhymingWordsSchema } });
    return { success: true, data: output };
}

const BlendsExampleSchema = z.object({ blend: z.string(), words: z.array(z.object({word: z.string()})) });
export async function generateBlendsExample(blend: string): Promise<any> {
    const prompt = `Generate 2 simple words that start with the blend "${blend}". Return JSON with keys "blend" and "words" (an array of objects with a "word" key).`;
    const { output } = await ai.generate({ prompt, model: 'googleai/gemini-2.5-flash', output: { schema: BlendsExampleSchema } });
    return { success: true, data: output };
}

export { generateLessonImage };
