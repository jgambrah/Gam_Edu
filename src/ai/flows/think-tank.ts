
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { MOCK_CROSSWORD_PUZZLES } from '@/lib/data';

// --- HELPER FOR LOGGING ---
const logError = (context: string, error: any) => {
  console.error(`[Think Tank - ${context}]:`, error);
  // This helps you see the actual Zod validation error in your server logs
  if (error.name === 'ZodError') {
    console.error('Validation Errors:', error.errors);
  }
};

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
        case 'Novice (Basic 1-3)': complexityInstruction = "Target: Kids 6-8. Use simple animals/colors logic."; break;
        case 'Apprentice (Basic 4-6)': complexityInstruction = "Target: Kids 9-11. Use wordplay or basic math logic."; break;
        case 'Scholar (JHS)': complexityInstruction = "Target: Teens 12-15. Use lateral thinking or detective riddles."; break;
        case 'Master (SHS)': complexityInstruction = "Target: Young Adults 16+. Use philosophical or complex scientific paradoxes."; break;
        default: complexityInstruction = "General audience logic.";
    }

    const { output } = await ai.generate({
      prompt: `Generate a logic puzzle. ${complexityInstruction}. 
               IMPORTANT: Difficulty MUST be exactly one of: 'Easy', 'Medium', or 'Hard'. 
               Output strictly JSON matching the requested schema.`,
      output: { schema: ParadoxSchema },
    });

    if (!output) throw new Error("AI returned no data.");
    return { ...output, targetGroup: input.targetGroup };
  } catch (e: any) { 
    logError("Daily Paradox", e);
    throw new Error("Failed to generate paradox. Please try again."); 
  }
}

// --- DEBATE ACTION ---
const DebateSchema = z.object({
    topic: z.string(),
    context: z.string(),
});

export async function generateDebateTopic(input: { targetGroup: string }) {
  try {
    let instruction = "";
    switch (input.targetGroup) {
        case 'Novice (Basic 1-3)': instruction = "Ages 6-8. Simple 'A vs B' topics."; break;
        case 'Apprentice (Basic 4-6)': instruction = "Ages 9-11. School/Home rules."; break;
        case 'Scholar (JHS)': instruction = "Ages 12-15. Tech/Social media issues."; break;
        case 'Master (SHS)': instruction = "Ages 16-19. Ethics/Global policy."; break;
        default: instruction = "General debate topic.";
    }

    const { output } = await ai.generate({
      prompt: `Generate a debate topic for ${instruction}. Output strictly JSON with 'topic' and 'context'.`,
      output: { schema: DebateSchema },
    });

    if (!output) throw new Error("No data returned");
    return { ...output, targetGroup: input.targetGroup };
  } catch (error: any) {
    logError("Debate Topic", error);
    throw new Error("Failed to generate debate topic.");
  }
}

// --- DEBATE ARENA LOGIC ---
const DebateTurnOutputSchema = z.object({
    rebuttal: z.string(),
    critique: z.string().optional(),
});

export async function runDebateTurn(input: any) {
    try {
        const prompt = `
            Topic: "${input.topic}".
            History: ${input.history.map((m: any) => `${m.role}: ${m.content}`).join('\n')}
            User says: "${input.userArgument}"
            
            Task: Provide a polite counter-argument (rebuttal) and a brief critique of their logic.
            Output strictly JSON.
        `;

        const { output } = await ai.generate({
            prompt,
            output: { schema: DebateTurnOutputSchema },
        });

        if (!output) throw new Error("AI returned no data.");
        return output;
    } catch (error: any) {
        logError("Debate Turn", error);
        throw new Error("The AI debater is thinking too hard. Try again.");
    }
}

// --- DETECTIVE DESK ACTION ---
const DetectiveSchema = z.object({
  scenario: z.string(),
  question: z.string(),
  caseType: z.enum(['Fact/Opinion', 'Bias Hunter', 'Fallacy Spotter', 'Fake News']),
  options: z.array(z.string()),
  correctAnswer: z.string(),
  explanation: z.string(),
});

export async function generateDetectiveCase(input: { targetGroup: string }) {
  try {
    let instruction = "";
    switch (input.targetGroup) {
        case 'Novice (Basic 1-3)':
            instruction = "Target: Ages 6-8. Activity: 'Fact/Opinion'. Topic: Animals/Food. Options MUST be ['Fact', 'Opinion'].";
            break;
        case 'Apprentice (Basic 4-6)':
            instruction = "Target: Ages 9-11. Activity: 'Bias Hunter'. Identify an emotional word in a sentence.";
            break;
        case 'Scholar (JHS)':
            instruction = "Target: Ages 12-15. Activity: 'Fake News'. Headline analysis. Options: ['Reliable', 'Suspicious'].";
            break;
        case 'Master (SHS)':
            instruction = "Target: Ages 16-19. Activity: 'Fallacy Spotter'. Identify logical fallacies (Strawman, Ad Hominem).";
            break;
        default:
            instruction = "General critical thinking exercise.";
    }

    const prompt = `
      Generate a 'Critical Thinking Detective Case'.
      ${instruction}
      
      RULES:
      1. 'caseType' MUST be exactly one of: 'Fact/Opinion', 'Bias Hunter', 'Fallacy Spotter', 'Fake News'.
      2. 'correctAnswer' MUST be exactly one of the items in the 'options' array.
      3. Output strictly JSON.
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      output: { schema: DetectiveSchema },
    });

    if (!output) throw new Error("No data returned");
    return { ...output, targetGroup: input.targetGroup };
    
  } catch (error: any) {
    logError("Detective Case", error);
    throw new Error("Detective desk is closed for investigation (AI Error).");
  }
}

// --- CROSSWORD ---
export async function generateCrosswordAction(topic: string) {
    try {
        const randomIndex = Math.floor(Math.random() * MOCK_CROSSWORD_PUZZLES.length);
        const puzzle = MOCK_CROSSWORD_PUZZLES[randomIndex];
        await new Promise(resolve => setTimeout(resolve, 500));

        if (topic && puzzle.topic.toLowerCase() !== 'general') {
            return { ...puzzle, title: `${topic} & ${puzzle.title}` };
        }
        return puzzle;
    } catch (error: any) {
        logError("Crossword", error);
        throw new Error("Could not load puzzle.");
    }
}
