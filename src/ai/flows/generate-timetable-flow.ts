'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { checkAndSpendCredits } from '@/app/actions/credits';

// Define the Schema for the AI response
const TimetableSchema = z.object({
  timetable: z.array(z.object({
    day: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    subjectId: z.string(),
    classId: z.string(),
    teacherId: z.string().nullable().optional(),
    roomId: z.string().nullable().optional(),
    timeSlotId: z.string().optional()
  }))
});

export async function generateTimetable(input: any) {
  console.log("🚀 AI Timetable Generation Started...");

  try {
    if (input.schoolId) {
        const creditResult = await checkAndSpendCredits(input.schoolId, 50);
        if (!creditResult.success) {
            return { success: false, error: creditResult.error };
        }
    }

    const prompt = `
      You are an Expert Ghanaian School Timetable Scheduler.
      
      TASK: Generate a conflict-free weekly timetable that adheres to strict institutional logic.
      
      CRITICAL CONSTRAINTS TO FOLLOW:
      {{#each systemRules}}
      - {{this}}
      {{/each}}
      
      ADDITIONAL CONSTRAINTS:
      1. Use the provided TimeSlots exactly.
      2. Teachers cannot be in two classes at once.
      3. Rooms cannot be used twice at once.
      4. Assign a Subject, Teacher, and Room to every slot for every Class.
      5. ${input.customConstraint || "Distribute hard subjects in mornings."}

      DATA:
      - Classes: ${JSON.stringify(input.classes)}
      - Teachers: ${JSON.stringify(input.teachers)}
      - Subjects: ${JSON.stringify(input.subjects)}
      - Rooms: ${JSON.stringify(input.rooms)}
      - TimeSlots: ${JSON.stringify(input.timeSlots)}

      OUTPUT:
      Return a JSON object containing a "timetable" array.
    `;

    const response = await ai.generate({
      model: 'googleai/gemini-3-flash-preview',
      prompt: prompt,
      output: {
        schema: TimetableSchema,
        format: "json"
      },
      config: {
        temperature: 0.2,
        maxOutputTokens: 8192,
      }
    });

    if (!response || !response.output) {
      throw new Error("AI returned empty response.");
    }

    const rawData = response.output;
    const fixedTimetable = rawData.timetable.map((entry: any) => {
        const matchSlot = input.timeSlots.find((ts: any) => 
            ts.day === entry.day && ts.startTime === entry.startTime
        );
        return {
            ...entry,
            timeSlotId: matchSlot ? matchSlot.id : `${entry.day}-${entry.startTime}`,
            teacherId: entry.teacherId || "TBA",
            roomId: entry.roomId || "TBA"
        };
    });

    console.log(`✅ Success! Generated ${fixedTimetable?.length || 0} entries.`);
    return { success: true, timetable: fixedTimetable };

  } catch (error: any) {
    console.error("❌ AI Generation Failed:", error);
    return { 
        success: false, 
        error: error.message || "Server Timeout or Model Error" 
    };
  }
}
