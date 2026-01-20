
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { checkAndSpendCredits } from '@/app/actions/credits';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

// Helper to get schoolId from user
const formatPrivateKey = (key: string) => key.replace(/\\n/g, '\n').replace(/"/g, '');

function getAdminApp(): App {
  const existingApp = getApps().find(app => app.name === 'admin');
  if (existingApp) return existingApp;
  // ... rest of init logic
    const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKeyRaw) throw new Error("Missing Admin credentials.");
  const privateKey = formatPrivateKey(privateKeyRaw);
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) }, 'admin');
}


const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })),
  message: z.string(),
  userId: z.string(), // Added to find the user's school
});

export async function chatWithAiTutor(input: z.infer<typeof ChatInputSchema>) {
  try {
    const adminApp = getAdminApp();
    const userRecord = await getAuth(adminApp).getUser(input.userId);
    const db = getFirestore(adminApp);
    const userDoc = await db.collection('users').doc(input.userId).get();
    const schoolId = userDoc.data()?.schoolId;

    if (!schoolId) {
      return { success: false, text: "Error: School ID not found for your account." };
    }
    
    const creditResult = await checkAndSpendCredits(schoolId, 1); // Cost: 1 credit per message
    if (!creditResult.success) {
      return { success: false, text: "You are out of AI credits! Please contact your school administrator." };
    }

    const historyText = input.history
      .map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
      .join('\n');
    
    // UPDATED PROMPT WITH "NARROW DOWN" RULE
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
      model: 'googleai/gemini-2.5-flash',
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
