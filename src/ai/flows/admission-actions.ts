
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const RecommendationSchema = z.object({
  recommendedClassId: z.string(),
  reasoning: z.string(),
});

export async function recommendClassPlacementAction(
    student: { name: string; age: number; gender: string; desiredGrade: string },
    availableClasses: { id: string; name: string; capacity: number; currentStudents: number }[]
) {
  try {
    const prompt = `
      You are a School Admission Administrator AI.
      
      TASK: Recommend the best class placement for a new student based on capacity and grade level.
      
      NEW STUDENT:
      - Name: ${student.name}
      - Age: ${student.age}
      - Gender: ${student.gender}
      - Desired Grade: ${student.desiredGrade}
      
      AVAILABLE CLASSES:
      ${JSON.stringify(availableClasses)}
      
      INSTRUCTIONS:
      1. Filter classes that match the student's "Desired Grade".
      2. Look for the class with the most available space (Capacity - CurrentStudents).
      3. If specific grade classes aren't explicitly named, try to match based on the text (e.g., "Grade 1" matches "Class 1A").
      4. Return a JSON object with:
         - recommendedClassId: (The ID of the class)
         - reasoning: (A short explanation, e.g., "Class 1B has more space than 1A")
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      output: { schema: RecommendationSchema }
    });
    
    if (!output) {
        throw new Error("AI did not return a valid recommendation.");
    }

    return { success: true, data: output };
  } catch (error: any) {
    console.error("AI Error:", error);
    return { success: false, error: "AI could not generate a recommendation." };
  }
}
