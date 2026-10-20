'use server';
import { requireSignedInAction } from '@/lib/session-guard';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { checkAndSpendCredits } from '@/app/actions/credits';
import { refundSchoolCredits } from '@/lib/credits-server';
import { TimetableValidator, isLessonSlot } from '@/lib/timetable-validate';

/**
 * @fileOverview Timetable Generation Flow
 *
 * - generateTimetable - asks the AI for one day at a time (keeps prompts small and lets weekly limits carry
 *   over), then passes EVERY proposed lesson through TimetableValidator, which enforces the rules the
 *   screen promises (no teacher/class/room clashes, nothing in breaks, weekly period limits).
 * - If a day cannot be generated, nothing is returned (so the school's current timetable is never replaced
 *   by a half-week) and the 50 credits are given back.
 */

const COST = 50;

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

export async function generateTimetable(input: any) {
  await requireSignedInAction();
  console.log("🚀 AI Timetable Generation Started (Iterative Mode)...");

  let charged = false;
  try {
    if (!input?.schoolId) return { success: false, error: 'School ID is required.' };

    // Only LESSON slots are ever offered to the AI (breaks, lunch, worship and events are skipped).
    const allSlots: any[] = Array.isArray(input.timeSlots) ? input.timeSlots : [];
    const lessonSlots = allSlots.filter(isLessonSlot);
    if (lessonSlots.length === 0) return { success: false, error: 'No lesson periods are defined. Add time slots in the Configuration tab.' };
    if (!Array.isArray(input.classes) || input.classes.length === 0) return { success: false, error: 'No classes found.' };
    if (!Array.isArray(input.subjects) || input.subjects.length === 0) return { success: false, error: 'No subjects found.' };

    // 1. Credit Check (Cost: 50 credits for high-intensity solving)
    const creditResult = await checkAndSpendCredits(input.schoolId, COST);
    if (!creditResult.success) {
      return { success: false, error: creditResult.error };
    }
    charged = true;

    const validator = new TimetableValidator({
      schoolId: input.schoolId,
      classes: input.classes,
      subjects: input.subjects,
      teachers: input.teachers || [],
      rooms: input.rooms || [],
      timeSlots: allSlots,
    });

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const failedDays: string[] = [];

    for (const day of daysOfWeek) {
      const dailySlots = lessonSlots.filter((ts: any) => ts.day === day);
      if (dailySlots.length === 0) continue;
      console.log(`[Timetable AI] Generating ${day}...`);

      const promptText = `
            You are a strict constraint-solver algorithm for a school timetable.
            Generate the schedule ONLY for ${day}.

            RULES:
            1. Give every class one lesson for every LESSON slot of the day that applies to it. A slot with an empty
               "classId" applies to ALL classes; a slot with a "classId" applies ONLY to that class.
            2. NO CONFLICTS: A 'teacherId' cannot teach two classes at the same time. A 'roomId' cannot host two classes at the same time.
            3. FREQUENCY LIMIT: Look at "scheduledCounts" (key "classId_subjectId"). Never schedule a subject for a class beyond its "weeklyPeriods".
            4. Only give a class subjects whose "targetClasses" is empty or contains that class's id or name.
            5. Prefer a teacher from the subject's "allowedTeacherIds".
            6. If a class has a free period, return the entry with subjectId, teacherId and roomId set to null.
            7. Return ONLY the exact IDs provided.

            CURRENT SCHEDULED COUNTS (Do not exceed weekly limits):
            ${JSON.stringify(validator.scheduledCounts())}

            AVAILABLE DATA:
            Lesson slots today: ${JSON.stringify(dailySlots)}
            Classes: ${JSON.stringify(input.classes)}
            Teachers: ${JSON.stringify(input.teachers)}
            Subjects: ${JSON.stringify(input.subjects)}
            Rooms: ${JSON.stringify(input.rooms)}

            SYSTEM RULES:
            ${JSON.stringify(input.systemRules)}

            CUSTOM CONSTRAINTS:
            ${String(input.customConstraint || '').slice(0, 2000)}
        `;

      let done = false;
      for (let attempt = 1; attempt <= 2 && !done; attempt++) {
        try {
          const { output } = await ai.generate({
            model: 'googleai/gemini-3-flash-preview',
            prompt: promptText,
            output: { schema: TimetableOutputSchema },
          });
          if (output && Array.isArray(output.schedule)) {
            output.schedule.forEach((entry: any) => validator.add(entry));
            done = true;
          }
        } catch (error) {
          console.error(`[Timetable AI] Error on ${day} (attempt ${attempt}):`, error);
        }
      }
      if (!done) failedDays.push(day);
    }

    if (failedDays.length > 0) {
      throw new Error(`The AI could not build ${failedDays.join(', ')}. Your current timetable was not changed and the credits were returned. Please try again.`);
    }
    if (validator.accepted.length === 0) {
      throw new Error("The AI did not produce any usable lessons. Your current timetable was not changed and the credits were returned. Check your subjects, teachers and constraints.");
    }

    const warnings = Object.entries(validator.issues)
      .filter(([reason]) => reason !== 'free periods left empty')
      .map(([reason, n]) => `${n} ${reason}`);

    console.log(`✅ Full Week Generated! Lessons: ${validator.accepted.length}. Corrections: ${warnings.join('; ') || 'none'}`);
    return JSON.parse(JSON.stringify({ success: true, timetable: validator.accepted, warnings }));

  } catch (error: any) {
    console.error("❌ AI Generation Failed:", error);
    if (charged) await refundSchoolCredits(input.schoolId, COST);
    return {
      success: false,
      error: error.message || "Server Error"
    };
  }
}
