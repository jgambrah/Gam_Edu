'use server';
import { requireSignedInAction } from '@/lib/session-guard';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { checkAndSpendCredits } from '@/app/actions/credits';
import { buildTutorPrompt } from '@/lib/ai-tutor/prompt';

const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })),
  message: z.string(),
  userId: z.string(),
  schoolId: z.string(),
  teachingStyle: z.string().optional(),
  difficulty: z.string().optional(),
  subject: z.string().optional(),
});

export async function chatWithAiTutor(input: z.infer<typeof ChatInputSchema>) {
  await requireSignedInAction();
  try {
    const creditResult = await checkAndSpendCredits(input.schoolId, 1);
    if (!creditResult.success) {
      return { success: false, text: creditResult.error || "You are out of AI Sparks.", error: creditResult.error };
    }

    const prompt = buildTutorPrompt(input);

    const response = await ai.generate({
      model: 'googleai/gemini-3-flash-preview',
      prompt: prompt,
      config: { 
        maxOutputTokens: 1024,
      }, 
    });

    const text = response.text;
    
    return { success: true, text: text };

  } catch (error: any) {
    console.error("AI Tutor Error:", error);
    return { 
      success: false, 
      text: "I lost my train of thought. Let's try that again.",
      error: error.message 
    };
  }
}
