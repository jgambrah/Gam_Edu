'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { checkAndSpendCredits } from '@/app/actions/credits';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic for the quiz.'),
  numQuestions: z.number().describe('The number of questions to generate.'),
  questionType: z.enum(['mcq', 'written', 'mixed']).optional().describe('The question format: mcq, written, or mixed.'),
  forGradeLevel: z.string().describe('The target grade level for the quiz (e.g., "Grade 5").'),
  additionalInstructions: z.string().optional().describe('Any additional instructions for the AI.'),
  schoolId: z.string().optional().describe('The ID of the school.'),
});

export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const QuizQuestionSchema = z.object({
    questionText: z.string().describe("The text of the quiz question."),
    type: z.enum(['mcq', 'written']).describe("The type of this question: 'mcq' or 'written'."),
    options: z.array(z.string()).describe("An array of 4 possible answers. For written type, this MUST be an empty array []."),
    correctAnswer: z.string().describe("For mcq, the exact correct answer from the options. For written, a clear sample reference answer (1-2 sentences)."),
    explanation: z.string().describe("A brief explanation or grading criteria for why the answer is correct."),
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
  prompt: `You are an expert educator. Generate a quiz based on the provided details.

Topic: {{{topic}}}
Target Grade Level: {{{forGradeLevel}}}
Number of Questions: {{{numQuestions}}}
Question Format Type: {{{questionType}}}
{{#if additionalInstructions}}
Additional Instructions: {{{additionalInstructions}}}
{{/if}}

RULES FOR QUESTION GENERATION:
1. Create a clear, engaging, and grade-appropriate question.
2. Respect the 'questionType' configuration parameter:
   - If 'mcq': The question must have type='mcq', provide exactly 4 distinct options in 'options', and set 'correctAnswer' to the exact correct option string.
   - If 'written': The question must have type='written', set 'options' to an empty array [], and set 'correctAnswer' to a clear example written answer (1-2 sentences) representing what the student should write.
   - If 'mixed': Alternate between 'mcq' and 'written' formats across the quiz questions.
3. For each question, provide a brief explanation or key grading criteria in 'explanation'.
4. Generate an exciting and suitable title for the entire quiz based on the topic.
5. IMPORTANT: For any mathematical expressions, equations, formulas, fractions, or notations, you MUST wrap them in LaTeX notation using single dollar signs ($) for inline math (e.g. $x^2$ or $\\frac{1}{2}$) or double dollar signs ($$) for block math equations. This applies to the question text, options, correct answers, and explanations. Do not use generic text notations like x^2 or 1/2.`,
});

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  if (input.schoolId) {
    const cost = 10; // Flat cost of 10 credits for quiz/assignment generation
    const creditResult = await checkAndSpendCredits(input.schoolId, cost);
    if (!creditResult.success) {
      throw new Error(creditResult.error || 'Insufficient AI credits.');
    }
  }

  const resolvedInput = {
    ...input,
    questionType: input.questionType || 'mcq',
  };
  const { output } = await generateQuizPrompt(resolvedInput, { model: 'googleai/gemini-3-flash-preview' });
  return output!;
}
