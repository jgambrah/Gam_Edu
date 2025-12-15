'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// --- ACTION 1: INTERPRETER ---
export async function interpretBlockCodeAction(blocks: string[]) {
  try {
    // STEP 1: Turn blocks into a string
    let codeString = blocks.map(b => b === '[NEWLINE]' ? '\n' : b).join(' ');

    // STEP 2: THE FIX - Remove spaces immediately after a new line
    // This turns "\n print" into "\nprint" so Python doesn't crash on IndentationError
    codeString = codeString.replace(/\n\s+/g, '\n');

    const prompt = `
      Act as a specific Python Runtime Simulator for a logic puzzle game.

      RAW CODE:
      ${codeString}

      RULES FOR EXECUTION:
      1. **Sanitize First:** If the code looks messy (e.g. "name=input..."), assume valid Python spacing internally.
      2. **Handle input():** 
         - The user cannot type. You must SIMULATE the user's input.
         - Print the prompt string exactly as written.
         - Then, on the same line (or next, depending on print behavior), output a GENERIC value (like "UserValue" or "10").
         - DO NOT use names like "Alice" or "Bob".
      3. **Output format:** Return *only* the final terminal output.

      SCENARIO TEST:
      Code:
      name = input('Hello: ')
      print(name)

      Expected Output:
      Hello: UserValue
      UserValue
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
