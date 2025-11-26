'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-school-notices.ts';
import '@/ai/flows/generate-quiz-flow.ts';
import '@/ai/flows/generate-timetable-flow.ts';
import '@/ai/flows/generate-lesson-ideas-flow.ts';
import '@/ai/flows/generate-practice-problems-flow.ts';
import '@/ai/flows/generate-reading-passage-flow.ts';
import '@/ai/flows/generate-writing-challenge-flow.ts';
    