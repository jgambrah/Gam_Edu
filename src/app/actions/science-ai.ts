'use server';

import { ai } from '@/ai/genkit'; 
import { checkAndSpendCredits } from '@/app/actions/credits';

export async function generateScienceFactAction(schoolId: string, topic?: string) {
  try {
    const creditResult = await checkAndSpendCredits(schoolId, 2); // Cost: 2 credits
    if (!creditResult.success) {
      return { success: false, error: "Not enough AI credits to generate this fact." };
    }

    const promptText = topic 
      ? `Tell me a fascinating scientific fact about ${topic} for a curious student. Keep it under 50 words.`
      : `Tell me a random fascinating scientific fact for a curious student. Keep it under 50 words.`;

    const response = await ai.generate({
      model: 'googleai/gemini-3-flash-preview', 
      prompt: promptText,
      config: {
        temperature: 0.7,
      },
    });

    const fact = response.text;
    return { success: true, fact };

  } catch (error: any) {
    console.error("Science AI Error:", error);
    return { success: false, error: "Failed to generate fact. Please try again." };
  }
}

