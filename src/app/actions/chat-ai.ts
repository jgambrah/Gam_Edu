
'use server';

import { ai } from '@/ai/genkit';
import { checkAndSpendCredits } from './credits';

export async function chatAIAction(schoolId: string, message: string) {
  // 1. Check Credits
  // If schoolId is missing (e.g. testing), we skip credit check or fail.
  if (schoolId) {
      const creditRes = await checkAndSpendCredits(schoolId, 1);
      if (!creditRes.success) return { success: false, text: "Not enough AI credits. Please contact your administrator." };
  }

  try {
    // 2. Direct Generation
    // using 'googleai/gemini-1.5-flash' which is the standard identifier
    const response = await ai.generate({
      model: 'googleai/gemini-1.5-flash', 
      prompt: `
        You are a helpful, friendly AI Tutor for students and teachers.
        Keep answers concise, encouraging, and educational.
        
        User Question: ${message}
      `,
      config: {
        temperature: 0.7, // Creativity balance
      }
    });

    return { success: true, text: response.text };

  } catch (e: any) {
    console.error("AI Chat Error:", e);
    // Return the actual error message so we can see it in the UI if needed
    return { success: false, text: `AI Service Error: ${e.message}` };
  }
}
