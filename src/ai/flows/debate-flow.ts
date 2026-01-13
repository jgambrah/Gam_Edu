'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { checkAndSpendCredits } from '@/app/actions/credits';

// --- SHARED TYPES ---
const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  text: z.string()
});

// --- ACTION 1: THE OPPONENT ---
const DebateInputSchema = z.object({
  topic: z.string(),
  history: z.array(MessageSchema),
  lastMessage: z.string(),
  schoolId: z.string(), // Added for credit check
});

export async function generateDebateResponse(input: z.infer<typeof DebateInputSchema>) {
  try {
    const creditResult = await checkAndSpendCredits(input.schoolId, 2);
    if (!creditResult.success) {
      return { success: false, text: "You are out of AI credits for this debate." };
    }

    const historyText = input.history
      .map(m => `${m.role === 'user' ? 'Debater' : 'Opponent'}: ${m.text}`)
      .join('\n');
    
    const prompt = `
      You are a skilled Debate Coach and Opponent.
      TOPIC: "${input.topic}"
      
      GOAL: Challenge the user's arguments logically. Play "Devil's Advocate".
      
      INSTRUCTIONS:
      1. Concise response (max 3 sentences).
      2. End with ONE probing question.
      3. Maintain context.
      
      HISTORY:
      ${historyText}
      
      USER ARGUMENT: "${input.lastMessage}"
      
      YOUR COUNTER:
    `;

    const response = await ai.generate({
      prompt: prompt,
      config: { temperature: 0.7 },
    });

    return { success: true, text: response.text };
  } catch (error: any) {
    return { success: false, text: "I lost my train of thought.", error: error.message };
  }
}

// --- ACTION 2: THE JUDGE (FIXED) ---
const EvaluationSchema = z.object({
  logicScore: z.number().describe("Score out of 10 for logical consistency"),
  clarityScore: z.number().describe("Score out of 10 for clarity of expression"),
  rebuttalScore: z.number().describe("Score out of 10 for ability to counter-argue"),
  feedback: z.string().describe("Constructive feedback on the user's performance"),
  keyStrength: z.string().describe("One specific thing the user did well"),
  areaForImprovement: z.string().describe("One specific thing to improve"),
});

export async function evaluateDebateAction(history: z.infer<typeof MessageSchema>[], schoolId: string) {
  try {
    const creditResult = await checkAndSpendCredits(schoolId, 2);
    if (!creditResult.success) {
      return { success: false, error: "Not enough AI credits to provide an evaluation." };
    }

    console.log("👨‍⚖️ Judge is reviewing history length:", history.length);

    // 1. Better Transcript Formatting
    const transcript = history.map(m => {
        const speaker = m.role === 'user' ? '[[STUDENT]]' : '[[OPPONENT]]';
        return `${speaker}: ${m.text}`;
    }).join('\n\n');

    console.log("📜 Transcript Preview:\n", transcript.substring(0, 200) + "...");

    const prompt = `
      Act as an impartial, expert Debate Judge.
      
      Your task is to evaluate the performance of the **[[STUDENT]]** in the following debate transcript.
      Ignore the performance of the [[OPPONENT]].
      
      TRANSCRIPT START:
      ${transcript}
      TRANSCRIPT END.
      
      CRITERIA:
      1. Logic: Did the STUDENT make coherent arguments?
      2. Clarity: Was the STUDENT's language clear?
      3. Rebuttal: Did the STUDENT actually answer the OPPONENT's questions?

      NOTE: If the student participated at all, do NOT give a score of 1. Be fair.
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      output: { schema: EvaluationSchema },
    });

    const data = output;
    if (!data) throw new Error("No evaluation returned");

    return { success: true, data };

  } catch (error: any) {
    console.error("Evaluation Error", error);
    return { success: false, error: error.message };
  }
}
