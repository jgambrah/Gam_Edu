'use client';

import { ai } from '@/ai/genkit';

/**
 * Generates an image using a Google AI model via Genkit.
 * @param prompt The text prompt to generate an image from.
 * @returns A promise that resolves to the data URL of the generated image or null.
 */
export const generateLessonImage = async (prompt: string): Promise<string | null> => {
  try {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `A cute, simple, flat 2D vector illustration for a classroom whiteboard about: ${prompt}`,
    });
    
    // The 'media' object contains the URL of the generated image.
    return media?.url || null;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
};
