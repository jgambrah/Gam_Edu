'use server';
import { ai } from '@/ai/genkit';
import { checkAndSpendCredits } from './credits';

export async function chatAIAction(schoolId: string, message: string) {
  // 1. Check Credits
  const creditRes = await checkAndSpendCredits(schoolId, 1);
  if (!creditRes.success) return { success: false, text: "Not enough AI credits." };

  try {
    // 2. Direct Generation (No Flows)
    const response = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest', // Verified working model
      prompt: `You are a helpful school tutor. Answer this: ${message}`,
    });
    return { success: true, text: response.text };
  } catch (e: any) {
    console.error(e);
    return { success: false, text: "AI Error: " + e.message };
  }
}
