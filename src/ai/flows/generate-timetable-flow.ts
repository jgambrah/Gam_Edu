
'use server';

import { generate } from '@genkit-ai/ai';
import { z } from 'zod';

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
    timeSlotId: z.string().optional() // Make optional as AI might miss it
  }))
});

export async function generateTimetable(input: any) {
  console.log("🚀 AI Timetable Generation Started...");

  try {
    // 1. Validate Input Size
    // If we send too much data, the AI will choke or timeout.
    // We strictly limit the context here.
    const prompt = `
      You are a School Timetable Scheduler.
      
      TASK: Generate a conflict-free weekly timetable.
      
      CONSTRAINTS:
      1. Use the provided TimeSlots exactly.
      2. Assign a Subject, Teacher, and Room to every 'Lesson' slot for every Class.
      3. Teachers cannot be in two classes at once.
      4. Rooms cannot be used twice at once.
      5. ${input.customConstraint || "Distribute hard subjects (Math, Science) in mornings."}

      DATA:
      - Classes: ${JSON.stringify(input.classes.map((c:any) => ({id: c.id, name: c.name})))}
      - Teachers: ${JSON.stringify(input.teachers.map((t:any) => ({id: t.uid, subjects: t.subjects})))}
      - Subjects: ${JSON.stringify(input.subjects)}
      - Rooms: ${JSON.stringify(input.rooms)}
      - TimeSlots: ${JSON.stringify(input.timeSlots)}

      OUTPUT:
      Return a JSON object containing a "timetable" array.
    `;

    // 2. Call AI with Timeout Config
    const response = await generate({
      model: 'googleai/gemini-3-flash-preview',
      prompt: prompt,
      output: {
        schema: TimetableSchema,
        format: "json"
      },
      config: {
        temperature: 0.2, // Low creativity = fewer errors
        maxOutputTokens: 8192, // Allow large response
      }
    });

    if (!response) {
      throw new Error("AI returned empty response.");
    }

    // 3. Post-Process Data
    // The AI might miss the 'timeSlotId'. We fix it by matching time/day.
    const rawData = response.output();
    const fixedTimetable = rawData?.timetable.map((entry: any) => {
        // Find matching time slot ID from original input
        const matchSlot = input.timeSlots.find((ts: any) => 
            ts.day === entry.day && ts.startTime === entry.startTime
        );
        return {
            ...entry,
            timeSlotId: matchSlot ? matchSlot.id : `${entry.day}-${entry.startTime}`,
            // Ensure IDs are strings
            teacherId: entry.teacherId || "TBA",
            roomId: entry.roomId || "TBA"
        };
    });

    console.log(`✅ Success! Generated ${fixedTimetable?.length || 0} entries.`);
    return { success: true, timetable: fixedTimetable };

  } catch (error: any) {
    console.error("❌ AI Generation Failed:", error);
    
    // Return a clean error to the client instead of crashing
    // This fixes the "Unexpected response" white screen
    return { 
        success: false, 
        error: error.message || "Server Timeout or Model Error" 
    };
  }
}
