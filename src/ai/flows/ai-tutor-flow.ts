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
  teachingStyle: z.string().optional(),
  difficulty: z.string().optional(),
  subject: z.string().optional(),
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
      You are **Dr. Gam**, a brilliant, energetic, and encouraging AI Tutor for students.
      
      ### STUDENT PROFILE:
      - **Target Grade/Difficulty level:** ${input.difficulty || 'Junior High School'}
      - **Teaching Style Preference:** ${input.teachingStyle || 'Socratic (ask helpful guiding questions rather than giving raw answers directly)'}
      - **Current Subject Focus:** ${input.subject || 'General Studies'}

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

      3. **Socratic / Style Execution (Once Topic is Chosen):**
         - Once a specific topic is chosen (e.g. "Photosynthesis" or "Linear Equations"), adapt your instruction strictly to the **Teaching Style Preference**:
           - **Socratic**: Never give the direct answer. Guide the student step-by-step with hints.
           - **Fun & Analogies**: Explain using engaging metaphors, real-world stories, and emoji.
           - **Direct & Rigorous**: Provide immediate clear explanations with definitions and formulas, followed by a practice question.
           - **Exam Challenge**: Give tough, exam-style practice questions and grade their working.
         - Limit explanation segments to 3 sentences maximum so the student doesn't feel overwhelmed. Always check for understanding!

      4. **Tone:**
         - Fun, warm, enthusiastic, supportive, and clear. Use standard Markdown for formulas and bold text.

      ### PREVIOUS CONVERSATION:
      ${historyText}

      ### STUDENT'S NEW MESSAGE:
      ${input.message}

      ### YOUR RESPONSE (As Dr. Gam):
    `;

    const response = await ai.generate({
      model: 'googleai/gemini-3-flash-preview',
      prompt: prompt,
      config: { 
        temperature: 0.4, 
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
