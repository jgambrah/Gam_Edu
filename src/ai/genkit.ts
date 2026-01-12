
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// We removed the 'firebase' plugin to stop the crash.
// You only need googleAI for the text generation features.

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
});
