'use server';
/**
 * @fileOverview An AI assistant for the GAM Edu platform.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define History Schema
const HistoryMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

// Input Schema
const CampusAssistantInputSchema = z.object({
  prompt: z.string().describe("The user's current question or message."),
  role: z.string().optional().describe('The role of the user (Student, Teacher, Administrator).'),
  history: z.array(HistoryMessageSchema).optional().describe('The previous conversation history.'),
  contextDocument: z.string().optional(),
});

export type CampusAssistantInput = z.infer<typeof CampusAssistantInputSchema>;

// Output Schema
const CampusAssistantOutputSchema = z.object({
  response: z.string().describe("The AI's response to the user."),
});

export type CampusAssistantOutput = z.infer<typeof CampusAssistantOutputSchema>;

// --- EXPORT THE ACTION ---
export async function campusAssistant(input: CampusAssistantInput): Promise<CampusAssistantOutput> {
    const historyText = (input.history || []).map(m => `${m.role}: ${m.content}`).join('\n');
    const isStudent = input.role === 'Student';
    const isTeacher = input.role === 'Teacher';
    
    const prompt = `
      You are **GAM Edu Assistant**, the intelligent AI assistant for the **GAM Edu** school management platform.
      Your goal is to be helpful, polite, and efficient. You must adapt your personality based on the user's request.
  
      ---
      ### CONTEXT: USER ROLE
      The current user is identified as: ${input.role || 'Unknown'}
  
      ---
      ### YOUR CAPABILITIES & INSTRUCTIONS
      ${ isStudent ? `
      #### 1. 🎓 FOR STUDENTS (Study Helper)
      - If the user asks about an academic topic, act as a **Tutor**.
      - Explain concepts simply (e.g., "Explain living cells"). Use analogies.
      - Quiz them if they ask for practice.
      - **Example:** If asked "Explain living cells", provide a clear biology explanation, not app support.
      ` : isTeacher ? `
      #### 2. 🍎 FOR TEACHERS (Curriculum Assistant)
      - If asked about **Lesson Planning**, act as an **Expert Curriculum Designer**.
      - Suggest specific, measurable learning objectives using Bloom's Taxonomy.
      - Provide creative activity ideas for specific topics (e.g. "Suggest a JHS 1 Science activity for photosynthesis").
      - Remind them that they can use the "Ask AI" button in the "Lesson Planning" section to automatically fill out their forms.
      - Draft professional emails or messages to parents.
      ` : `
      #### 2. 👔 FOR ADMINISTRATORS & DIRECTORS (Office Assistant)
      - If the user asks to write a letter, memo, or announcement, act as a **Professional Secretary**.
      - Draft professional documents. Ask for details if needed (e.g., "Who is this letter for?").
      - **Example:** "Draft a letter to parents about a holiday" -> Write a formal letter.
      `}
  
      #### 3. 🧭 APP NAVIGATION (For Everyone)
      - Guide users on how to use GAM Edu.
      - **Academics:** Mention the "Math Club", "Science Lab", and "ELA Club" for practice.
      - **Lesson Plans:** Tell Teachers they can create plans in the "Lesson Planning" tab.
      - **Materials:** Tell users they can find resources in "Learning Materials".
      - **Attendance:** Explain that attendance is taken in the Class Dashboard.
  
      ---
      ### CONVERSATION HISTORY
      (Use this to remember what the user just said)
      ${historyText}
      
      ---
      ### CURRENT REQUEST
      User: ${input.prompt}
      
      GAM Edu Assistant Response:
    `;

    try {
        const response = await ai.generate({
            model: 'googleai/gemini-1.5-flash',
            prompt: prompt,
            config: {
                temperature: 0.7
            }
        });

        const responseText = response.text;
        
        if (!responseText) {
            throw new Error("Failed to generate response");
        }

        return { response: responseText };

    } catch (error: any) {
        console.error("Campus Assistant Flow Error:", error);
        // Provide a user-friendly error message in the response
        return { response: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." };
    }
}
