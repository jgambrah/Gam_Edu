
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
// @ts-ignore
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

export async function generateJuniorStory(input: { topic: string; context?: string; wordCount?: number; schoolId: string; }) {
  try {
    const creditResult = await checkAndSpendCredits(input.schoolId, 3);
    if (!creditResult.success) {
      return { success: false, error: creditResult.error || "Insufficient AI credits to generate a story." };
    }

    const prompt = `
      You are a kindergarten teacher. Write an educational story for a 5-year-old about: ${input.topic}.
      ${input.context ? `Additional user requirements/context to guide the story: ${input.context}` : ''}
      
      RULES:
      1. The story must be engaging and approximately ${input.wordCount || 100} words long.
      2. Use simple, age-appropriate words.
      3. The output MUST be a JSON object that strictly follows the provided schema.
      4. The 'questions' array must contain exactly 3 comprehension questions about the story.
    `;

    const { output } = await ai.generate({
      model: 'googleai/gemini-3-flash-preview',
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
      model: 'googleai/gemini-3-flash-preview',
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
  meaning: z.string().describe("A simple one-sentence explanation of what the word means, suitable for a 5-year-old."),
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
      2. A simple explanation of what the word means, suitable for a 5-year-old.
      3. A very simple sentence a 5-year-old would understand.
      4. A single, relevant emoji.
      Output strictly JSON.
    `;
    const { output } = await ai.generate({
      model: 'googleai/gemini-3-flash-preview',
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
        writer.on('data', (chunk: any) => chunks.push(chunk));
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
            model: 'googleai/gemini-3.1-flash-tts-preview',
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
      model: 'googleai/gemini-3-flash-preview',
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

// --- LIFE SKILLS GENERATOR ---
const LifeSkillEntrySchema = z.any(); // Flexible schema for varied outputs

export async function generateLifeSkillEntry(input: { topic: string; category: string; schoolId: string; }) {
  const { topic, category, schoolId } = input;
  
  const creditResult = await checkAndSpendCredits(schoolId, 2);
  if (!creditResult.success) {
    return { success: false, error: creditResult.error || "Insufficient AI credits." };
  }

  let prompt = '';
  switch (category) {
    case 'feelings':
      prompt = `Create a nursery lesson for the feeling: ${topic}. Return JSON: { "name": string, "color": "bg-yellow-400" | "bg-blue-400" | "bg-red-400", "icon": emoji, "prompt": string, "technique": string }`;
      break;
    case 'health':
      prompt = `Create a physical activity or hygiene habit for children about: ${topic}. Return JSON: { "title": string, "action": string, "icon": emoji, "prompt": string }`;
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
      model: 'googleai/gemini-3-flash-preview',
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
      model: 'googleai/gemini-3-flash-preview',
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
      model: 'googleai/gemini-3-flash-preview',
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
const PhonicsWorldEntrySchema = z.object({
    title: z.string(),
    sound: z.string(),
    description: z.string(),
    imagePrompt: z.string(),
    icon: z.string(),
});
export async function generatePhonicsWorldEntry(topic: string, category: string, schoolId: string) {
    try {
        const creditResult = await checkAndSpendCredits(schoolId, 2);
        if (!creditResult.success) {
            return { success: false, error: creditResult.error || "Insufficient AI credits." };
        }
        const prompt = `Create a nursery phonics entry for "${topic}" in category "${category}". 
        Return JSON: { "title": "string", "sound": "string", "description": "string", "imagePrompt": "string", "icon": "string" }`;
        const { output } = await ai.generate({
            model: 'googleai/gemini-3-flash-preview',
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

// --- MATH WORLD ENTRY GENERATOR ---
const MathWorldEntrySchema = z.object({
    title: z.string(),
    question: z.string(),
    imagePrompt: z.string(),
    options: z.array(z.string()).length(4),
    correctAnswer: z.string(),
    icon: z.string(),
});
export async function generateMathWorldEntry(topic: string, category: string, schoolId: string) {
    try {
        const creditResult = await checkAndSpendCredits(schoolId, 2);
        if (!creditResult.success) {
            return { success: false, error: creditResult.error || "Insufficient AI credits." };
        }
        const prompt = `
            Create a nursery math activity for a child.
            The topic is "${topic}" and it should fit within the category "${category}".
            Provide a simple question, 4 options (one must be correct), the correct answer, an emoji icon, and a creative DALL-E style prompt to generate an image for the question.
            Output strictly JSON.
        `;

        const { output } = await ai.generate({
            model: 'googleai/gemini-3-flash-preview',
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
            model: 'googleai/gemini-3-flash-preview',
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

// --- INCOMPLETE SENTENCE GENERATOR (YEAR 5+) ---
const IncompleteSentenceSchema = z.object({
  prompt: z.string().describe("The incomplete sentence prompt containing '______' where the missing word goes, suitable for Year 5+/Class 1 pupils."),
  answer: z.string().describe("The single correct word or short phrase that fits the missing space."),
  options: z.array(z.string()).length(4).describe("Array of 4 options containing the correct answer and 3 plausible distractor options."),
  category: z.string().describe("The category, e.g. Science & Nature, Grammar & Words, Space & Tech, Math & Logic, Logic & Life."),
  explanation: z.string().describe("A concise 1-2 sentence explanation of why the answer is correct.")
});

export async function generateIncompleteSentenceAction(topic: string, category: string, schoolId: string) {
  try {
    const creditResult = await checkAndSpendCredits(schoolId, 2);
    if (!creditResult.success) {
      return { success: false, error: creditResult.error || "Insufficient AI credits." };
    }
    const prompt = `
      Create a Year 5+ / Class 1 elementary school incomplete sentence challenge for pupils.
      Topic / Subject: "${topic}"
      Category: "${category || 'Science & Nature'}"
      
      RULES:
      1. Provide a clear, educational sentence containing '______' (6 underscores) representing the blank space to be filled.
      2. The correct answer must logically and grammatically complete the sentence.
      3. Provide exactly 4 options (1 correct answer and 3 plausible wrong distractors).
      4. Provide a 1-2 sentence child-friendly explanation of why the answer is correct.
      5. Output strictly JSON matching the schema.
    `;

    const { output } = await ai.generate({
      model: 'googleai/gemini-3-flash-preview',
      prompt,
      output: { schema: IncompleteSentenceSchema }
    });
    if (!output) throw new Error("AI did not generate a valid incomplete sentence.");
    return { success: true, data: output };
  } catch (error: any) {
    console.error("Incomplete Sentence AI Error:", error);
    return { success: false, error: (error as Error).message };
  }
}

// --- MATH WORD PROBLEM GENERATOR (YEAR 5+) ---
const MathWordProblemSchema = z.object({
  prompt: z.string().describe("The math word problem description for Class 1 (Year 5+) pupils, using simple language and names."),
  ans: z.number().describe("The single correct numerical answer to the word problem."),
  options: z.array(z.number()).length(4).describe("An array of 4 numerical options containing the correct answer and 3 plausible distractor numbers.")
});

export async function generateMathWordProblemAction(topic: string, schoolId: string) {
  try {
    const creditResult = await checkAndSpendCredits(schoolId, 2);
    if (!creditResult.success) {
      return { success: false, error: creditResult.error || "Insufficient AI credits." };
    }
    const prompt = `
      Create an elementary school Class 1 / Year 5+ math word problem.
      Topic or focus: "${topic}"
      
      RULES:
      1. Keep the story prompt simple, using children's names and basic items (e.g. apples, balloons, shells, money).
      2. The math must be suitable for Class 1 (advanced kindergarten) level. Keep numbers under 100.
      3. The correct answer must be a single integer.
      4. Provide exactly 4 options: 1 correct integer answer and 3 realistic incorrect distractors.
      5. Output strictly JSON matching the schema.
    `;

    const { output } = await ai.generate({
      model: 'googleai/gemini-3-flash-preview',
      prompt,
      output: { schema: MathWordProblemSchema }
    });
    if (!output) throw new Error("AI did not generate a valid math word problem.");
    return { success: true, data: output };
  } catch (error: any) {
    console.error("Math Word Problem AI Error:", error);
    return { success: false, error: (error as Error).message };
  }
}

