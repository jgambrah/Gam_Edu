'use server';
/**
 * @fileOverview An AI agent for identifying students from a camera feed and marking their attendance.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { collection, addDoc, serverTimestamp, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { getSdks } from '@/firebase';

const IdentifyAndMarkAttendanceInputSchema = z.object({
  photoDataUri: z.string().describe(
    "A photo of a student's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type IdentifyAndMarkAttendanceInput = z.infer<typeof IdentifyAndMarkAttendanceInputSchema>;

const IdentifyAndMarkAttendanceOutputSchema = z.object({
  success: z.boolean().describe("Whether the attendance was successfully marked."),
  studentName: z.string().optional().describe("The full name of the identified student."),
  studentId: z.string().optional().describe("The unique ID of the identified student."),
  error: z.string().optional().describe("An error message if the operation failed."),
});
export type IdentifyAndMarkAttendanceOutput = z.infer<typeof IdentifyAndMarkAttendanceOutputSchema>;


async function addAttendanceRecord(studentId: string) {
    const { firestore } = getSdks();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of the day
    
    // Check if an attendance record for this student already exists for today
    const attendanceQuery = query(
        collection(firestore, 'attendance'),
        where('studentId', '==', studentId),
        where('date', '>=', Timestamp.fromDate(today))
    );

    const querySnapshot = await getDocs(attendanceQuery);
    if (!querySnapshot.empty) {
        // Record already exists
        return { alreadyExists: true };
    }

    // Add new record
    const record = {
        studentId: studentId,
        date: serverTimestamp(),
        status: 'Present',
        markedBy: 'kiosk',
    };
    const docRef = await addDoc(collection(firestore, 'attendance'), record);
    return { id: docRef.id, alreadyExists: false };
}


// This is a mock/placeholder for a real facial recognition service.
// In a real application, you would call a service like Cloud Vision API
// and compare face embeddings against a database of known student faces.
const getStudentFromFace = ai.defineTool(
    {
      name: 'getStudentFromFace',
      description: 'Identifies a student from a photo of their face and returns their details.',
      inputSchema: z.object({
        photo: z.string().describe("The photo of the student's face.")
      }),
      outputSchema: z.object({
        identified: z.boolean(),
        studentId: z.string().optional(),
        studentName: z.string().optional(),
      }),
    },
    async (input) => {
        // MOCK IMPLEMENTATION
        // In a real scenario, this would involve complex logic.
        // For this demo, we'll just return a mock student.
        console.log("Simulating face recognition...");
        return {
            identified: true,
            studentId: 'mock-student-uid-123',
            studentName: 'Jane Doe',
        };
    }
  )


const identifyAndMarkFlow = ai.defineFlow(
  {
    name: 'identifyAndMarkAttendanceFlow',
    inputSchema: IdentifyAndMarkAttendanceInputSchema,
    outputSchema: IdentifyAndMarkAttendanceOutputSchema,
  },
  async (input) => {
    
    const faceResult = await getStudentFromFace({photo: input.photoDataUri});

    if (!faceResult.identified || !faceResult.studentId) {
        return { success: false, error: 'Student not recognized.' };
    }

    try {
        const { alreadyExists } = await addAttendanceRecord(faceResult.studentId);
        if (alreadyExists) {
            return {
                success: true,
                studentName: faceResult.studentName,
                studentId: faceResult.studentId,
            };
        }
        return {
            success: true,
            studentName: faceResult.studentName,
            studentId: faceResult.studentId,
        };
    } catch(e: any) {
        console.error("Failed to mark attendance", e);
        return { success: false, error: 'Failed to save attendance record.' };
    }
  }
);


export async function identifyAndMarkAttendance(input: IdentifyAndMarkAttendanceInput): Promise<IdentifyAndMarkAttendanceOutput> {
    return identifyAndMarkFlow(input);
}
