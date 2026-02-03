
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({ 
      // Ensure this matches your Vercel/Firebase Environment Variable name exactly!
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY 
    }),
  ],
});
