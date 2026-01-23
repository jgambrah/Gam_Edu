
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { checkAndSpendCredits } from '@/app/actions/credits';

// Define the Input Structure
interface Question {
  question: string;
  correct_answer_key: string;
}

interface EvaluationInput {
  passageText: string;
  questions: Question[];
  studentAnswers: Record<number, string>;
  schoolId: string;
}

// Define the Output Structure (Strict JSON)
const FeedbackSchema = z.object({
  totalScore: z.number().describe("The final score out of 100"),
  generalFeedback: z.string().describe("Overall comment on the student's performance"),
  results: z.array(z.object({
    questionIndex: z.number(),
    isCorrect: z.boolean(),
    score: z.number().describe("Score for this specific question (0-100)"),
    feedback: z.string().describe("Explanation of why the answer is right or wrong based on the passage")
  }))
});

export async function evaluateReadingSubmissionAction(input: EvaluationInput) {
  try {
    const creditResult = await checkAndSpendCredits(input.schoolId, 5);
    if (!creditResult.success) {
      return { success: false, error: "Not enough AI credits to grade submission." };
    }

    // Format the data for the AI
    const qAndA = input.questions.map((q, idx) => {
      return `Q${idx + 1}: ${q.question}
      Correct Answer Key: ${q.correct_answer_key}
      Student Answer: ${input.studentAnswers[idx] || "No Answer"}`;
    }).join('\n\n');

    const prompt = `
      You are an expert English Language Arts Teacher.
      
      TASK:
      Evaluate the student's answers to a reading comprehension quiz based on the provided passage.
      
      PASSAGE:
      "${input.passageText.substring(0, 3000)}..." (truncated for context)

      QUESTIONS AND ANSWERS:
      ${qAndA}

      GRADING RULES:
      1. **Meaning over Exactness:** If the student's answer captures the correct meaning of the Key, mark it correct (True), even if the wording is different.
      2. **Explanation:** Provide a helpful 1-sentence explanation for every question. If wrong, explain what the passage actually said.
      3. **Scoring:** Give a specific score (0-100) for the whole quiz and for each question.
    `;

    const { output } = await ai.generate({
      model: 'googleai/gemini-3-flash-preview',
      prompt: prompt,
      output: { schema: FeedbackSchema },
    });

    const data = output;
    if (!data) throw new Error("No evaluation returned");

    return { success: true, data };

  } catch (error: any) {
    console.error("Grading Error:", error);
    return { success: false, error: error.message };
  }
}
