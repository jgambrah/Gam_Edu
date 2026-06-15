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
      model: 'googleai/gemini-3-flash-preview', 
      prompt: `You are a helpful AI Tutor. User: ${message}`,
      config: { temperature: 0.7 }
    });

    return { success: true, text: response.text };

  } catch (e: any) {
    console.error("AI Chat Error:", e);
    return { success: false, text: `AI Service Error: ${e.message}` };
  }
}
