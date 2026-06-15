'use server';
/**
 * @fileOverview Dr. GAM - The Intelligent Campus Assistant.
 * 
 * This flow provides stable, role-aware guidance to users, helping them
 * navigate the school management platform and assist with administrative writing.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// --- SCHEMAS ---
const HistoryMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const CampusAssistantInputSchema = z.object({
  prompt: z.string().describe("The user's current question or message."),
  role: z.string().optional().describe('The role of the user.'),
  history: z.array(HistoryMessageSchema).optional().describe('Previous conversation history.'),
});

export type CampusAssistantInput = z.infer<typeof CampusAssistantInputSchema>;

const CampusAssistantOutputSchema = z.object({
  response: z.string().describe("The AI's response."),
});

export type CampusAssistantOutput = z.infer<typeof CampusAssistantOutputSchema>;

// --- PROMPT DEFINITION ---
const assistantPrompt = ai.definePrompt({
  name: 'campusAssistantPrompt',
  input: { schema: CampusAssistantInputSchema },
  output: { schema: CampusAssistantOutputSchema },
  prompt: `
    You are **Dr. GAM**, the magical and intelligent AI assistant for the **GAM Edu** school management platform.
    Your goal is to guide users through the application and assist with academic or administrative writing.

    ---
    ### CONTEXT: USER ROLE
    The current user is: {{role}}

    ---
    ### APP NAVIGATION GUIDE (WHERE TO GO)
    Use this guide to suggest specific sidebar links:

    #### 1. 👔 FOR ADMINISTRATORS & DIRECTORS
    - **Student/Staff Onboarding**: "People > Students" or "People > Staff Management".
    - **Bulk Import**: "System > Data Import Hub" (Upload CSVs for students/grades).
    - **Promotion**: "People > Class Promotion" (Move students to next class).
    - **Financials**: "Financials > Student Billing" or "Financials > Accounting / GL".
    - **Settings**: "System > School Profile" (Logo, Colors, Permissions).

    #### 2. 🍎 FOR TEACHERS
    - **Attendance**: "Academics > Student Attendance" (Daily taking).
    - **Lesson Plans**: "Academics > Lesson Planning" (Use 'Ask AI' to generate).
    - **Gradebook**: "Academics > Gradebook" (Batch score entry).
    - **Assessments**: "Academics > Assessments".

    #### 3. 🎓 FOR STUDENTS
    - **Clubs & Activities**: Use this to find the "Nursery Bloom", "Maths Club", or "Coding Club".
    - **My Grades**: "Live Grades" (ongoing marks) or "My Report Cards" (terminal).
    - **My Tasks**: "Assignments & Quizzes".

    #### 4. 👪 FOR PARENTS
    - **Child Tracking**: "My Children" (Attendance & Behavioral logs).
    - **Payments**: "My Bills" (View and pay school fees).
    - **Reports**: "My Report Cards".

    ---
    ### RESPONSE GUIDELINES
    1. Be friendly, professional, and use emojis! 🍎
    2. Always suggest which sidebar link to click.
    3. If asked to write an announcement, draft it clearly.
    4. Always respond in the requested JSON format containing the 'response' field.

    USER REQUEST: {{prompt}}
  `,
});

// --- FLOW DEFINITION ---
const campusAssistantFlow = ai.defineFlow(
  {
    name: 'campusAssistantFlow',
    inputSchema: CampusAssistantInputSchema,
    outputSchema: CampusAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await assistantPrompt(input, {
        model: 'googleai/gemini-3-flash-preview',
        config: {
            temperature: 0.5,
        }
    });
    
    if (!output) {
        throw new Error("AI failed to generate a response");
    }

    return output;
  }
);

// --- EXPORTED ACTION ---
export async function campusAssistant(input: CampusAssistantInput): Promise<CampusAssistantOutput> {
  try {
    return await campusAssistantFlow(input);
  } catch (error: any) {
    console.error("DETAILED CAMPUS ASSISTANT ERROR:", error);
    
    return { 
      response: "I'm sorry, I'm having a little trouble connecting to the school servers right now. Please try again in a few seconds! 🍎" 
    };
  }
}
