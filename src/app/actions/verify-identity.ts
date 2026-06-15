'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const IdentitySchema = z.object({
  isMatch: z.boolean().describe("True if the two photos are of the same person, False otherwise."),
  confidence: z.string().describe("A brief explanation of why they match or do not match.")
});

export async function verifyStaffIdentityAction(profilePicBase64: string, liveSelfieBase64: string) {
  try {
    // Strip the "data:image/jpeg;base64," prefix if present for robust processing
    const cleanProfilePic = profilePicBase64.includes(',') ? profilePicBase64.split(',')[1] : profilePicBase64;
    const cleanLiveSelfie = liveSelfieBase64.includes(',') ? liveSelfieBase64.split(',')[1] : liveSelfieBase64;

    const { output } = await ai.generate({
      model: 'googleai/gemini-3-flash-preview',
      prompt: [
        { text: "You are an HR security assistant. Compare Image 1 (Official Profile) and Image 2 (Live Selfie). Are they the exact same person? Focus on facial features. Ignore lighting or clothing differences." },
        { media: { url: `data:image/jpeg;base64,${cleanProfilePic}` } },
        { media: { url: `data:image/jpeg;base64,${cleanLiveSelfie}` } }
      ],
      output: { schema: IdentitySchema },
      config: { temperature: 0.1 } // Low temp for strict comparison
    });

    if (!output) throw new Error("AI did not return a valid response.");

    return { success: true, data: output };
  } catch (error: any) {
    console.error("AI Vision Error:", error);
    return { success: false, error: "AI comparison failed." };
  }
}
