'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { checkAndSpendCredits } from '@/app/actions/credits';

/**
 * @fileOverview Timetable Generation Flow
 * 
 * - generateTimetable - Optimized action that generates a 5-day schedule in parallel
 */

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
 * Generates a full school timetable by parallelizing the task day-by-day.
 * This prevents the AI from hitting token limits, improves attention,
 * and ensures the operation finishes within standard server action timeouts.
 */
export async function generateTimetable(input: any) {
  console.log("🚀 AI Timetable Generation Started (Parallel Mode)...");

  try {
    if (input.schoolId) {
        const creditResult = await checkAndSpendCredits(input.schoolId, 50);
        if (!creditResult.success) {
            return { success: false, error: creditResult.error };
        }
    }

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    // Create an array of Promises so all 5 days generate at the exact same time
    const dailyPromises = daysOfWeek.map(async (day) => {
        const dailySlots = input.timeSlots.filter((ts: any) => ts.day === day);
        
        if (dailySlots.length === 0) {
            return [];
        }

        const dayPrompt = `
            You are a master school administrator scheduling a timetable.
            Generate the timetable for ONE DAY ONLY: ${day}.
            
            CRITICAL DIRECTIVES:
            1. You MUST generate exactly ONE entry for EVERY 'classId' in EVERY 'timeSlotId' provided below.
            2. For subjects, divide their 'weeklyPeriods' by 5 to know roughly how many times to schedule them today.
            3. Use ONLY the exact IDs provided.
            4. If a class has a free period, leave subjectId empty (""), but the entry MUST exist in the JSON array.
            
            Input Data for ${day}:
            TimeSlots: ${JSON.stringify(dailySlots)}
            Classes: ${JSON.stringify(input.classes)}
            Teachers: ${JSON.stringify(input.teachers)}
            Subjects: ${JSON.stringify(input.subjects)}
            Rooms: ${JSON.stringify(input.rooms)}
            
            System Rules & Custom Constraints:
            ${JSON.stringify(input.systemRules)}
            ${input.customConstraint}
        `;

        try {
            const { output } = await ai.generate({
                model: 'googleai/gemini-1.5-flash', 
                prompt: dayPrompt,
                output: { schema: TimetableOutputSchema },
                config: { temperature: 0.1, maxOutputTokens: 8192 }
            });

            return output?.timetable || [];
        } catch (error) {
            console.error(`Failed to generate schedule for ${day}:`, error);
            return []; // Return empty for this day so it doesn't crash the whole week
        }
    });

    // Wait for all 5 days to generate simultaneously
    const dailyResults = await Promise.all(dailyPromises);
    
    // Flatten the array of arrays into one single timetable array
    const completeTimetable = dailyResults.flat();

    if (completeTimetable.length === 0) {
        throw new Error("AI failed to generate any timetable entries. Please try again.");
    }

    // Re-hydrate IDs into the format expected by the frontend grid
    const fixedTimetable = completeTimetable.map((entry: any) => {
        const matchSlot = input.timeSlots.find((ts: any) => ts.id === entry.timeSlotId);
        return {
            ...entry,
            id: `entry-${Math.random().toString(36).substr(2, 9)}`,
            day: matchSlot?.day || '',
            startTime: matchSlot?.startTime || '',
            endTime: matchSlot?.endTime || '',
            teacherId: entry.teacherId || "TBA",
            roomId: entry.roomId || "TBA"
        };
    });

    console.log(`✅ Full Week Generated Parallelly! Total entries: ${fixedTimetable.length}`);
    
    // Ensure we return a plain object so React Server Actions don't throw serialization errors
    return JSON.parse(JSON.stringify({ success: true, timetable: fixedTimetable }));

  } catch (error: any) {
    console.error("❌ AI Generation Failed:", error);
    return { 
        success: false, 
        error: error.message || "Server Error" 
    };
  }
}
