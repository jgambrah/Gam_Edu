
'use server';

import { ai } from '@/ai/genkit'; // Import your configured instance

export async function generateScienceFactAction(topic?: string) {
  try {
    const promptText = topic 
      ? `Tell me a fascinating scientific fact about ${topic} for a curious student. Keep it under 50 words.`
      : `Tell me a random fascinating scientific fact for a curious student. Keep it under 50 words.`;

    // Direct generation call - No flows, no schemas, just text in, text out.
    const response = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest', 
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
