
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic for the quiz.'),
  numQuestions: z.number().describe('The number of questions to generate.'),
  forGradeLevel: z.string().describe('The target grade level for the quiz (e.g., "Grade 5").'),
  additionalInstructions: z.string().optional().describe('Any additional instructions for the AI.'),
});

export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const QuizQuestionSchema = z.object({
    questionText: z.string().describe("The text of the quiz question."),
    options: z.array(z.string()).describe("An array of 4 possible answers."),
    correctAnswer: z.string().describe("The correct answer from the options."),
    explanation: z.string().describe("A brief explanation for why the answer is correct."),
});

const GenerateQuizOutputSchema = z.object({
  title: z.string().describe('A suitable title for the quiz based on the topic.'),
  questions: z.array(QuizQuestionSchema).describe('An array of quiz questions.'),
});

export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

const generateQuizPrompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `You are an expert educator. Generate a multiple-choice quiz based on the provided details.

Topic: {{{topic}}}
Target Grade Level: {{{forGradeLevel}}}
Number of Questions: {{{numQuestions}}}
{{#if additionalInstructions}}
Additional Instructions: {{{additionalInstructions}}}
{{/if}}

For each question, you must:
1.  Create a clear and concise question.
2.  Provide exactly 4 multiple-choice options.
3.  Identify the single correct answer.
4.  Provide a brief explanation for why that answer is correct.
5.  Generate a suitable title for the entire quiz based on the topic.`,
});

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  const { output } = await generateQuizPrompt(input, { model: 'googleai/gemini-3-flash-preview' });
  return output!;
}
