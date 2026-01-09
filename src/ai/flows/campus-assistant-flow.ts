
'use server';
/**
 * @fileOverview An AI assistant for the CampusConnect platform.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
// REMOVED: Firebase client-side imports that were causing the error.
// import { getFirestore, collection, query, where, getDocs, limit } from 'firebase/firestore';
// import { initializeFirebase } from '@/firebase';

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

// --- 2. DEFINE THE FLOW (REMOVED FIRESTORE LOGIC) ---
const campusAssistantFlow = ai.defineFlow(
  {
    name: 'campusAssistantFlow',
    inputSchema: CampusAssistantInputSchema,
    outputSchema: CampusAssistantOutputSchema,
  },
  async (input) => {
    // The Firestore logic to fetch a context document has been removed 
    // to fix the server/client boundary error.
    const contextDocument = '';
    const isStudent = input.role === 'Student';
    
    const historyText = (input.history || []).map(m => `${m.role}: ${m.content}`).join('\n');
    const prompt = `
      You are **CampusBot**, the intelligent AI assistant for the **CampusConnect** school management platform.
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
      ` : `
      #### 2. 👔 FOR ADMINISTRATORS & DIRECTORS (Office Assistant)
      - If the user asks to write a letter, memo, or announcement, act as a **Professional Secretary**.
      - Draft professional documents. Ask for details if needed (e.g., "Who is this letter for?").
      - **Example:** "Draft a letter to parents about a holiday" -> Write a formal letter.
      `}
  
      #### 3. 🧭 APP NAVIGATION (For Everyone)
      - Guide users on how to use CampusConnect.
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
      
      CampusBot Response:
    `;

    const response = await ai.generate({
        model: 'googleai/gemini-3-flash-preview',
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
  }
);

// --- 3. EXPORT THE ACTION ---
export async function campusAssistant(input: CampusAssistantInput): Promise<CampusAssistantOutput> {
  return campusAssistantFlow(input);
}
