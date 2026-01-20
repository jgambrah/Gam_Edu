
'use server';

import { ai } from '@/ai/genkit';

export async function generateSMSDraftAction(topic: string, tone: 'formal' | 'urgent' | 'friendly') {
  try {
    const prompt = `
      Write a short SMS message for a school sending to parents.
      Topic: "${topic}"
      Tone: ${tone}
      Constraint: Keep it under 160 characters if possible.
      Format: Just the message text, no quotes.
    `;

    const response = await ai.generate({
      model: 'googleai/gemini-2.5-flash', // Use your verified model string
      prompt: prompt,
      config: { temperature: 0.7 }
    });

    return { success: true, text: response.text };
  } catch (error) {
    console.error("AI SMS Error:", error);
    return { success: false, error: "Failed to generate draft." };
  }
}
