

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// --- EXISTING PARADOX CODE (Keep this) ---
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

// --- DEBATE ACTION ---
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
        
        This is the conversation so far:
        ${input.history.map(m => `${m.role}: ${m.content}`).join('\n')}
        
        The user has just argued: "${input.userArgument}"

        Your task:
        1. Acknowledge their point briefly.
        2. Provide a thoughtful counter-argument or point out a potential logical fallacy in their reasoning to make them think deeper.
        3. Keep your tone encouraging and educational, not confrontational.
        4. Provide a short, constructive critique of their argument.
        
        IMPORTANT: Your response MUST be a direct rebuttal or counter-point to the user's last argument. Do not get stuck on one point. Move the conversation forward.

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

// --- DETECTIVE DESK ACTION ---
const DetectiveSchema = z.object({
  scenario: z.string().describe("The text, headline, or statement to analyze."),
  question: z.string().describe("The specific question to ask the student."),
  caseType: z.enum(['Fact/Opinion', 'Bias Hunter', 'Fallacy Spotter', 'Fake News']),
  options: z.array(z.string()).describe("Options for the student to choose from."),
  correctAnswer: z.string(),
  explanation: z.string().describe("Why is this the correct answer?"),
});

export async function generateDetectiveCase(input: { targetGroup: string }) {
  try {
    let instruction = "";
    switch (input.targetGroup) {
        case 'Novice (Basic 1-3)':
            instruction = "Target: Ages 6-8. Activity: 'Fact vs Opinion'. Generate a simple statement about animals, food, or school. Options: ['Fact', 'Opinion'].";
            break;
        case 'Apprentice (Basic 4-6)':
            instruction = "Target: Ages 9-11. Activity: 'Bias Hunter'. Generate a sentence with emotional/loaded language. Ask which word shows bias. Options: [Word A, Word B, Word C].";
            break;
        case 'Scholar (JHS)':
            instruction = "Target: Ages 12-15. Activity: 'Fake News Spotter'. Generate a sensationalized headline. Ask if it is Reliable or Suspicious. Options: ['Reliable', 'Suspicious'].";
            break;
        case 'Master (SHS)':
            instruction = "Target: Ages 16-19. Activity: 'Fallacy Spotter'. Generate a short argument containing a logical fallacy (Ad Hominem, Strawman, Slippery Slope). Ask to identify the fallacy.";
            break;
        default:
            instruction = "General critical thinking exercise.";
    }

    const prompt = `
      Generate a Critical Thinking 'Detective Case'.
      ${instruction}
      Output strictly JSON.
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      output: { schema: DetectiveSchema },
    });

    if (!output) throw new Error("No data returned");
    
    return { ...output, targetGroup: input.targetGroup };
    
  } catch (error: any) {
    console.error("AI Error:", error);
    throw new Error(error.message);
  }
}

// --- NEW: CROSSWORD PUZZLE GENERATION ACTION (ROBUST VERSION) ---
const CrosswordClueSchema = z.object({
  number: z.number(),
  clue: z.string(),
  answer: z.string(),
  row: z.number(),
  col: z.number(),
});

// Final, strict schema that the application expects.
const CrosswordPuzzleSchema = z.object({
  title: z.string(),
  grid: z.array(z.array(z.string())),
  clues: z.object({
    across: z.array(CrosswordClueSchema),
    down: z.array(CrosswordClueSchema).optional().default([]), // Make down optional with empty array default
  }),
});

export async function generateCrosswordAction(topic: string) {
  const prompt = `
  You are an expert puzzle creator. Create a complete, valid, and playable crossword puzzle about "${topic}" for educational purposes.

  PUZZLE REQUIREMENTS:
  1.  Words MUST be related to the topic: "${topic}".
  2.  Generate 4 to 6 words total.
  3.  Each word must be 4 to 8 letters long.
  4.  The grid size must be between 5x5 and 10x10.
  5.  All clues MUST be educational and age-appropriate.
  6.  The grid MUST correctly represent the intersection of all words. Use empty strings "" for black/empty squares.
  7.  You MUST include BOTH "across" AND "down" clues, even if one is an empty array [].
  8.  Each clue object in both "across" and "down" arrays MUST contain all of these properties: "number", "clue", "answer", "row", and "col".

  Return ONLY valid JSON with this exact structure:
  {
    "title": "Puzzle title",
    "grid": [["L","E","A","R","N"],["","","","",""]],
    "clues": {
      "across": [{"number": 1, "clue": "To gain knowledge", "answer": "LEARN", "row": 0, "col": 0}],
      "down": []
    }
  }
  `;

  try {
    const { output } = await ai.generate({
        prompt,
        output: { schema: CrosswordPuzzleSchema },
        config: { temperature: 0.8, maxOutputTokens: 4096 },
    });
    
    if (!output) {
      throw new Error('AI response did not return any parsable output.');
    }
    
    // Fallback in case AI still forgets the down property.
    if (!output.clues.down) {
        output.clues.down = [];
    }

    return output;

  } catch (error) {
    console.error("Error in generateCrosswordAction:", error);
    // Re-throw the error so the client-side can handle it
    throw error;
  }
}

