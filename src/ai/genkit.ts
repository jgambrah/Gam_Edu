import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
      apiVersion: 'v1', // Force the stable v1 API
    }),
  ],
  // Use the model recommended for speed and quality
  model: 'googleai/gemini-1.5-flash', 
});
