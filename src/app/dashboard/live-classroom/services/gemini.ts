
'use server';

import { ai } from '@/ai/genkit';
import { GoogleGenAI } from '@google/genai';

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

/**
 * Generates an ephemeral auth token using the backend GEMINI_API_KEY.
 * This token is used on the client-side to connect securely without referrer restriction issues.
 */
export const createLiveAuthToken = async (): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }
  const aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      apiVersion: 'v1alpha'
    }
  });
  
  const token = await aiClient.authTokens.create({
    config: {
      uses: 1, // Only allowed for 1 connection
    }
  });
  
  if (!token.name) {
    throw new Error("Failed to generate ephemeral token");
  }
  return token.name;
};
