
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// --- SHARED STUDENT CATEGORIES ---
const StudentCategory = z.enum([
  'Early Childhood', 
  'Lower Primary', 
  'Upper Primary', 
  'Junior Secondary (JHS)', 
  'Senior Secondary (SHS)'
]);

const AIContextSchema = z.object({
  topic: z.string(),
  gradeLevel: StudentCategory,
  instructions: z.string().optional(),
});

// --- 1. ENGLISH MASTERY ---
const EnglishSchema = z.object({
  title: z.string(),
  content: z.string(),
  genre: z.string(),
  difficulty: StudentCategory,
  quiz: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).length(3),
});

export async function generateSeniorEnglish(context: z.infer<typeof AIContextSchema>) {
  try {
    const prompt = `Generate a grade-appropriate literary passage for a student in ${context.gradeLevel}.
    Topic: "${context.topic}"
    Difficulty Level: ${context.gradeLevel}
    Instructions: ${context.instructions || 'Standard academic level'}
    Return a title, genre, and 3 comprehension questions.`;
    const { output } = await ai.generate({ prompt, output: { schema: EnglishSchema } });
    return { success: true, data: output };
  } catch (error) {
    return { success: false, error: "Failed to generate English module." };
  }
}

// --- 2. ADVANCED MATH LAB ---
const MathSchema = z.object({
    title: z.string().describe("Name of problem"),
    category: z.string().describe("Broad area: Algebra, Geometry, Statistics, Number Theory, etc."),
    subTopic: z.string().describe("Specific area: Linear Equations, Fractions, Differentiation, etc."),
    latexFormula: z.string().describe("LaTeX formula without dollar signs"),
    instruction: z.string(),
    answer: z.string(),
});

export async function generateSeniorMath(context: z.infer<typeof AIContextSchema>) {
  try {
    const prompt = `Act as a Math Professor for ${context.gradeLevel} students.
    Generate a question about: ${context.topic}.
    Important: The math complexity MUST match ${context.gradeLevel} standards.
    Instructions: ${context.instructions || 'None'}.
    Provide a subTopic name and a LaTeX formula.`;
    const { output } = await ai.generate({ prompt, output: { schema: MathSchema } });
    return { success: true, data: { ...output, gradeLevel: context.gradeLevel } };
  } catch (error) {
    return { success: false, error: "Failed to generate Math module." };
  }
}

// --- 3. DISCOVERY LAB ---
const LabSchema = z.object({
    title: z.string(),
    category: z.string(),
    icon: z.string(),
    background: z.string(),
    question: z.string(),
    hypothesisPrompt: z.string(),
    hypothesisOptions: z.array(z.string()).length(3),
    conclusion: z.string(),
    explanation: z.string(),
});

export async function generateSeniorLab(context: z.infer<typeof AIContextSchema>) {
  try {
    const prompt = `Design a science lab for ${context.gradeLevel} students.
    Topic: "${context.topic}"
    Ensure logic matches ${context.gradeLevel} cognitive development.`;
    const { output } = await ai.generate({ prompt, output: { schema: LabSchema } });
    return { success: true, data: { ...output, gradeLevel: context.gradeLevel } };
  } catch (error) {
    return { success: false, error: "Failed to generate Science module." };
  }
}
