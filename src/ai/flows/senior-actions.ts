
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// --- 0. AI CONTEXT SCHEMA (NEW) ---
const AIContextSchema = z.object({
  topic: z.string(),
  difficulty: z.string().optional(),
  gradeLevel: z.string().optional(),
  instructions: z.string().optional(),
});


// --- 1. ENGLISH MASTERY ---

const EnglishSchema = z.object({
  title: z.string().describe("An academic title for the passage."),
  content: z.string().describe("A long multi-paragraph story about the topic."),
  genre: z.string().describe("The genre of the passage (e.g., Narrative, Historical Fiction, Sci-Fi)."),
  difficulty: z.enum(['JHS', 'SHS', 'University']),
  quiz: z.array(
    z.object({
      question: z.string().describe("A critical thinking question about the passage."),
      answer: z.string().describe("A concise, correct answer to the question.")
    })
  ).length(3).describe("An array of exactly 3 comprehension questions."),
});


export async function generateSeniorEnglish(context: z.infer<typeof AIContextSchema>) {
  try {
    const prompt = `Generate an advanced literary passage based on this context:
    Topic: "${context.topic}"
    Difficulty: ${context.difficulty}
    Grade Level: ${context.gradeLevel}
    Specific Instructions: ${context.instructions || 'None'}
    
    Include a title, genre, difficulty, and exactly 3 critical thinking questions with answers.`;
    const { output } = await ai.generate({ prompt, output: { schema: EnglishSchema } });
    if (!output) throw new Error("AI did not return a valid English passage object.");
    return { success: true, data: output };
  } catch (error: any) {
    console.error("English AI Error:", error);
    return { success: false, error: "Failed to generate English module." };
  }
}

// --- 2. ADVANCED MATH LAB ---

const MathSchema = z.object({
    title: z.string().describe("The name of the math problem (e.g. 'Quadratic Roots')."),
    category: z.string().describe("The math category (e.g. Algebra, Calculus)."),
    latexFormula: z.string().describe("A complex mathematical formula formatted in LaTeX."),
    instruction: z.string().describe("A clear instruction for the student (e.g. 'Solve for x')."),
    answer: z.string().describe("The final, single correct answer to the problem."),
});

export async function generateSeniorMath(context: z.infer<typeof AIContextSchema>) {
  try {
    const prompt = `Create an advanced math problem based on this context:
    Concept: "${context.topic}"
    Difficulty: ${context.difficulty}
    Grade Level: ${context.gradeLevel}
    Specific Instructions: ${context.instructions || 'None'}
    
    Provide a title, category, a complex LaTeX formula, an instruction, and a single, precise answer.`;
    const { output } = await ai.generate({ prompt, output: { schema: MathSchema } });
    if (!output) throw new Error("AI did not return a valid Math problem object.");
    return { success: true, data: output };
  } catch (error: any) {
    console.error("Math AI Error:", error);
    return { success: false, error: "Failed to generate Math module." };
  }
}


// --- 3. DISCOVERY LAB ---

const LabSchema = z.object({
    title: z.string().describe("The title of the experiment (e.g. 'Testing Gravity')."),
    category: z.string().describe("The field of science (e.g. Physics, Biology)."),
    icon: z.string().describe("A single emoji representing the experiment (e.g., '🍎')."),
    background: z.string().describe("A brief background or field notes for the experiment."),
    question: z.string().describe("The core scientific question being investigated."),
    hypothesisPrompt: z.string().describe("A prompt for the user to form their hypothesis."),
    hypothesisOptions: z.array(z.string()).length(3).describe("Three opposing hypothesis options for the user."),
    conclusion: z.string().describe("The scientific conclusion or finding of the experiment."),
    explanation: z.string().describe("A detailed explanation of why the conclusion is correct."),
});

export async function generateSeniorLab(context: z.infer<typeof AIContextSchema>) {
  try {
    const prompt = `Design a virtual science lab experiment based on this context:
    Topic: "${context.topic}"
    Difficulty: ${context.difficulty}
    Grade Level: ${context.gradeLevel}
    Specific Instructions: ${context.instructions || 'None'}
    
    Structure it according to the scientific method: Background, Research Question, Hypothesis (with three options), Conclusion, and Explanation. Include a title, category, and an emoji icon.`;
    const { output } = await ai.generate({ prompt, output: { schema: LabSchema } });
    if (!output) throw new Error("AI did not return a valid Science Lab object.");
    return { success: true, data: output };
  } catch (error: any) {
    console.error("Science AI Error