'use server';
/**
 * @fileOverview An AI agent for generating and rescheduling school timetables.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Class, Room, Subject, TimeSlot, TimetableEntry, UserRole } from '@/lib/types';

// Define the shape of a simplified Teacher object for the AI
const TeacherSchema = z.object({
  uid: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  subjects: z.array(z.string()).describe("IDs of subjects this teacher can teach."),
});

// Define the input schema for the timetable generation flow
export const GenerateTimetableInputSchema = z.object({
  teachers: z.array(TeacherSchema).describe("A list of all available teachers."),
  subjects: z.array(z.object({ id: z.string(), name: z.string() })).describe("A list of all subjects to be scheduled."),
  classes: z.array(z.object({ id: z.string(), name: z.string() })).describe("A list of all classes that need a schedule."),
  rooms: z.array(z.object({ id: z.string(), name: z.string() })).describe("A list of all available rooms."),
  timeSlots: z.array(z.object({ id: z.string(), day: z.string(), startTime: z.string(), endTime: z.string() })).describe("A list of all time slots in the week."),
  customConstraint: z.string().optional().describe("A natural language instruction for a custom constraint, e.g., 'No science classes on Friday afternoon' or 'Math should be in the morning'."),
});
export type GenerateTimetableInput = z.infer<typeof GenerateTimetableInputSchema>;

// Define the output schema for a single timetable entry
const TimetableEntrySchema = z.object({
  classId: z.string(),
  subjectId: z.string(),
  teacherId: z.string(),
  roomId: z.string(),
  day: z.string(),
  timeSlotId: z.string(),
});

// Define the output schema for the entire timetable
export const GenerateTimetableOutputSchema = z.object({
  timetable: z.array(TimetableEntrySchema),
});
export type GenerateTimetableOutput = z.infer<typeof GenerateTimetableOutputSchema>;


export async function generateTimetable(input: GenerateTimetableInput): Promise<GenerateTimetableOutput> {
  return generateTimetableFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateTimetablePrompt',
  input: { schema: GenerateTimetableInputSchema },
  output: { schema: GenerateTimetableOutputSchema },
  prompt: `You are an expert school administrator responsible for creating a weekly class schedule. Your task is to generate a complete, conflict-free timetable for all classes based on the provided data.

RULES:
1.  Every class must be assigned one subject per available time slot.
2.  A teacher cannot teach two different classes at the same time.
3.  A class cannot have two different subjects at the same time.
4.  A room cannot be occupied by two different classes at the same time.
5.  Teachers must be assigned to subjects they are qualified to teach (as listed in their 'subjects' array).
6.  If a custom constraint is provided, you MUST adhere to it.

DATA:
- Classes: {{{json classes}}}
- Teachers: {{{json teachers}}}
- Subjects: {{{json subjects}}}
- Rooms: {{{json rooms}}}
- Time Slots: {{{json timeSlots}}}

{{#if customConstraint}}
CUSTOM CONSTRAINT: "{{{customConstraint}}}"
{{/if}}

Generate the full timetable as a single array of schedule entry objects. Ensure every class has a schedule for every time slot.`,
});

const generateTimetableFlow = ai.defineFlow(
  {
    name: 'generateTimetableFlow',
    inputSchema: GenerateTimetableInputSchema,
    outputSchema: GenerateTimetableOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
