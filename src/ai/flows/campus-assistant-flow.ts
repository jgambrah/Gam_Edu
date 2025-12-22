
'use server';
/**
 * @fileOverview An AI assistant for the CampusConnect platform.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getFirestore, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

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
});

export type CampusAssistantInput = z.infer<typeof CampusAssistantInputSchema>;

// Output Schema
const CampusAssistantOutputSchema = z.object({
  response: z.string().describe("The AI's response to the user."),
});

export type CampusAssistantOutput = z.infer<typeof CampusAssistantOutputSchema>;

// --- 1. DEFINE THE INTELLIGENT PROMPT ---
const promptTemplate = `
    You are **CampusBot**, the intelligent AI assistant for the **CampusConnect** school management platform.
    Your goal is to be helpful, polite, and efficient. You must adapt your personality based on the user's request.

    ---
    ### CONTEXT: USER ROLE
    The current user is identified as: {{{role}}}

    ---
    ### YOUR CAPABILITIES & INSTRUCTIONS

    #### 1. 🎓 FOR STUDENTS (Study Helper)
    - If the user asks about an academic topic, act as a **Tutor**.
    {{#if contextDocument}}
    - **Use the provided 'CONTEXT DOCUMENT' as your primary source of truth.** Explain the concepts based on these notes.
    - Explain concepts simply. Use analogies. Quiz them if they ask for practice.
    
    CONTEXT DOCUMENT:
    ---
    {{{contextDocument}}}
    ---
    {{else}}
    - Explain concepts simply (e.g., "Explain living cells"). Use analogies.
    - Quiz them if they ask for practice.
    - **Example:** If asked "Explain living cells", provide a clear biology explanation, not app support.
    {{/if}}

    #### 2. 👔 FOR ADMINISTRATORS & DIRECTORS (Office Assistant)
    - If the user asks to write a letter, memo, or announcement, act as a **Professional Secretary**.
    - Draft professional documents. Ask for details if needed (e.g., "Who is this letter for?").
    - **Example:** "Draft a letter to parents about a holiday" -> Write a formal letter.

    #### 3. 🧭 APP NAVIGATION (For Everyone)
    - Guide users on how to use CampusConnect.
    - **Academics:** Mention the "Math Club", "Science Lab", and "ELA Club" for practice.
    - **Lesson Plans:** Tell Teachers they can create plans in the "Lesson Planning" tab.
    - **Materials:** Tell users they can find resources in "Learning Materials".
    - **Attendance:** Explain that attendance is taken in the Class Dashboard.

    ---
    ### CONVERSATION HISTORY
    (Use this to remember what the user just said)
    {{#each history}}
      {{role}}: {{content}}
    {{/each}}
    
    ---
    ### CURRENT REQUEST
    User: {{prompt}}
    
    CampusBot Response:
  `;

// --- 2. DEFINE THE FLOW ---
const campusAssistantFlow = ai.defineFlow(
  {
    name: 'campusAssistantFlow',
    inputSchema: CampusAssistantInputSchema,
    outputSchema: CampusAssistantOutputSchema,
  },
  async (input) => {
    let contextDocument = '';
    const isStudent = input.role === 'Student';
    const isAcademicQuery = ['explain', 'what is', 'tell me about', 'who is', 'define'].some(keyword => input.prompt.toLowerCase().includes(keyword));

    if (isStudent && isAcademicQuery) {
        try {
            const { firestore } = initializeFirebase()!;
            if (firestore) {
                // Extract keywords from prompt (simple version)
                const keywords = input.prompt.toLowerCase().replace(/what|is|a|an|the|of|explain|about/g, '').trim().split(' ');
                
                // Search for learning materials that match the keywords
                const q = query(collection(firestore, 'learning_materials'), where('topicTitle', '>=', keywords[0]), where('topicTitle', '<=', keywords[0] + '\uf8ff'), limit(1));
                
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const docData = querySnapshot.docs[0].data();
                    contextDocument = docData.content || '';
                    console.log(`[CampusBot] Found context document for topic: ${docData.topicTitle}`);
                }
            }
        } catch (error) {
            console.error("[CampusBot] Error fetching context document:", error);
        }
    }

    const compiledPrompt = ai.definePrompt({
      name: 'campusAssistantPrompt',
      prompt: promptTemplate,
    });

    const { output } = await compiledPrompt({
      ...input,
      role: input.role || 'Unknown',
      history: input.history || [],
      contextDocument: contextDocument,
    });
    
    if (!output) {
      throw new Error("Failed to generate response");
    }

    return { response: output.response as string };
  }
);

// --- 3. EXPORT THE ACTION ---
export async function campusAssistant(input: CampusAssistantInput): Promise<CampusAssistantOutput> {
  return campusAssistantFlow(input);
}
