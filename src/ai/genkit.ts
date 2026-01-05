
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
      apiVersion: 'v1beta', // Explicitly set the API version
    }),
  ],
  // Use a stable and supported model that works with v1beta
  model: 'googleai/gemini-1.5-flash-preview-0514', 
});
