
'use server';
/**
 * @fileOverview AI flows for forum moderation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// --- 1. Content Safety Validation ---
const ValidateContentInputSchema = z.object({
  content: z.string().describe('The user-submitted text to be validated.'),
});

const ValidateContentOutputSchema = z.object({
  isSafe: z.boolean().describe('Whether the content is considered safe and appropriate for a school forum.'),
  reason: z.string().optional().describe('A brief explanation if the content is not safe.'),
});

export async function validateContentSafety(input: z.infer<typeof ValidateContentInputSchema>): Promise<z.infer<typeof ValidateContentOutputSchema>> {
  const safetyPrompt = ai.definePrompt({
    name: 'forumSafetyPrompt',
    input: { schema: ValidateContentInputSchema },
    output: { schema: ValidateContentOutputSchema },
    prompt: `You are a content moderator for a school forum. Analyze the following text for any of the following: profanity, bullying, harassment, hate speech, or other inappropriate content.

You must determine if the content is safe for the forum.

Content:
"{{{content}}}"

Respond with only a JSON object.`,
  });

  const { output } = await safetyPrompt(input);
  return output!;
}


// --- 2. AI Moderator Comment Generation ---
const GenerateModeratorCommentInputSchema = z.object({
  threadTitle: z.string(),
  threadContent: z.string(),
  previousReplies: z.string().describe('A summary or list of previous replies in the thread.'),
});

const GenerateModeratorCommentOutputSchema = z.object({
  comment: z.string().describe('A helpful, guiding comment from the AI moderator to encourage discussion, clarify a point, or ask a follow-up question.'),
});

export async function generateAIModeratorComment(input: z.infer<typeof GenerateModeratorCommentInputSchema>): Promise<z.infer<typeof GenerateModeratorCommentOutputSchema>> {
  const moderatorPrompt = ai.definePrompt({
    name: 'forumModeratorCommentPrompt',
    input: { schema: GenerateModeratorCommentInputSchema },
    output: { schema: GenerateModeratorCommentOutputSchema },
    prompt: `You are an AI Discussion Moderator in a school forum. Your goal is to keep conversations productive, on-topic, and engaging.

A user has created a thread:
Title: {{{threadTitle}}}
Content: {{{threadContent}}}

The conversation so far:
{{{previousReplies}}}

Based on this, generate a helpful and encouraging comment. You could:
- Ask a thought-provoking follow-up question.
- Gently steer the conversation back on topic if it's drifting.
- Provide a neutral, factual point to consider.
- Encourage students to explore different perspectives.

Your comment should be brief, friendly, and add value to the discussion.`,
  });

  const { output } = await moderatorPrompt(input);
  return output!;
}

