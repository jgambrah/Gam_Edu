
'use server';

import { ai } from '@/ai/genkit';
import { checkAndSpendCredits } from './credits';

export async function chatAIAction(schoolId: string, message: string) {
  if (schoolId) {
      const creditRes = await checkAndSpendCredits(schoolId, 1);
      if (!creditRes.success) return { success: false, text: "Not enough AI credits." };
  }

  try {
    const response = await ai.generate({
      // FAILSAFE MODEL: Gemini 1.0 Pro
      // This is the most stable string available
      model: 'googleai/gemini-3-flash-preview', 
      prompt: `You are a helpful AI Tutor. User: ${message}`,
      config: { temperature: 0.7 }
    });

    return { success: true, text: response.text };

  } catch (e: any) {
    console.error("AI Chat Error:", e);
    // If this fails, we know it's a Key/Billing issue, not a model name issue.
    return { success: false, text: `AI Service Error: ${e.message}` };
  }
}
