
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// --- ACTION 1: INTERPRETER ---
// Acts as a Python/JS runtime simulator
export async function interpretBlockCodeAction(blocks: string[]) {
  try {
    // FIX: Convert the "[NEWLINE]" token into an actual line break (\n)
    // and join other blocks with spaces.
    const codeString = blocks.map(b => b === '[NEWLINE]' ? '\n' : b).join(' ');
    
    const prompt = `
      Act as a strict Python Code Interpreter.
      
      INPUT CODE:
      ${codeString}
      
      INSTRUCTIONS:
      1. Simulate the execution of this code.
      2. Return ONLY the console output.
      3. If there is a syntax error, return "Error: [Reason]".
      4. Handle indentation automatically if logical structures (if/else/def) are detected.
    `;

    const response = await ai.generate({
      prompt: prompt,
      config: { temperature: 0 },
    });

    return { success: true, output: response.text.trim() };
  } catch (error: any) {
    return { success: false, output: "System Error: " + error.message };
  }
}

// --- ACTION 2: CODE COACH ---
// Helps the student if they get stuck
export async function getCodeCoachResponseAction(input: {
    currentBlocks: string[],
    availableBlocks: string[],
    userQuestion?: string,
    missionTitle: string
}) {
  try {
    const prompt = `
      You are "Code Coach", a friendly programming tutor for kids (ages 10-14).
      
      CURRENT MISSION: ${input.missionTitle}
      
      STUDENT'S CURRENT BLOCKS:
      ${input.currentBlocks.join(' ')}
      
      AVAILABLE BLOCKS:
      ${input.availableBlocks.join(', ')}
      
      STUDENT'S QUESTION:
      "${input.userQuestion || "I am stuck, please give me a hint."}"
      
      INSTRUCTIONS:
      1. Compare their current blocks to the available blocks.
      2. Give a helpful hint about what piece goes next or what logic is missing.
      3. Do NOT give the exact answer directly. Guide them.
      4. Keep it short (2 sentences max).
      5. Be encouraging!
    `;

    const response = await ai.generate({
      prompt: prompt,
      config: { temperature: 0.5 },
    });

    return { success: true, text: response.text };
  } catch (error: any) {
    return { success: false, text: "I'm having trouble seeing your board right now. Try again!" };
  }
}

// --- ACTION 3: CONCEPT EXPLAINER ---
export async function explainCodingConceptAction(concept: string) {
  try {
    const prompt = `
      Explain the coding concept: "${concept}".
      Target Audience: 10-year-old student.
      Metaphor: Use a real-world analogy (like cooking, lego, traffic).
      Length: Max 3 sentences.
    `;

    const response = await ai.generate({
      prompt: prompt,
    });

    return { success: true, text: response.text };
  } catch (error: any) {
    return { success: false, text: "Unable to explain concept." };
  }
}
