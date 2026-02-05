
import { genkit } from 'genkit';
import { googleAI, gemini15Flash } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({ 
      // Manually map your key name here
      apiKey: process.env.GEMINI_API_KEY 
    })
  ],
  model: gemini15Flash,
});
