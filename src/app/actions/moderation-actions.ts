'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ModerationResultSchema = z.object({
  flagged: z.boolean(),
  flagType: z.enum(['safe', 'romantic', 'abusive', 'privacy_violation', 'harmful']),
  explanation: z.string().optional(),
  educationalMessage: z.string().optional(),
});

export async function moderateMessageAction(messageText: string) {
  try {
    const prompt = `
      You are an AI Safety Assistant for a school messaging platform. Your job is to moderate student direct messages.
      The messaging system must safeguard children by preventing abuse, cyberbullying, romantic/sexual advances, and ensuring privacy.
      
      Review this message: "${messageText}"
      
      Determine if it violates the safety guidelines:
      1. ROMANTIC / SEXUAL ADVANCES ('romantic'): confessing romantic interest, flirting, asking for dates, using romantic nicknames, sharing sexual content/innuendos. Romantic conversations between students are NOT allowed to prevent grooming and inappropriate relationships.
      2. ABUSIVE / BULLYING ('abusive'): hate speech, harassment, insults, slurs, threats, harsh profanity.
      3. PRIVACY VIOLATIONS ('privacy_violation'): requesting private personal credentials, home addresses, password sharing, or suspicious personal contact details exchange.
      4. HARMFUL ('harmful'): self-harm references, illegal substances, weapons, or illegal activities.
      5. SAFE ('safe'): casual conversations, schoolwork discussions, standard friendly chat, greetings, and general queries.
      
      For violations, generate:
      - 'explanation': a brief professional analysis explaining the rule violated.
      - 'educationalMessage': a student-friendly educational reminder that guides the student to rephrase their message constructively and maintain school decorum.
      
      Respond strictly in JSON.
    `;

    const { output } = await ai.generate({
      model: 'googleai/gemini-3-flash-preview',
      prompt: prompt,
      output: { schema: ModerationResultSchema },
      config: { temperature: 0.1 }
    });

    if (!output) {
      return { flagged: false, flagType: 'safe' as const };
    }

    return output;
  } catch (error) {
    console.error("AI Moderation Error:", error);
    // Fail safe for availability: do not block if AI fails, but log it
    return { flagged: false, flagType: 'safe' as const };
  }
}
