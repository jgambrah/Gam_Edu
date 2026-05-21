'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { checkAndSpendCredits } from '@/app/actions/credits';

// Minimal Output Schema to save tokens
const TimetableEntrySchema = z.object({
  classId: z.string(),
  timeSlotId: z.string(),
  subjectId: z.string(),
  teacherId: z.string(),
  roomId: z.string(),
});

const TimetableOutputSchema = z.object({
  timetable: z.array(TimetableEntrySchema)
});

/**
 * Generates a full school timetable by chunking the task day-by-day.
 * This prevents the AI from hitting token limits or losing focus on large matrices.
 */
export async function generateTimetable(input: any) {
  console.log("🚀 AI Timetable Generation Started (Day-by-Day Mode)...");

  try {
    if (input.schoolId) {
        const creditResult = await checkAndSpendCredits(input.schoolId, 50);
        if (!creditResult.success) {
            return { success: false, error: creditResult.error };
        }
    }

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    let completeTimetable: any[] = [];
    
    // Create a tracker for how many times a subject has been scheduled so far
    // This helps the AI not exceed the 'weeklyPeriods' across the separate daily calls
    const scheduledCounts: Record<string, number> = {}; 

    for (const day of daysOfWeek) {
        // 1. Get only the slots for this specific day
        const dailySlots = input.timeSlots.filter((ts: any) => ts.day === day);
        
        if (dailySlots.length === 0) {
            console.log(`Skipping ${day}: No time slots defined.`);
            continue;
        }

        console.log(`Generating schedule for ${day}...`);

        // 2. Build a day-specific prompt
        const dayPrompt = `
            You are a master school administrator.
            Generate the timetable for ONE DAY ONLY: ${day}.
            
            CRITICAL DIRECTIVES:
            1. You MUST generate exactly ONE entry for EVERY 'classId' in EVERY 'timeSlotId' provided below.
            2. DO NOT exceed the weekly limits. Here is how many times subjects have already been scheduled this week: ${JSON.stringify(scheduledCounts)}. 
               Reference the 'weeklyPeriods' field in the 'Subjects' array.
            3. Use ONLY the IDs provided in the JSON format.
            4. If a class has a free period, output the entry but leave the subjectId and teacherId empty strings "".
            5. Resolve conflicts: A teacher cannot be in two rooms. A room cannot have two classes.
            
            Input Data for ${day}:
            TimeSlots: ${JSON.stringify(dailySlots)}
            Classes: ${JSON.stringify(input.classes)}
            Teachers: ${JSON.stringify(input.teachers)}
            Subjects: ${JSON.stringify(input.subjects)}
            Rooms: ${JSON.stringify(input.rooms)}
            
            System Rules & Constraints:
            ${JSON.stringify(input.systemRules)}
            ${input.customConstraint}
        `;

        // 3. Call the AI for just this day
        try {
            const { output } = await ai.generate({
                model: 'googleai/gemini-3-flash-preview', 
                prompt: dayPrompt,
                output: { schema: TimetableOutputSchema },
                config: { temperature: 0.1, maxOutputTokens: 8192 }
            });

            if (output && output.timetable) {
                // Add today's schedule to the master list
                completeTimetable = completeTimetable.concat(output.timetable);
                
                // Update our running count of scheduled subjects to pass to the next day
                output.timetable.forEach(entry => {
                    if (entry.subjectId) {
                        const key = `${entry.classId}_${entry.subjectId}`;
                        scheduledCounts[key] = (scheduledCounts[key] || 0) + 1;
                    }
                });
                console.log(`✅ ${day} processed successfully.`);
            }
        } catch (error) {
            console.error(`❌ Failed to generate schedule for ${day}:`, error);
            // We log the error but allow the loop to continue to other days so it doesn't totally crash
        }
    }

    // 4. Final Validation
    if (completeTimetable.length === 0) {
        throw new Error("AI failed to generate any timetable entries.");
    }

    // Re-hydrate IDs into the format expected by the frontend grid
    const fixedTimetable = completeTimetable.map((entry: any) => {
        const matchSlot = input.timeSlots.find((ts: any) => ts.id === entry.timeSlotId);
        return {
            ...entry,
            day: matchSlot?.day || '',
            startTime: matchSlot?.startTime || '',
            endTime: matchSlot?.endTime || '',
            // Ensure compatibility with frontend fallback logic
            teacherId: entry.teacherId || "TBA",
            roomId: entry.roomId || "TBA"
        };
    });

    console.log(`✅ Full Week Generated! Total entries: ${fixedTimetable.length}`);
    return { success: true, timetable: fixedTimetable };

  } catch (error: any) {
    console.error("❌ AI Generation Failed:", error);
    return { 
        success: false, 
        error: error.message || "Server Timeout or Model Error" 
    };
  }
}
