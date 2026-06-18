'use server';
/**
 * @fileOverview An AI agent for generating reading passages with questions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateReadingPassageInputSchema = z.object({
  topic: z.string().describe('The topic for the reading passage.'),
  reading_level: z.string().describe('The target reading level (e.g., "Grade 9").'),
  numQuestions: z.coerce.number().min(1).max(5).describe('The number of comprehension questions to generate.'),
});

export type GenerateReadingPassageInput = z.infer<typeof GenerateReadingPassageInputSchema>;

const ComprehensionQuestionSchema = z.object({
  question: z.string().describe("The text of the comprehension question."),
  correct_answer_key: z.string().describe("The correct answer to the question."),
  explanation: z.string().describe("A brief explanation for why the answer is correct."),
});

const GenerateReadingPassageOutputSchema = z.object({
  title: z.string().describe('An appropriate title for the passage.'),
  passage_text: z.string().describe('The full text of the generated reading passage.'),
  question_set: z.array(ComprehensionQuestionSchema).describe('An array of comprehension questions.'),
});

export type GenerateReadingPassageOutput = z.infer<typeof GenerateReadingPassageOutputSchema>;

const generateReadingPassagePrompt = ai.definePrompt({
  name: 'generateReadingPassagePrompt',
  input: { schema: GenerateReadingPassageInputSchema },
  output: { schema: GenerateReadingPassageOutputSchema },
  prompt: `You are an expert curriculum developer specializing in English Language Arts. Your task is to generate a reading passage and a set of comprehension questions based on the provided topic and reading level.

Topic: {{{topic}}}
Reading Level: {{{reading_level}}}
Number of Questions: {{{numQuestions}}}

Instructions:
1.  Write an engaging and informative reading passage of about 200-300 words, suitable for the specified reading level.
2.  Create a suitable title for the passage.
3.  Generate {{{numQuestions}}} short-answer comprehension questions that test understanding of the passage.
4.  For each question, provide a concise, correct answer based directly on the text.
5.  For each question, provide a brief explanation for why the answer is correct.`,
});

import { checkAndSpendCredits } from '@/app/actions/credits';

export async function generateReadingPassage(
  input: GenerateReadingPassageInput & { schoolId: string }
): Promise<{ success: boolean; data?: GenerateReadingPassageOutput; error?: string }> {
  try {
    const creditResult = await checkAndSpendCredits(input.schoolId, 5);
    if (!creditResult.success) {
      return { success: false, error: creditResult.error || "Not enough AI credits to generate reading passage." };
    }
    const { schoolId, ...promptInput } = input;
    const { output } = await generateReadingPassagePrompt(promptInput, { model: 'googleai/gemini-3-flash-preview' });
    return { success: true, data: output! };
  } catch (error: any) {
    console.error("Passage generation error:", error);
    return { success: false, error: error.message || "Failed to generate reading passage." };
  }
}
