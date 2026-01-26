
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

// --- NEWLY ADDED: LIFE SKILLS GENERATOR ---
const LifeSkillEntrySchema = z.any(); // Flexible schema for varied outputs

export async function generateLifeSkillEntry(input: { topic: string; category: string; schoolId: string; }) {
  const { topic, category, schoolId } = input;
  
  const creditResult = await checkAndSpendCredits(schoolId, 2);
  if (!creditResult.success) {
    return { success: false, error: creditResult.error || "Insufficient AI credits." };
  }

  let prompt = '';
  switch (category) {
    case 'emotions':
      prompt = `Create a nursery lesson for the feeling: ${topic}. Return JSON: { "name": string, "color": "bg-yellow-400" | "bg-blue-400" | "bg-red-400", "icon": string, "prompt": string, "technique": string }`;
      break;
    case 'health':
      prompt = `Create a physical activity or hygiene habit for children about: ${topic}. Return JSON: { "title": string, "action": string, "icon": string, "prompt": string }`;
      break;
    case 'kindness':
      prompt = `Create a kindness or community helper scenario for: ${topic}. Return JSON: { "title": string, "q": string, "options": [string, string, string], "correct": number (index 0-2), "prompt": string }`;
      break;
    case 'songs':
      prompt = `Generate a simple, short nursery rhyme or song (2-4 lines) for kids about: ${topic}. Return JSON: { "title": string, "content": string, "icon": "🎵", "imagePrompt": "A 3D Pixar-style illustration of a cute animal singing about ${topic}" }`;
      break;
    case 'watch':
      prompt = `Create a very short story (2 sentences) modeling good behavior related to: ${topic}. The story is for a 5-year-old. Return JSON: { "title": string, "story": string, "icon": "📺", "imagePrompt": "A 3D Pixar-style illustration of a child learning about ${topic}" }`;
      break;
    case 'routine':
      prompt = `Describe a simple daily routine step for a child related to: ${topic}. E.g., for 'Morning', the step could be 'Brush Your Teeth'. Return JSON: { "title": string, "step": string, "icon": "⏰", "imagePrompt": "A 3D Pixar-style illustration of a child doing a routine related to ${topic}" }`;
      break;
    case 'talk':
      prompt = `Create a simple conversation starter or social script for a child about: ${topic}. Return JSON: { "title": string, "script": string, "icon": "💬", "imagePrompt": "A 3D Pixar-style illustration of two cute animals talking about ${topic}" }`;
      break;
    case 'puppets':
      prompt = `Write a very short (2-3 lines) puppet show dialogue between two characters (e.g., Leo and Mia) about: ${topic}. Return JSON: { "title": string, "dialogue": string, "icon": "🎭", "imagePrompt": "A 3D Pixar-style illustration of cute animal puppets discussing ${topic}" }`;
      break;
    case 'solver':
      prompt = `Create a simple 'what comes next?' pattern puzzle for a child based on: ${topic}. Return JSON: { "title": string, "pattern": [string, string, string], "answer": string, "icon": "🧩", "imagePrompt": "A 3D Pixar-style illustration of a simple pattern puzzle about ${topic}" }`;
      break;
    default:
      // Fallback for any other categories
      prompt = `Create a simple children's activity about ${topic} in the category ${category}. Return JSON: { "title": string, "prompt": string, "icon": "🌟" }`;
  }
  
  try {
    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt,
      output: { schema: LifeSkillEntrySchema }
    });

    if (!output) throw new Error("AI did not generate any content.");
    
    return { success: true, data: output };
  } catch (error: any) {
    console.error(`AI Error for category "${category}":`, error);
    return { success: false, error: "The AI helper is resting right now. Please try again." };
  }
}

// --- RHYME GENERATOR ---
export async function generateRhyme(input: { topic: string; schoolId: string; }): Promise<{ success: boolean; error?: string; rhyme: string; }> {
  try {
    const creditResult = await checkAndSpendCredits(input.schoolId, 1);
    if (!creditResult.success) {
      return { success: false, error: creditResult.error || "Insufficient credits.", rhyme: '' };
    }

    const prompt = `Write a very simple, 4-line nursery rhyme for a 5-year-old about: ${input.topic}. The rhyme should be positive and easy to sing.`;
    const response = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt,
    });
    
    return { success: true, rhyme: response.text.trim() };
  } catch (e: any) {
    return { success: false, error: e.message, rhyme: '' };
  }
}

const SkillDetailSchema = z.object({
  title: z.string(),
  description: z.string().describe("A simple one-sentence explanation of the skill for a 5-year-old."),
  imagePrompt: z.string().describe("A simple, fun DALL-E prompt for an image representing this skill.")
});

export async function generateSkillDetails(input: { skill: string; schoolId: string }) {
  try {
    const creditResult = await checkAndSpendCredits(input.schoolId, 1);
    if (!creditResult.success) {
      return { success: false, error: creditResult.error || "Insufficient credits." };
    }

    const prompt = `Generate details for a life skill for a 5-year old. The skill is: '${input.skill}'.`;

    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt,
      output: { schema: SkillDetailSchema }
    });

    if (!output) {
      throw new Error("AI did not return valid skill details.");
    }

    return { success: true, data: output };
  } catch(e: any) {
    return { success: false, error: e.message };
  }
}

// PHONICS WORLD ENTRY GENERATOR
const PhonicsWorldEntrySchema = z.any();
export async function generatePhonicsWorldEntry(topic: string, category: string, schoolId: string) {
    try {
        const creditResult = await checkAndSpendCredits(schoolId, 2);
        if (!creditResult.success) {
            return { success: false, error: creditResult.error || "Insufficient AI credits." };
        }
        
        let prompt = '';
        switch (category) {
            case 'jolly-phonics':
                prompt = `Create a nursery Jolly Phonics card for "${topic}". JSON: { "letter": string, "sound": string, "action": string, "story": string, "imagePrompt": string }`;
                break;
            case 'alphabet':
                prompt = `Create a nursery phonics entry for letter "${topic.charAt(0).toUpperCase()}". JSON: { "upper": string, "lower": string, "word": string, "imagePrompt": string }`;
                break;
            case 'picture-reading':
                prompt = `Create a nursery picture reading task for "${topic}". JSON: { "sound": string, "target": string, "options": [{ "name": string, "prompt": string }], "correctIdx": number } (3 options)`;
                break;
            case 'syllables':
                 prompt = `Create a nursery "Syllables" lesson for word "${topic}". JSON: { "word": string, "syllables": string[], "prompt": string }`;
                break;
            case 'alliteration':
                prompt = `Create a nursery "Alliteration" card for "${topic}". JSON: { "sound": string, "target": string, "options": [{ "word": string, "match": boolean }], "prompt": string } (2 options)`;
                break;
            case 'sound-games':
                 prompt = `Create a Nursery 1 sound group for letter "${topic.charAt(0).toUpperCase()}". JSON: { "sound": string, "items": [{ "word": string, "prompt": string }] } (3 items)`;
                break;
            case 'blends':
                prompt = `Create a nursery "Digraph/Blend" card for sound "${topic}". JSON: { "blend": string, "type": string, "words": [{ "word": string, "prompt": string }] } (2 words)`;
                break;
            case 'rhymes':
                prompt = `Create a nursery "Rhyming Family" card for ending "${topic}". JSON: { "ending": string, "words": [{ "word": string, "prompt": string }] } (3 words)`;
                break;
            case 'diction':
                 prompt = `Create a nursery diction lesson for word "${topic}". JSON: { "word": string, "syllables": string, "instruction": string, "prompt": string }`;
                break;
            case 'missing-letters':
                prompt = `Create a nursery "missing letter" task for "${topic}". JSON: { "word": string, "missing": string, "options": string[], "prompt": string } (3 options)`;
                break;
            case 'environmental-print':
                prompt = `Create a nursery "Environmental Print" card for "${topic}". JSON: { "text": string, "context": string, "prompt": string }`;
                break;
            case 'book-handling':
                 prompt = `Create a nursery "Book Handling" lesson about "${topic}". JSON: { "title": string, "pages": [{ "text": string, "prompt": string }] } (2 pages)`;
                break;
            default:
                throw new Error("Invalid phonics category");
        }

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

// --- MATH WORLD ENTRY GENERATOR (IMPROVED) ---
const MathWorldEntrySchema = z.any(); // More flexible
export async function generateMathWorldEntry(topic: string, category: string, schoolId: string) {
    try {
        const creditResult = await checkAndSpendCredits(schoolId, 2);
        if (!creditResult.success) {
            return { success: false, error: creditResult.error || "Insufficient AI credits." };
        }
        
        let prompt = '';
        switch(category) {
            case 'numbers':
                prompt = `Create a number card for the theme "${topic}". Return JSON: { value: number (1-10), word: string, prompt: string (for image generation) }`;
                break;
            case 'counting':
                prompt = `Create a counting game for "${topic}". The count should be between 1 and 10. Return JSON: { count: number, theme: string, prompt: string }`;
                break;
            case 'sequence':
                prompt = `Create a "what comes next" number sequence puzzle with a theme of "${topic}". The sequence should have 3 numbers, one of them null. Provide 3 options. Return JSON: { question: string, sequence: [number|null, number|null, number|null], answer: number, options: [number, number, number] }`;
                break;
            case 'comparing':
            case 'comparison':
                prompt = `Create a number comparison game for "${topic}". Which is bigger/smaller? Return JSON: { q: string, val1: number, val2: number, answer: number }`;
                break;
            case 'number-words':
                prompt = `Create a number-word matching card for the theme "${topic}". The number should be between 1-10. Return JSON: { digit: number, word: string, prompt: string }`;
                break;
            case 'bonds':
                 prompt = `Create a number bonds puzzle up to 10 for "${topic}". Return JSON: { target: number, part1: number, part2: number, theme: string, prompt: string }`;
                break;
            case 'addition':
                 prompt = `Create a simple addition problem for "${topic}" (sum <= 10). Return JSON: { val1: number, val2: number, icon: string (e.g., 'fa-apple-whole'), theme: string, prompt: string }`;
                break;
            case 'subtraction':
                 prompt = `Create a simple subtraction problem for "${topic}" (result >= 0). Return JSON: { val1: number, val2: number, icon: string (e.g., 'fa-cookie'), theme: string, prompt: string }`;
                break;
            case 'tens-units':
                 prompt = `Create a tens and units example for a number between 11-50 related to "${topic}". Return JSON: { number: number, tens: number, units: number, prompt: string }`;
                break;
            case 'grouping':
                prompt = `Create a number grouping game for the theme "${topic}". Return JSON: { groupSize: number (1-5), totalItems: number (use groupSize * random integer between 2 and 5), theme: string, prompt: string }`;
                break;
            case 'time':
                prompt = `Create a telling time game for the theme "${topic}". The time should be on the hour. Return JSON: { hour: number (1-12), minute: 0, phrase: string, prompt: string }`;
                break;
            case 'money':
                prompt = `Create a coin counting game for the theme "${topic}". The count should be between 1 and 10. Return JSON: { amount: number, coins: number, label: string, prompt: string }`;
                break;
            case 'measurement':
                prompt = `Create a size/weight comparison game for "${topic}". It should have two items to compare. Return JSON: { q: string, correct: number (0 or 1), items: [{label: string, prompt: string, size: "lg" | "sm" }, {label: string, prompt: string, size: "lg" | "sm" }] }`;
                break;
            case 'shapes':
                prompt = `Create a shape card for "${topic}". Return JSON: { name: string, type: "2D", prompt: string }`;
                break;
            case 'spatial':
                prompt = `Create a spatial reasoning puzzle with the theme "${topic}". The target object should be above, below, or beside another. Return JSON: { target: string, position: "above" | "below" | "beside", refObject: string, prompt: string }`;
                break;
            case 'patterns':
                prompt = `Create a 'what comes next' pattern puzzle with FontAwesome 5 icon keys related to "${topic}". The sequence should have 3 icons, and 2 options. Return JSON: { sequence: [string, string, string], next: string, options: [string, string] }`;
                break;
            case 'one-to-one':
                prompt = `Create a one-to-one correspondence game for "${topic}". Return JSON: { count: number (2-5), name: string (plural), itemName: string, character: "fa-rabbit" | "fa-child-reaching", item: "fa-carrot" | "fa-apple-whole" }`;
                break;
            default:
                prompt = `Create a simple nursery math activity about ${topic} in the category ${category}. Return JSON: { "title": string, "question": string, "icon": "✨" }`;
        }

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

export async function generateScienceWorldEntry(topic: string, category: string, schoolId: string) {
    try {
        const creditResult = await checkAndSpendCredits(schoolId, 2);
        if (!creditResult.success) {
            return { success: false, error: creditResult.error || "Insufficient AI credits." };
        }
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
