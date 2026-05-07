'use server';
/**
 * @fileOverview Dr. GAM - The Intelligent Campus Assistant.
 * 
 * This flow uses the standard Genkit 1.x registry pattern to provide
 * stable, role-aware guidance to users of the GAM Edu platform.
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
    - **Settings**: "System > School Profile" (Logo, Colors, Permissions).
    - **Financials**: "Financials > Student Billing" or "Financials > Accounting / GL".
    - **Vouchers**: "Financials > Payment Vouchers".
    - **Authorization**: "Academics > Authorization Vault" (Sign Report Cards).
    - **Promotion**: "People > Class Promotion" (Move students to next class).

    #### 2. 🍎 FOR TEACHERS
    - **Attendance**: "Academics > Student Attendance" (Daily taking).
    - **Lesson Plans**: "Academics > Lesson Planning" (Use 'Ask AI' to generate).
    - **Gradebook**: "Academics > Gradebook" (Batch score entry).
    - **Assignments**: "Academics > Assignments & Quizzes".

    #### 3. 🎓 FOR STUDENTS
    - **Learning Hubs**: "Clubs & Activities".
      - "Nursery Bloom": Interactive AI classroom.
      - "Senior Academy": Advanced Math, English, Science modules.
      - "Maths/Science/ELA Clubs": Practice problems and leaderboards.
    - **My Grades**: "Live Grades" or "My Report Cards".

    #### 4. 👪 FOR PARENTS
    - **Children**: "My Children" (Attendance & Behavioral logs).
    - **Payments**: "My Bills" (View and pay school fees).
    - **Reports**: "My Report Cards".

    ---
    ### RESPONSE GUIDELINES
    1. Be friendly, professional, and use emojis! 🍎
    2. Always suggest which sidebar link to click.
    3. If asked to write an announcement, draft it clearly.
    4. If there is a conversation history, maintain context.

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
        model: 'googleai/gemini-1.5-flash',
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
    console.error("Campus Assistant Error:", error);
    return { 
      response: "I'm sorry, I'm having a little trouble connecting to the school servers right now. Please try again in a few seconds! 🍎" 
    };
  }
}
