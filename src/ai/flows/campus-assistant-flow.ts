
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

// --- 1. DEFINE THE INTELLIGENT PROMPT (UPGRADED) ---
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
    - **IMPORTANT: Use the provided 'CONTEXT DOCUMENT' as your SOLE and PRIMARY source of truth.** Do not use your general knowledge.
    - Explain the concepts based *only* on these notes. Quote them if necessary.
    - If the document is empty or doesn't answer the question, state that you couldn't find information in the provided learning materials and ask the user to clarify.
    
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

// --- 2. DEFINE THE FLOW (UPGRADED SEARCH LOGIC) ---
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
                // Extract keywords from prompt (simple version for now)
                const keywords = input.prompt.toLowerCase().replace(/what|is|a|an|the|of|explain|about/g, '').trim().split(' ');
                
                // More targeted query: looks for a topic title that CONTAINS the keyword
                const q = query(
                    collection(firestore, 'learning_materials'), 
                    where('courseId', '==', 'bs7-integrated-science'),
                    // This is a basic "contains" query in Firestore. For real full-text, you'd use Algolia/Typesense.
                    where('topicTitle', '>=', keywords[0]),
                    where('topicTitle', '<=', keywords[0] + '\uf8ff'),
                    limit(1)
                );
                
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const docData = querySnapshot.docs[0].data();
                    contextDocument = docData.content || ''; // Pass the full, detailed content
                    console.log(`[CampusBot] Found context document for topic: ${docData.topicTitle}`);
                } else {
                    console.log(`[CampusBot] No specific document found for query: "${keywords[0]}"`);
                }
            }
        } catch (error) {
            console.error("[CampusBot] Error fetching context document:", error);
            // Don't leak the error to the prompt, just log it.
        }
    }

    const compiledPrompt = ai.definePrompt({
      name: 'campusAssistantPrompt',
      prompt: promptTemplate,
      input: { schema: CampusAssistantInputSchema },
      output: { schema: CampusAssistantOutputSchema },
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
