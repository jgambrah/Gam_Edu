
'use client';

// This file is now deprecated as its logic has been moved to server actions
// in /src/app/dashboard/early-years/actions.ts
// It is kept to prevent breaking imports in components that have not yet been refactored.

import { generateLessonImageAction } from '../actions';

/**
 * @deprecated Use the `generateLessonImageAction` server action instead.
 */
export const generateLessonImage = async (prompt: string): Promise<string | null> => {
  const result = await generateLessonImageAction(prompt);
  if (result.success) {
    return result.data || null;
  }
  return null;
};

// All other functions from this file have been moved and this file will be removed in a future step.
