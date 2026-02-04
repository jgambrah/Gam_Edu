'use server';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai'; 

export const ai = genkit({
  plugins: [
    googleAI({ 
      // This fallback string prevents the 500/refresh loop crash
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "no-key-found" 
    }),
  ],
});
