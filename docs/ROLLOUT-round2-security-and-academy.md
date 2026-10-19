# Rollout (round 2): sign-in checks, AI credits, quiz answers, XP, Senior Academy

Push this round **after** the term-close/keys round (docs/ROLLOUT-term-close-and-keys.md) is live and stable.
Every step can be repeated safely.

## What changes
- **Sign-in on the server**: the browser now keeps a sign-in cookie (`/api/auth/session`, set automatically by
  the app after sign-in). Every AI feature and credit charge checks it, so nobody outside a school can use or
  spend that school's AI credits. Students, teachers and parents notice nothing.
- **AI credits**: Senior Academy AI review charges the school; refunds if no review happened. The director
  "AI Auditor" now gives real AI answers from the dashboard's figures (1 credit per question). Fake numbers
  and fake "sent" messages on the director dashboard were removed or now open the real page (SMS, Accounts).
- **Quiz answers**: answers move to a teachers-only store (`quizKeys`); grading happens on the server.
- **XP and badges**: awarded on the server with a daily limit; students can no longer edit their own XP.
- **Senior Academy**: exam papers load on demand (from the shared question bank in Firestore first);
  teacher-made content is visible only to their own school; the shared bank needs sign-in to read.
- "Sunny Side Academy" placeholder names removed.

## Order
1. **Push the web app** (GitHub Desktop → Vercel). Wait for the deploy to finish.
2. **Ask everyone to refresh** (or wait until the next morning): the sign-in cookie is set when the page loads.
   If someone sees "Your session has expired" on an AI tool, a refresh fixes it.
3. **Deploy rules and functions**: `cd functions && npm run build`, then
   `firebase deploy --only firestore:rules,functions` (adds the `quizAnswerVault` function).
4. **Test**:
   - Student: take a quiz (score and answers appear after submitting); open a Mathematics past paper and a mock;
     submit a Senior Academy Paper 2 for AI review (school credits go down).
   - Teacher: create a quiz (open it again — answers are still there); create Senior Academy content.
   - Director: open the AI Auditor and ask a question (1 credit).
   - Any AI tool (lesson planner, AI chat).
5. **Hide answers in existing quizzes**: `cd functions && node hide-quiz-answers.js` (report), then `--apply`.
6. **Seed the shared question bank** (from the project root):
   `npx tsx scripts/seed-question-bank.ts` (report), then `npx tsx scripts/seed-question-bank.ts --apply`.
   Papers already in the bank are left alone unless you add `--force`.

7. **Refresh the Director dashboard figures now** (otherwise they update at midnight):
   `cd functions && npm run build && node rebuild-dashboard-summaries.js`
   Then Accounts > Student Billing (Load School Ledger, "All-Time Ledger") and the Director dashboard's
   receivables panel show the same gross debt, credits, net and aging tiers.

## If something goes wrong
- AI tools say "session expired" for everyone: check that the Vercel environment has `FIREBASE_PROJECT_ID`,
  `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` (the cookie needs them). Roll back the web app if needed.
- A teacher cannot save something on a student record: their account needs a `staff` document with a role.
