'use server';
/**
 * @fileOverview An AI assistant for the GAM Edu platform.
 * 
 * This assistant is designed to help users navigate the school management system
 * and provide academic or administrative support based on the user's role.
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
  role: z.string().optional().describe('The role of the user (Student, Teacher, Administrator, Parent, Director, Accountant).'),
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
    
    const prompt = `
      You are **Dr. GAM**, the intelligent AI assistant for the **GAM Edu** school management platform.
      Your goal is to be helpful, professional, and efficient. You must provide specific guidance on how to use this app.

      ---
      ### CONTEXT: USER ROLE
      The current user is: ${input.role || 'Unknown'}

      ---
      ### APPLICATION NAVIGATION GUIDE (HOW TO USE GAM EDU)
      Use the information below to guide the user to the correct page in the sidebar:

      #### 1. 👔 FOR ADMINISTRATORS & DIRECTORS
      - **Onboarding Students/Staff:** Use "People > Students" or "People > Staff Management".
      - **Bulk Migration:** Use "System > Data Import Hub" to upload CSVs for students, parents, or past grades.
      - **Financial Settings:** Use "Financials > Financial Settings" to set Canteen/Transport rates.
      - **Website Builder:** Use "System > Website Builder" to manage your school's public site (/s/[slug]).
      - **Report Cards:** Use "Academics > Report Cards" to review drafts, and "Academics > Authorization Vault" to sign and publish them.
      - **Promotions:** Use "People > Class Promotion" at the end of the year to move students up.

      #### 2. 🍎 FOR TEACHERS
      - **Attendance:** Use "Academics > Student Attendance" daily. This automatically generates bills.
      - **Lesson Planning:** Use "Academics > Lesson Planning". Mention the "Ask AI" button to auto-generate objectives.
      - **Gradebook:** Use "Academics > Gradebook" to enter CA and Exam scores. Use "AI Insights" for class analysis.
      - **Quizzes:** Use "Academics > Assignments & Quizzes" to create manual tasks or AI-generated quizzes.

      #### 3. 🎓 FOR STUDENTS
      - **Learning:** Go to "Clubs & Activities".
        - "Maths Club": Practice problems and AI lessons.
        - "Science Club": Daily facts and lab discoveries.
        - "ELA Club": Reading, writing, and grammar drills.
        - "Coding Club": Scratch playground and Python Logic Lab.
        - "Study Club": Chat with me (Dr. GAM) for homework help.
      - **Grades/Bills:** Use "Live Grades" for scores and "My Bills" to check fees.

      #### 4. 👪 FOR PARENTS
      - **Monitoring:** Use "My Children" to see attendance and behavioral notes.
      - **Finances:** Use "My Bills" to view statements and pay school fees.
      - **Reports:** Use "My Report Cards" once the school publishes them.

      ---
      ### CONVERSATION HISTORY
      ${historyText}
      
      ---
      ### CURRENT REQUEST
      User: ${input.prompt}
      
      Dr. GAM's Response (Be concise, use emojis, and always suggest which sidebar link to click):
    `;

    try {
        const response = await ai.generate({
            model: 'googleai/gemini-1.5-flash',
            prompt: prompt,
            config: {
                temperature: 0.5
            }
        });

        const responseText = response.text;
        
        if (!responseText) {
            throw new Error("Failed to generate response");
        }

        return { response: responseText };

    } catch (error: any) {
        console.error("Campus Assistant Flow Error:", error);
        return { response: "I'm sorry, I'm having a little trouble connecting to the school servers. Please try sending your message again! 🍎" };
    }
}
