
'use client';

import { generateTTSAction } from '@/ai/flows/junior-actions';

// This file is being deprecated. All AI logic is being moved to server actions
// in /src/ai/flows/ to prevent server-side modules from being bundled in the client.

export async function generateLessonImage(prompt: string): Promise<string> {
    const seed = prompt.split("").reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    return `https://picsum.photos/seed/${Math.abs(seed)}/400/400`;
}

// This function is now a wrapper around the server action for backward compatibility during refactor.
export async function generateTTS(text: string, voice: string = 'Kore'): Promise<string | null> {
    console.log(`TTS requested for: "${text}" with voice: ${voice}`);
    try {
        const result = await generateTTSAction({ text, voice: voice as any });
        if (result.success && result.data) {
            return result.data;
        }
        console.error("TTS generation failed in client-side helper:", result.error);
        return null;
    } catch (e) {
        console.error("TTS client-side helper error:", e);
        return null;
    }