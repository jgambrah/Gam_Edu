
import {genkit} from 'genkit';
import {googleAI, gemini15Flash} from '@genkit-ai/google-genai'; // Import the model reference

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  // ✅ SAFEST OPTION: Gemini 1.5 Flash (Super cheap & fast)
  model: gemini15Flash, 
});
