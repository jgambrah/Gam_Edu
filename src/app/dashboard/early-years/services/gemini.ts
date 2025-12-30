
'use client';

// This file is being deprecated. All AI logic is being moved to server actions
// in /src/ai/flows/ to prevent server-side modules from being bundled in the client.

import { generateTTSAction } from '@/ai/flows/junior-actions';

export async function generateLessonImage(prompt: string): Promise<string> {
    const seed = prompt.split("").reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    return `https://picsum.photos/seed/${Math.abs(seed)}/400/400`;
}

export async function generateTTS(text: string, voice: string = 'Kore'): Promise<string | null> {
    console.log(`TTS requested for: "${text}" with voice: ${voice}`);
    try {
        const result = await generateTTSAction({ text, voice: voice as any });
        if (result.success && result.data) {
            return result.data;
        }
        return null;
    } catch (e) {
        console.error("TTS generation failed in client-side helper:", e);
        return null;
    }
}

export async function generateRhyme(topic: string): Promise<string> {
    return `A rhyme about a ${topic}, would be so very epic.`;
}

export async function generateSongVideo(topic: string): Promise<string> {
    return "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4";
}
