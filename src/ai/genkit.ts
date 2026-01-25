
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// CRITICAL: Create and export the ai instance FIRST
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-3-flash-preview',
});
