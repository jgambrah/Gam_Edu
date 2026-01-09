
import {genkit} from 'genkit';
import {googleAI, gemini15Flash} from '@genkit-ai/google-genai'; // Import the model reference
import { firebase } from '@genkit-ai/firebase';

// 1. Export the Model explicitly so other files use the exact same one
export const GEMINI_MODEL = gemini15Flash;

export const ai = genkit({
  plugins: [
    firebase(),
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
});
