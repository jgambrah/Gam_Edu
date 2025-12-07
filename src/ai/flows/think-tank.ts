
'use server';

import { ai } from '@/ai/genkit';
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

    const { output } = await ai.generate({
      prompt: prompt,
      output: { schema: ParadoxSchema },
    });

    if (!output) throw new Error("No data returned");
    
    // Ensure the returned data has the target group tag
    return { ...output, targetGroup: input.targetGroup };
    
  } catch (error: any) {
    console.error("AI Error:", error);
    throw new Error(error.message);
  }
}


// --- DEBATE ARENA LOGIC ---

const DebateHistorySchema = z.array(z.object({
    role: z.enum(['user', 'ai']),
    content: z.string(),
}));

const DebateTurnInputSchema = z.object({
    topic: z.string(),
    history: DebateHistorySchema,
    userArgument: z.string(),
});

const DebateTurnOutputSchema = z.object({
    rebuttal: z.string().describe("The AI's counter-argument. It should be polite, challenging, and directly address the user's point."),
    critique: z.string().optional().describe("A brief, constructive critique of the user's argument, pointing out logical fallacies or suggesting improvements. Keep it encouraging."),
});


export async function runDebateTurn(input: z.infer<typeof DebateTurnInputSchema>): Promise<z.infer<typeof DebateTurnOutputSchema>> {
    const prompt = `
        You are a polite but skilled debater. 
        The topic is: "${input.topic}".
        
        The user has just argued: "${input.userArgument}"

        Your task:
        1. Acknowledge their point briefly.
        2. Provide a thoughtful counter-argument or point out a potential logical fallacy in their reasoning to make them think deeper.
        3. Keep your tone encouraging and educational, not confrontational.
        4. Provide a short, constructive critique of their argument.
        
        PREVIOUS HISTORY (for context):
        ${input.history.map(m => `${m.role}: ${m.content}`).join('\n')}

        Output strictly JSON.
    `;

    try {
        const { output } = await ai.generate({
            prompt,
            output: { schema: DebateTurnOutputSchema },
        });

        if (!output) throw new Error("Debate AI returned no data.");
        return output;

    } catch (error: any) {
        console.error("Debate AI Error:", error);
        throw new Error(error.message);
    }
}
