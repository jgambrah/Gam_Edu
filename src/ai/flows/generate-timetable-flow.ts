'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { checkAndSpendCredits } from '@/app/actions/credits';

// Step 2.1: Define a minimal Output Schema to save tokens
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

// Step 2.2: Strengthened Prompt with Completeness Directives
const timetablePrompt = ai.definePrompt({
  name: 'timetablePrompt',
  input: {
    schema: z.object({
      teachers: z.string(),
      subjects: z.string(),
      classes: z.string(),
      rooms: z.string(),
      timeSlots: z.string(),
      systemRules: z.array(z.string()),
      customConstraint: z.string().optional(),
    }),
  },
  output: {
    schema: TimetableOutputSchema,
  },
  prompt: `You are an expert school administrator scheduling a timetable.
Your ONLY goal is to output a valid JSON array matching the exact schema provided.

CRITICAL DIRECTIVES:
1. COMPLETENESS: You MUST generate an entry for EVERY 'classId' in EVERY 'timeSlotId' provided. Do not leave any class without a lesson in any time slot.
2. NO GAPS: If a class does not have a specific subject scheduled, assign them a "Study/Free" subject or leave the subjectId empty, but the entry object MUST exist in the JSON array.
3. CONFLICTS: A teacher cannot be in two rooms at the same time. A room cannot host two classes at the same time.
4. USE IDs ONLY: The output JSON must strictly contain the string IDs provided in the input arrays (e.g., "class_123", "ts_456"). Do not output human-readable names.

Input Data:
Teachers: {{teachers}}
Subjects: {{subjects}}
Classes: {{classes}}
Rooms: {{rooms}}
TimeSlots: {{timeSlots}}

System Rules:
{{#each systemRules}}
- {{this}}
{{/each}}

Custom Constraint: {{customConstraint}}`,
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

    // Step 1: Maximize output tokens and lower temperature for strict logic
    const { output } = await timetablePrompt({
      teachers: JSON.stringify(input.teachers),
      subjects: JSON.stringify(input.subjects),
      classes: JSON.stringify(input.classes),
      rooms: JSON.stringify(input.rooms),
      timeSlots: JSON.stringify(input.timeSlots),
      systemRules: input.systemRules || [],
      customConstraint: input.customConstraint || "None",
    }, {
      // Maintain existing stable model
      model: 'googleai/gemini-3-flash-preview',
      config: {
        temperature: 0.1, // Stricter logic, less hallucination
        maxOutputTokens: 8192, // Maximize to ensure full matrix completion
      }
    });

    if (!output) {
      throw new Error("AI returned empty response.");
    }

    // Re-hydrate IDs into the format expected by the frontend grid
    const fixedTimetable = output.timetable.map((entry: any) => {
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