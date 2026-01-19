
'use server';

import { ai } from '@/ai/genkit'; 

export async function generateScienceFactAction(topic?: string) {
  try {
    const promptText = topic 
      ? `Tell me a fascinating scientific fact about ${topic} for a curious student. Keep it under 50 words.`
      : `Tell me a random fascinating scientific fact for a curious student. Keep it under 50 words.`;

    // 🔥 FIX: Use a specific model version to avoid regional/alias issues
    const response = await ai.generate({
      model: 'googleai/gemini-1.5-flash-001', 
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
