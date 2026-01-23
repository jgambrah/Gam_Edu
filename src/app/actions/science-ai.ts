
'use server';

import { ai } from '@/ai/genkit'; 

export async function generateScienceFactAction(topic?: string) {
  try {
    const promptText = topic 
      ? `Tell me a fascinating scientific fact about ${topic} for a curious student. Keep it under 50 words.`
      : `Tell me a random fascinating scientific fact for a curious student. Keep it under 50 words.`;

    // 🔥 FIX: Reverted to the stable gemini-pro model
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
