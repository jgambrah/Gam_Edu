
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// --- EXISTING PARADOX CODE ---
const ParadoxSchema = z.object({
  question: z.string(),
  answer: z.string(),
  explanation: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  targetGroup: z.string().optional(),
});

export async function generateDailyParadox(input: { targetGroup: string }) {
  try {
    let complexityInstruction = "";
    switch (input.targetGroup) {
        case 'Novice (Basic 1-3)': complexityInstruction = "Target audience: Kids 6-8. Simple, fun logic. E.g. Patterns, animals."; break;
        case 'Apprentice (Basic 4-6)': complexityInstruction = "Target audience: Kids 9-11. Wordplay, math logic."; break;
        case 'Scholar (JHS)': complexityInstruction = "Target audience: Teens 12-15. Lateral thinking, detective riddles."; break;
        case 'Master (SHS)': complexityInstruction = "Target audience: Young Adults 16+. Complex paradoxes, philosophy."; break;
        default: complexityInstruction = "General audience.";
    }

    const { output } = await ai.generate({
      prompt: `Generate a logic puzzle/riddle. ${complexityInstruction} Output JSON.`,
      output: { schema: ParadoxSchema },
    });
    if (!output) throw new Error("AI returned no data.");
    return { ...output, targetGroup: input.targetGroup };
  } catch (e: any) { throw new Error(e.message); }
}

// --- NEW DEBATE ACTION ---
const DebateSchema = z.object({
    topic: z.string(),
    context: z.string(),
});

export async function generateDebateTopic(input: { targetGroup: string }) {
  try {
    let instruction = "";
    switch (input.targetGroup) {
        case 'Novice (Basic 1-3)':
            instruction = "Target: Ages 6-8. Topics: Fun preferences (e.g., 'Is Summer better than Winter?', 'Cats vs Dogs'). Simple explanations.";
            break;
        case 'Apprentice (Basic 4-6)':
            instruction = "Target: Ages 9-11. Topics: School/Home rules (e.g., 'Should homework be banned?', 'Uniforms').";
            break;
        case 'Scholar (JHS)':
            instruction = "Target: Ages 12-15. Topics: Social issues, Technology (e.g., 'Social Media age limits', 'AI in schools').";
            break;
        case 'Master (SHS)':
            instruction = "Target: Ages 16-19. Topics: Global policy, Ethics, Philosophy (e.g., 'Universal Basic Income', 'Genetic Engineering').";
            break;
        default:
            instruction = "General topics.";
    }

    const prompt = `
      Generate a debate topic.
      ${instruction}
      Output strictly JSON with 'topic' (the question) and 'context' (a 1-sentence background).
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      output: { schema: DebateSchema },
    });

    if (!output) throw new Error("No data returned");
    
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
