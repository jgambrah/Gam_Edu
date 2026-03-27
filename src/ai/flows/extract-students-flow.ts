
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const StudentListSchema = z.array(z.object({
  FirstName: z.string(),
  LastName: z.string(),
  Email: z.string(),
  ClassName: z.string().describe("The class name or identifier found in the text"),
}));

export async function extractStudentsFromText(text: string) {
  try {
    const prompt = `
      You are a data extraction assistant for a school management system.
      Extract student names, emails, and classes from the following text which was copied from a PDF register.
      Some data might be messy or incomplete.
      
      RULES:
      1. Find: FirstName, LastName, Email, ClassName.
      2. If a name is just 'John Doe', split it into FirstName 'John' and LastName 'Doe'.
      3. If no email is found, generate one using 'firstname.lastname@school.local' (all lowercase).
      4. Ensure 'ClassName' is as accurate as possible (e.g., 'BS 7', 'Grade 1', etc).
      5. Return ONLY a valid JSON array of objects.

      TEXT TO PARSE:
      ${text}
    `;

    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: prompt,
      output: { schema: StudentListSchema }
    });

    if (!output) {
      throw new Error("AI failed to extract any student data.");
    }

    return { success: true, data: output };
  } catch (error: any) {
    console.error("AI Extraction Error:", error);
    return { success: false, error: error.message };
  }
}
