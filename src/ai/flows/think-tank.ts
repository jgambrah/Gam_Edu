'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { MOCK_CROSSWORD_PUZZLES } from '@/lib/data';
import { checkAndSpendCredits } from '@/app/actions/credits';

// --- HELPER TO PREVENT 500 CRASHES ---
async function callAi(prompt: string, schema: any) {
    try {
        const { output } = await ai.generate({
            prompt,
            output: { schema },
        });
        if (!output) throw new Error("AI returned no results.");
        return output;
    } catch (error: any) {
        // This prints the REAL error to your Workstation terminal
        console.error("GENKIT_ERROR:", error.message);
        
        // This sends a readable error to the UI instead of a 500
        throw new Error(error.message || "AI failed to generate response");
    }
}

// --- ACTIONS ---

export async function generateDailyParadox(input: { targetGroup: string; schoolId: string; }) {
    const creditResult = await checkAndSpendCredits(input.schoolId, 2);
    if (!creditResult.success) {
        throw new Error(creditResult.error || "Insufficient AI credits.");
    }
    const schema = z.object({
        question: z.string(),
        answer: z.string(),
        explanation: z.string(),
        difficulty: z.string(),
    });
    
    const output = await callAi(
        `Generate a logic puzzle for ${input.targetGroup}. Output JSON.`, 
        schema
    );
    return { ...output, targetGroup: input.targetGroup };
}

export async function generateDetectiveCase(input: { targetGroup: string; schoolId: string; }) {
    const creditResult = await checkAndSpendCredits(input.schoolId, 2);
    if (!creditResult.success) {
        throw new Error(creditResult.error || "Insufficient AI credits.");
    }
    const schema = z.object({
        scenario: z.string(),
        question: z.string(),
        caseType: z.string(),
        options: z.array(z.string()),
        correctAnswer: z.string(),
        explanation: z.string(),
    });

    const output = await callAi(
        `Generate a detective case for ${input.targetGroup}. Output JSON.`,
        schema
    );
    return { ...output, targetGroup: input.targetGroup };
}

export async function generateDebateTopic(input: { targetGroup: string; schoolId: string; }) {
    const creditResult = await checkAndSpendCredits(input.schoolId, 2);
    if (!creditResult.success) {
        throw new Error(creditResult.error || "Insufficient AI credits.");
    }
    const schema = z.object({ topic: z.string(), context: z.string() });
    const output = await callAi(
        `Generate a debate topic for ${input.targetGroup}. Output JSON.`,
        schema
    );
    return { ...output, targetGroup: input.targetGroup };
}

// No AI used here, so no changes needed
export async function generateCrosswordAction(topic: string) {
    const randomIndex = Math.floor(Math.random() * MOCK_CROSSWORD_PUZZLES.length);
    return MOCK_CROSSWORD_PUZZLES[randomIndex];
}