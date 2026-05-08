
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { checkAndSpendCredits } from '@/app/actions/credits';

const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })),
  message: z.string(),
  userId: z.string(),
  schoolId: z.string(),
});

export async function chatWithAiTutor(input: z.infer<typeof ChatInputSchema>) {
  try {
    const creditResult = await checkAndSpendCredits(input.schoolId, 1);
    if (!creditResult.success) {
      return { success: false, text: creditResult.error || "You are out of AI Sparks.", error: creditResult.error };
    }

    const historyText = input.history
      .map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
      .join('\n');
    
    const prompt = `
      You are an expert, friendly AI Tutor for Junior High School students.
      
      ### CORE INSTRUCTIONS:
      1. **Narrow Down First (CRITICAL):**
         - If the user mentions a BROAD subject (e.g., "Science", "Math", "English", "History"), **do NOT** start teaching a specific concept (like Cells or Algebra) yet.
         - Instead, ask them which **Branch** or **Topic** they want to focus on.
         - *Bad Example:* User: "Science" -> AI: "Let's talk about Cells!" (Too specific).
         - *Good Example:* User: "Science" -> AI: "Awesome! Do you want to look at Biology, Chemistry, Physics, or something else?"

      2. **Analyze the Flow:** 
         - Look at the "PREVIOUS CONVERSATION". 
         - If the user is answering a question you just asked, accept the answer and move forward.
         - If the user gives a short answer (e.g. "Yes"), check the context before resetting.

      3. **Socratic Method (Once Topic is Chosen):**
         - ONLY once a specific topic is confirmed (e.g. "Biology" or "Atoms"), start asking guiding questions to test their knowledge.
         - Build on what they say.

      4. **Tone:**
         - Encouraging, patient, and concise (max 3 sentences).

      ### PREVIOUS CONVERSATION:
      ${historyText}

      ### STUDENT'S NEW MESSAGE:
      ${input.message}

      ### YOUR RESPONSE (As Tutor):
    `;

    const response = await ai.generate({
      model: 'googleai/gemini-3-flash-preview',
      prompt: prompt,
      config: { 
        temperature: 0.3, 
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
