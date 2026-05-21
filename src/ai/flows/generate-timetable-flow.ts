'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { checkAndSpendCredits } from '@/app/actions/credits';

/**
 * @fileOverview Timetable Generation Flow
 * 
 * - generateTimetable - Iterative solver that processes the week day-by-day 
 *   to ensure strict adherence to weekly frequency limits and prevent timeouts.
 */

// Minimal Output Schema to save tokens
const TimetableEntrySchema = z.object({
  classId: z.string(),
  timeSlotId: z.string(),
  subjectId: z.string().nullable(), // Allow null for free periods
  teacherId: z.string().nullable(),
  roomId: z.string().nullable(),
});

const TimetableOutputSchema = z.object({
  schedule: z.array(TimetableEntrySchema)
});

/**
 * Generates a full school timetable by iterating day-by-day.
 * This ensures the AI respects 'weeklyPeriods' constraints by maintaining 
 * state (scheduledCounts) across sequential calls.
 */
export async function generateTimetable(input: any) {
  console.log("🚀 AI Timetable Generation Started (Iterative Mode)...");

  try {
    // 1. Credit Check (Cost: 50 credits for high-intensity solving)
    if (input.schoolId) {
        const creditResult = await checkAndSpendCredits(input.schoolId, 50);
        if (!creditResult.success) {
            return { success: false, error: creditResult.error };
        }
    }

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    let completeTimetable: any[] = [];
    
    // Tracker: { "classId_subjectId": count }
    const scheduledCounts: Record<string, number> = {}; 

    // Process each day sequentially to maintain the state of 'scheduledCounts'
    for (const day of daysOfWeek) {
        console.log(`[Timetable AI] Generating ${day}...`);
        
        // Filter input timeslots for just this day
        const dailySlots = input.timeSlots.filter((ts: any) => ts.day === day);
        if (dailySlots.length === 0) continue;

        const promptText = `
            You are a strict constraint-solver algorithm for a school timetable.
            Generate the schedule ONLY for ${day}.

            RULES:
            1. Every 'classId' MUST have exactly one entry for EVERY 'timeSlotId' provided for this day.
            2. NO CONFLICTS: A 'teacherId' cannot be assigned to two different classes in the same 'timeSlotId'. A 'roomId' cannot host two classes in the same 'timeSlotId'.
            3. FREQUENCY LIMIT: Look at the "scheduledCounts" JSON below. Do NOT schedule a subject for a class if it has reached its "weeklyPeriods" limit.
            4. If a class has a free period, return the entry but set subjectId, teacherId, and roomId to null.
            5. Return ONLY the exact IDs provided.

            CURRENT SCHEDULED COUNTS (Do not exceed weekly limits):
            ${JSON.stringify(scheduledCounts)}

            AVAILABLE DATA:
            TimeSlots Today: ${JSON.stringify(dailySlots)}
            Classes: ${JSON.stringify(input.classes)}
            Teachers: ${JSON.stringify(input.teachers)}
            Subjects: ${JSON.stringify(input.subjects)}
            Rooms: ${JSON.stringify(input.rooms)}

            SYSTEM RULES:
            ${JSON.stringify(input.systemRules)}

            CUSTOM CONSTRAINTS:
            ${input.customConstraint}
        `;

        try {
            // Make the call for this specific day using Pro model for best results
            const { output } = await ai.generate({
                model: 'googleai/gemini-1.5-pro',
                prompt: promptText,
                output: { schema: TimetableOutputSchema },
                config: { temperature: 0.0 } // 0.0 forces strict logic over creativity
            });

            if (output && output.schedule) {
                // 1. Add today's schedule to the master list
                completeTimetable = completeTimetable.concat(output.schedule);
                
                // 2. Update the tracker for the next day's prompt
                output.schedule.forEach((entry: any) => {
                    if (entry.subjectId) {
                        const key = `${entry.classId}_${entry.subjectId}`;
                        scheduledCounts[key] = (scheduledCounts[key] || 0) + 1;
                    }
                });
            }
        } catch (error) {
            console.error(`[Timetable AI] Error on ${day}:`, error);
            // We continue to the next day even if one fails to prevent total crash
        }
    }

    if (completeTimetable.length === 0) {
        throw new Error("Failed to generate any timetable entries. Check your constraints.");
    }

    // Hydrate IDs into the format expected by the frontend grid
    const enrichedTimetable = completeTimetable.map(entry => {
        const slot = input.timeSlots.find((ts: any) => ts.id === entry.timeSlotId);
        return {
            ...entry,
            id: `entry-${Math.random().toString(36).substr(2, 9)}`,
            day: slot?.day || '',
            startTime: slot?.startTime || '',
            endTime: slot?.endTime || '',
            teacherId: entry.teacherId || "TBA",
            roomId: entry.roomId || "TBA",
            subjectId: entry.subjectId || ""
        };
    });

    console.log(`✅ Full Week Generated Iteratively! Total entries: ${enrichedTimetable.length}`);
    
    // Ensure we return a plain object so React Server Actions don't throw serialization errors
    return JSON.parse(JSON.stringify({ success: true, timetable: enrichedTimetable }));

  } catch (error: any) {
    console.error("❌ AI Generation Failed:", error);
    return { 
        success: false, 
        error: error.message || "Server Error" 
    };
  }
}
