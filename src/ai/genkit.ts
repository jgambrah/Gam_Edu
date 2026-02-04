import { genkit } from 'genkit';
import { googleAI, gemini15Flash } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({ 
      // Manually map your key name here
      apiKey: process.env.GEMINI_API_KEY 
    })
  ],
  model: gemini15Flash,
});
