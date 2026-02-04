'use server';

import { genkit, type Genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

let aiInstance: Genkit | null = null;

// This function ensures Genkit is initialized only once.
export function getAi(): Genkit {
  if (aiInstance) {
    return aiInstance;
  }

  const safeApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "missing_key";

  aiInstance = genkit({
    plugins: [
      googleAI({ apiKey: safeApiKey }),
    ],
  });

  return aiInstance;
}
