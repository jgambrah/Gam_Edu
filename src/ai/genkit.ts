import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// We wrap the API key check to ensure it never returns "undefined" to the plugin
const safeApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "missing_key";

export const ai = genkit({
  plugins: [
    googleAI({ apiKey: safeApiKey }),
  ],
});
