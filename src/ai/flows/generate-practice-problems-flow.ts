'use server';
/**
 * @fileOverview An AI agent for generating practice problems for various subjects.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GeneratePracticeProblemsInputSchema = z.object({
  subject: z.enum(['Math', 'Science', 'ELA Grammar']),
  topic: z.string().describe('The specific topic for the problems (e.g., "Algebra", "Photosynthesis", "Punctuation").'),
  numQuestions: z.coerce.number().min(1).max(10),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
});

export type GeneratePracticeProblemsInput = z.infer<typeof GeneratePracticeProblemsInputSchema>;

const PracticeProblemSchema = z.object({
    question_text: z.string().describe("The text of the practice question."),
    options: z.array(z.string()).length(4).describe("An array of 4 possible answers for multiple-choice questions."),
    correct_answer: z.string().describe("The correct answer from the options."),
    explanation: z.string().describe("A brief explanation for why the answer is correct.")
});

const GeneratePracticeProblemsOutputSchema = z.object({
  problems: z.array(PracticeProblemSchema).describe('An array of generated practice problems.'),
});

export type GeneratePracticeProblemsOutput = z.infer<typeof GeneratePracticeProblemsOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generatePracticeProblemsPrompt',
  input: { schema: GeneratePracticeProblemsInputSchema },
  output: { schema: GeneratePracticeProblemsOutputSchema },
  prompt: `You are an expert educator creating practice questions for students. Generate a set of multiple-choice questions based on the provided details.

Subject: {{{subject}}}
Topic: {{{topic}}}
Difficulty: {{{difficulty}}}
Number of Questions: {{{numQuestions}}}

For each question, you must:
1.  Create a clear and concise question text relevant to the topic and difficulty.
2.  Provide exactly 4 multiple-choice options.
3.  Identify the single correct answer.
4.  Provide a brief explanation for why the answer is correct.
5.  Ensure the question is appropriate for a student practice session, not a formal graded quiz.`,
});


export async function generatePracticeProblems(input: GeneratePracticeProblemsInput): Promise<GeneratePracticeProblemsOutput> {
  const { output } = await prompt(input, { model: 'googleai/gemini-3-flash-preview' });
  return output!;
}
