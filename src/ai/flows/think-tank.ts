
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { MOCK_CROSSWORD_PUZZLES } from '@/lib/data';
import { checkAndSpendCredits } from '@/app/actions/credits';

// --- HELPER TO PREVENT 500 CRASHES ---
async function callAi(prompt: string, schema: any) {
    try {
        const { output } = await ai.generate({
            model: 'googleai/gemini-2.5-flash',
            prompt,
            output: { schema },
        });
        if (!output) throw new Error("AI returned no results.");
        return output;
    } catch (error: any) {
        console.error("GENKIT_ERROR:", error.message);
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
    
    const complexityInstruction = {
        'Novice (Basic 1-3)': "Target audience: Kids 6-8. Simple, fun logic.",
        'Apprentice (Basic 4-6)': "Target audience: Kids 9-11. Wordplay, math logic.",
        'Scholar (JHS)': "Target audience: Teens 12-15. Lateral thinking.",
        'Master (SHS)': "Target audience: Young Adults 16+. Complex paradoxes."
    }[input.targetGroup] || "General audience.";

    const output = await callAi(
        `Generate a logic puzzle/riddle. ${complexityInstruction} Output JSON.`, 
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

    const instruction = {
        'Novice (Basic 1-3)': "Activity: 'Fact vs Opinion'. Simple statements.",
        'Apprentice (Basic 4-6)': "Activity: 'Bias Hunter'.",
        'Scholar (JHS)': "Activity: 'Fake News Spotter'. Sensationalized headlines.",
        'Master (SHS)': "Activity: 'Fallacy Spotter'. Short arguments."
    }[input.targetGroup] || "General critical thinking exercise.";

    const output = await callAi(
        `Generate a Critical Thinking 'Detective Case'. ${instruction} Output strictly JSON.`,
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
    
    const instruction = {
        'Novice (Basic 1-3)': "Topics: Fun preferences (e.g., 'Cats vs Dogs').",
        'Apprentice (Basic 4-6)': "Topics: School/Home rules.",
        'Scholar (JHS)': "Topics: Social issues, Technology.",
        'Master (SHS)': "Topics: Global policy, Ethics."
    }[input.targetGroup] || "General topics.";

    const output = await callAi(
        `Generate a debate topic. ${instruction} Output strictly JSON.`,
        schema
    );
    return { ...output, targetGroup: input.targetGroup };
}

// No AI used here, so no changes needed
export async function generateCrosswordAction(topic: string) {
    const randomIndex = Math.floor(Math.random() * MOCK_CROSSWORD_PUZZLES.length);
    return MOCK_CROSSWORD_PUZZLES[randomIndex];
}
