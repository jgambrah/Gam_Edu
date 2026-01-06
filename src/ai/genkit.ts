
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  // ✅ CORRECT: Use Gemini 3 Flash for core logic, text generation, and practice problems
  model: 'googleai/gemini-3-flash-preview',
});
