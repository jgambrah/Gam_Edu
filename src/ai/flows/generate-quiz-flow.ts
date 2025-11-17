'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic for the quiz.'),
  numQuestions: z.number().describe('The number of questions to generate.'),
});

export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const QuizQuestionSchema = z.object({
    questionText: z.string().describe("The text of the quiz question."),
    options: z.array(z.string()).describe("An array of possible answers."),
    correctAnswer: z.string().describe("The correct answer from the options."),
});

const GenerateQuizOutputSchema = z.object({
  title: z.string().describe('A suitable title for the quiz based on the topic.'),
  questions: z.array(QuizQuestionSchema).describe('An array of quiz questions.'),
});

export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `You are an expert educator. Generate a multiple-choice quiz about the given topic. Create a suitable title for the quiz. Generate exactly {{{numQuestions}}} questions. For each question, provide 4 options and identify the correct answer.

Topic: {{{topic}}}
Number of Questions: {{{numQuestions}}}`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);

    