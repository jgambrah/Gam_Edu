
'use client';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export async function generateLessonImage(prompt: string): Promise<string> {
    const seed = prompt.split("").reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    return `https://picsum.photos/seed/${Math.abs(seed)}/400/400`;
}

export async function generateTTS(text: string, voice: string = 'Kore'): Promise<string | null> {
    console.log(`TTS requested for: "${text}" with voice: ${voice}`);
    return null;
}

export async function generateRhyme(topic: string): Promise<string> {
    return `A rhyme about a ${topic}, would be so very epic.`;
}

export async function generateSongVideo(topic: string): Promise<string> {
    return "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4";
}

const artDetailsSchema = z.object({
  description: z.string(),
  prompt: z.string().optional(),
  parts: z.array(z.string()).optional(),
});

export async function generateArtDetails(topic: string, type: 'shapes' | 'textures') {
    try {
        const { output } = await ai.generate({
            prompt: `Generate a nursery-level description for the art topic "${topic}". If it's a shape, list its parts. If it's a texture, describe how it feels. Provide a simple image prompt.
            
            JSON format: 
            { 
              "description": string, 
              "prompt": string (for texture), 
              "parts": [string] (for shape) 
            }`,
            output: { schema: artDetailsSchema }
        });
        return output;
    } catch(e) {
        console.error(e);
        return null;
    }
}

export async function generateNumeracyTask(prompt: string, schema: any) {
     try {
        const { output } = await ai.generate({ prompt, output: { schema } });
        return output;
    } catch(e) {
        console.error(e);
        return null;
    }
}
