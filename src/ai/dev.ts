import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-school-notices.ts';
import '@/ai/flows/generate-quiz-flow.ts';
import '@/ai/flows/generate-timetable-flow.ts';
import '@/ai/flows/identify-and-mark-attendance-flow.ts';
    
