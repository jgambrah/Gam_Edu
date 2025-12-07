
'use server';

import { generate } from '@genkit-ai/ai';
import { gemini15Flash } from '@genkit-ai/googleai';
import { z } from 'zod';

// Define the schema
const ParadoxSchema = z.object({
  question: z.string(),
  answer: z.string(),
  explanation: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  targetGroup: z.string(), // Added field to store who this is for
});

export async function generateDailyParadox(input: { targetGroup: string }) {
  try {
    // 1. Define instructions based on the target group
    let complexityInstruction = "";
    
    switch (input.targetGroup) {
        case 'Novice (Basic 1-3)':
            complexityInstruction = "Target audience: Children aged 6-8. Use very simple English. Focus on animals, colors, shapes, or simple counting logic. Keep it fun and playful.";
            break;
        case 'Apprentice (Basic 4-6)':
            complexityInstruction = "Target audience: Children aged 9-11. Use moderate vocabulary. Focus on wordplay, basic math logic, or everyday situations.";
            break;
        case 'Scholar (JHS)':
            complexityInstruction = "Target audience: Teens aged 12-15. Focus on lateral thinking, detective mysteries, or algebra logic. Challenge their assumptions.";
            break;
        case 'Master (SHS)':
            complexityInstruction = "Target audience: Young Adults aged 16-19. Focus on complex paradoxes, philosophy, or advanced logic puzzles (like Einstein's riddle).";
            break;
        default:
            complexityInstruction = "Target audience: General student body.";
    }

    const prompt = `
      Generate a unique "Daily Paradox" or Logic Puzzle.
      ${complexityInstruction}
      Output strictly JSON.
    `;

    const response = await generate({
      model: gemini15Flash,
      prompt: prompt,
      output: { schema: ParadoxSchema },
    });

    const data = response.output();
    if (!data) throw new Error("No data returned");
    
    // Ensure the returned data has the target group tag
    return { ...data, targetGroup: input.targetGroup };
    
  } catch (error: any) {
    console.error("AI Error:", error);
    throw new Error(error.message);
  }
}
