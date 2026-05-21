
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({ 
      // Manually map your key name here
      apiKey: process.env.GEMINI_API_KEY 
    })
  ],
  model: 'googleai/gemini-1.5-flash',
});
