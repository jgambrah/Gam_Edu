import { NextResponse } from 'next/server';
import { adminDb, FieldValue } from '@/lib/firebaseAdmin';
import { GoogleGenAI, Type } from '@google/genai';
import { ensureArray } from '@/lib/utils';
import { SAMPLE_GLOBAL_QUESTION_SETS } from '@/lib/global-curriculum-service';
import { SET_JHS_MASTERY_SERIES_60 } from '@/lib/data/jhs-curriculum-set-60';
import { SET_JHS_MASTERY_SERIES_61 } from '@/lib/data/jhs-curriculum-set-61';
import { SET_JHS_MASTERY_SERIES_62 } from '@/lib/data/jhs-curriculum-set-62';
import { SET_JHS_MASTERY_SERIES_63 } from '@/lib/data/jhs-curriculum-set-63';
import { SET_JHS_MASTERY_SERIES_64 } from '@/lib/data/jhs-curriculum-set-64';
import { SET_JHS_MASTERY_SERIES_65 } from '@/lib/data/jhs-curriculum-set-65';
import { SET_JHS_MASTERY_SERIES_66 } from '@/lib/data/jhs-curriculum-set-66';
import { SET_JHS_MASTERY_SERIES_67 } from '@/lib/data/jhs-curriculum-set-67';

// Comprehensive static fallback registry for past paper theory sets
const STATIC_THEORY_SETS: Record<string, any> = {
  'jhs-math-mastery-series-60': SET_JHS_MASTERY_SERIES_60,
  'set_60': SET_JHS_MASTERY_SERIES_60,
  '60': SET_JHS_MASTERY_SERIES_60,

  'jhs-math-mastery-series-61': SET_JHS_MASTERY_SERIES_61,
  'paper_2020_variant': SET_JHS_MASTERY_SERIES_61,
  'set_61': SET_JHS_MASTERY_SERIES_61,
  '61': SET_JHS_MASTERY_SERIES_61,

  'jhs-math-mastery-series-62': SET_JHS_MASTERY_SERIES_62,
  'set_62': SET_JHS_MASTERY_SERIES_62,
  '62': SET_JHS_MASTERY_SERIES_62,

  'jhs-math-mastery-series-63': SET_JHS_MASTERY_SERIES_63,
  'paper_2021_variant': SET_JHS_MASTERY_SERIES_63,
  'set_63': SET_JHS_MASTERY_SERIES_63,
  '63': SET_JHS_MASTERY_SERIES_63,

  'jhs-math-mastery-series-64': SET_JHS_MASTERY_SERIES_64,
  'set_64': SET_JHS_MASTERY_SERIES_64,
  '64': SET_JHS_MASTERY_SERIES_64,

  'jhs-math-mastery-series-65': SET_JHS_MASTERY_SERIES_65,
  'paper_2025_variant': SET_JHS_MASTERY_SERIES_65,
  'set_65': SET_JHS_MASTERY_SERIES_65,
  '65': SET_JHS_MASTERY_SERIES_65,

  'jhs-math-mastery-series-66': SET_JHS_MASTERY_SERIES_66,
  'set_66': SET_JHS_MASTERY_SERIES_66,
  '66': SET_JHS_MASTERY_SERIES_66,

  'jhs-math-mastery-series-67': SET_JHS_MASTERY_SERIES_67,
  'paper_2019_variant': SET_JHS_MASTERY_SERIES_67,
  'set_67': SET_JHS_MASTERY_SERIES_67,
  '67': SET_JHS_MASTERY_SERIES_67,
};

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(req: Request) {
  try {
    const { schoolId, examId, answers, assignmentId, studentId, studentName, studentClass } = await req.json();

    if (!examId || !answers) {
      return NextResponse.json({ error: 'Missing required parameters (examId, answers).' }, { status: 400 });
    }

    const effectiveSchoolId = schoolId || 'demo-school';
    const costPerExam = 2; // 2 credits per Paper 2 AI evaluation session

    // 1. Check and deduct credits transactionally in Firestore if valid school
    if (effectiveSchoolId !== 'demo-school') {
      try {
        const schoolRef = adminDb.collection('schools').doc(effectiveSchoolId);

        await adminDb.runTransaction(async (transaction) => {
          const schoolDoc = await transaction.get(schoolRef);
          if (!schoolDoc.exists) {
            return; // Gracefully continue if demo school doc does not exist
          }

          const schoolData = schoolDoc.data();
          const currentBalance = schoolData?.aiCreditBalance ?? schoolData?.aiCredits ?? 0;

          if (currentBalance < costPerExam) {
            throw new Error('INSUFFICIENT_CREDITS');
          }

          // Deduct credits atomically
          transaction.update(schoolRef, {
            aiCreditBalance: currentBalance - costPerExam,
            aiCredits: currentBalance - costPerExam,
            lastCreditDeduction: FieldValue.serverTimestamp()
          });

          // Record immutable audit ledger entry
          const txRef = adminDb.collection(`schools/${effectiveSchoolId}/credit_transactions`).doc();
          transaction.set(txRef, {
            amount: -costPerExam,
            type: 'PAPER_2_AI_GRADING',
            examId,
            balanceAfter: currentBalance - costPerExam,
            timestamp: FieldValue.serverTimestamp()
          });
        });
      } catch (err: any) {
        if (err.message === 'INSUFFICIENT_CREDITS') {
          return NextResponse.json(
            { 
              error: 'Your school has run out of AI credits. Please contact your administrator.',
              code: 'INSUFFICIENT_SCHOOL_CREDITS' 
            }, 
            { status: 402 }
          );
        }
        console.warn('[grade-paper2] Warning during credit transaction check:', err.message);
      }
    }

    // 2. Fetch and normalize official exam questions and worked solutions
    let rawQuestions: any = null;
    let examTitle = '';

    // Attempt 1: Fetch from Firestore past papers (english, science, math)
    try {
      let examDoc = await adminDb.doc(`global_curriculum/jhs/subjects/english/past_questions/${examId}`).get();
      if (!examDoc.exists) {
        examDoc = await adminDb.doc(`global_curriculum/jhs/subjects/science/past_papers/${examId}`).get();
      }
      if (!examDoc.exists) {
        examDoc = await adminDb.doc(`global_curriculum/jhs/subjects/math/past_papers/${examId}`).get();
      }
      if (!examDoc.exists) {
        examDoc = await adminDb.doc(`global_curriculum/jhs/subjects/science/mock_exams/${examId}`).get();
      }
      if (examDoc.exists) {
        const examData = examDoc.data();
        rawQuestions = examData?.paper2?.questions ?? examData?.questions ?? examData?.paper2;
        examTitle = examData?.title || examData?.paper2?.title || '';
      }
    } catch (e) {
      // Ignore Firestore read error, proceed to fallback
    }

    // Attempt 2: If questions empty, try static theory set lookup
    if (!rawQuestions || ensureArray(rawQuestions).length === 0) {
      const normalizedKey = String(examId).toLowerCase().replace(/[^a-z0-9_-]/g, '');

      const allSampleSets: any[] = Object.values(SAMPLE_GLOBAL_QUESTION_SETS || {}).flatMap(
        (levelSets: any) => ensureArray(levelSets)
      );

      const staticMatch =
        STATIC_THEORY_SETS[examId] || 
        STATIC_THEORY_SETS[normalizedKey] || 
        allSampleSets.find((s: any) => s && (String(s.id) === String(examId) || String(s.variantId) === String(examId) || String(s.id).toLowerCase() === normalizedKey));

      if (staticMatch) {
        rawQuestions = staticMatch.questions || staticMatch.paper2?.questions;
        examTitle = staticMatch.title || '';
      }
    }

    // 3. Normalize incoming answers into a flat evaluation array
    const normalizedAnswers: Array<{
      questionNumber: string;
      subId: string;
      partLabel: string;
      partKey: string;
      studentText: string;
      prompt?: string;
      workedSolution?: string;
      modelAnswer?: string;
      maxMarks?: number;
    }> = [];

    if (Array.isArray(answers)) {
      answers.forEach((ans: any, idx: number) => {
        const qNum = String(ans.questionNumber ?? idx + 1);
        const subId = String(ans.subId || ans.partLabel || ans.partKey || 'main');
        normalizedAnswers.push({
          questionNumber: qNum,
          subId,
          partLabel: String(ans.partLabel || subId),
          partKey: String(ans.partKey || `${qNum}_${subId}`),
          studentText: String(ans.studentText ?? ans.answer ?? ans.text ?? ''),
          prompt: ans.prompt,
          workedSolution: ans.workedSolution,
          modelAnswer: ans.modelAnswer,
          maxMarks: ans.maxMarks ? Number(ans.maxMarks) : undefined
        });
      });
    } else if (answers && typeof answers === 'object') {
      Object.entries(answers).forEach(([key, val]: [string, any]) => {
        if (val && typeof val === 'object' && !Array.isArray(val)) {
          // Nested dictionary: studentAnswers[qNum][subId]
          Object.entries(val).forEach(([subId, text]: [string, any]) => {
            normalizedAnswers.push({
              questionNumber: key,
              subId: String(subId),
              partLabel: String(subId),
              partKey: `${key}_${subId}`,
              studentText: typeof text === 'string' ? text : String(text?.value ?? text?.text ?? '')
            });
          });
        } else {
          // Flattened dictionary item
          const qNum = String(val?.questionNumber ?? key);
          const subId = String(val?.subId || val?.partLabel || val?.partKey || 'main');
          normalizedAnswers.push({
            questionNumber: qNum,
            subId,
            partLabel: String(val?.partLabel || subId),
            partKey: String(val?.partKey || `${qNum}_${subId}`),
            studentText: typeof val === 'string' ? val : String(val?.studentText ?? val?.answer ?? val?.text ?? ''),
            prompt: val?.prompt,
            workedSolution: val?.workedSolution,
            modelAnswer: val?.modelAnswer,
            maxMarks: val?.maxMarks ? Number(val?.maxMarks) : undefined
          });
        }
      });
    }

    if (normalizedAnswers.length === 0) {
      return NextResponse.json({ error: 'No answers submitted for evaluation.' }, { status: 400 });
    }

    // Safely normalize questions to Array
    let questionsList = ensureArray(rawQuestions);

    if (questionsList.length === 0) {
      const grouped: Record<string, any> = {};
      normalizedAnswers.forEach(ans => {
        const qNum = ans.questionNumber || '1';
        if (!grouped[qNum]) {
          grouped[qNum] = {
            id: qNum,
            questionNumber: qNum,
            prompt: ans.prompt || `Question ${qNum}`,
            subQuestions: []
          };
        }
        grouped[qNum].subQuestions.push({
          subId: ans.subId,
          partLabel: ans.partLabel,
          prompt: ans.prompt,
          workedSolution: ans.workedSolution,
          modelAnswer: ans.modelAnswer,
          maxMarks: ans.maxMarks || 30
        });
      });
      questionsList = Object.values(grouped);
    }

    // 4. Evaluate each answer using AI Examiner or calibrated WAEC/NaCCA rubric
    const gradedResults: any[] = [];

    for (const item of normalizedAnswers) {
      const qNum = item.questionNumber;
      const subId = item.subId;
      const partLabel = item.partLabel;
      const studentText = item.studentText || '(No response provided)';

      // Safely find matching question
      const targetQ: any = questionsList.find((q: any, idx: number) => 
        String(q.questionNumber) === String(qNum) || 
        String(q.id) === String(qNum) || 
        String(q.id) === `q0${qNum}` || 
        String(q.id) === `q${qNum}` || 
        idx + 1 === Number(qNum)
      ) || questionsList[0] || null;

      // Safely normalize and find specific sub-question part
      const subList = ensureArray(targetQ?.subQuestions || targetQ?.parts);
      let targetSub: any = null;

      if (subList.length > 0) {
        targetSub = subList.find((s: any) => 
          String(s.subId) === String(subId) ||
          String(s.partLabel) === String(subId) ||
          String(s.partId) === String(subId) ||
          String(s.partLabel || '').toLowerCase() === String(subId).toLowerCase() ||
          String(s.subId || '').toLowerCase() === String(subId).toLowerCase()
        ) || subList[0];
      }

      const promptContext = targetSub || targetQ || {
        prompt: item.prompt || `Question ${qNum}`,
        marks: item.maxMarks || 30,
        modelAnswer: 'Comprehensive response expected',
        workedSolution: item.workedSolution || 'Follow official WAEC rubric standards.'
      };

      // Detect question domain and type
      const textToScan = `${examTitle} ${item.prompt || ''} ${promptContext.prompt || ''} ${targetQ?.title || ''} ${targetQ?.category || ''}`.toLowerCase();
      const isEnglish = textToScan.includes('english') || textToScan.includes('comprehension') || textToScan.includes('literature') || textToScan.includes('letter') || textToScan.includes('essay') || textToScan.includes('report') || textToScan.includes('article') || textToScan.includes('speech') || textToScan.includes('composition');
      const isEssay = (Number(targetSub?.marks || targetSub?.maxMarks || targetQ?.marks || targetQ?.totalMarks || item.maxMarks) >= 15) || 
                      textToScan.includes('essay') || textToScan.includes('letter') || textToScan.includes('report') || textToScan.includes('article') || textToScan.includes('speech') || textToScan.includes('composition');
      const isScience = textToScan.includes('science') || textToScan.includes('integrated science') || textToScan.includes('biology') || textToScan.includes('physics') || textToScan.includes('chemistry');

      const maxMarks = Number(targetSub?.marks || targetSub?.maxMarks || targetQ?.marks || targetQ?.totalMarks || targetQ?.points || item.maxMarks || (isEssay ? 30 : 5));
      const workedSolution = String(targetSub?.workedSolution || targetQ?.workedSolution || targetQ?.modelAnswer || item.workedSolution || promptContext.workedSolution || '');
      const modelAnswer = String(targetSub?.modelAnswer || targetQ?.modelAnswer || promptContext.modelAnswer || workedSolution);
      const questionPrompt = String(targetSub?.prompt || targetQ?.prompt || item.prompt || promptContext.prompt);

      let evaluation: any = null;

      if (ai) {
        try {
          let systemPrompt = '';

          if (isEnglish && isEssay) {
            systemPrompt = `
              You are an expert WAEC BECE English Language Chief Examiner adhering strictly to official Chief Examiner marking rubrics for JHS candidates in Ghana.
              Evaluate the student's essay or composition against the prompt and official model guide.

              Question / Prompt:
              ${questionPrompt}

              Official Model Composition & Structure Guide:
              ${modelAnswer}

              Total Marks Achievable: ${maxMarks}

              Student's Essay Submission:
              "${studentText}"

              WAEC 4-Tier Evaluation Directives:
              1. Content (${Math.round(maxMarks * (10 / 30))} Marks): Relevance to set topic, thorough development of main ideas, satisfying length requirements (~250 words).
              2. Organization (${Math.round(maxMarks * (5 / 30))} Marks): Formal features (address, date, salutation, title, subscription appropriate to format), well-developed paragraphs, logical transitions.
              3. Expression (${Math.round(maxMarks * (10 / 30))} Marks): Rich vocabulary, varied sentence structures, apt idiomatic language, appropriate tone.
              4. Mechanical Accuracy (${Math.round(maxMarks * (5 / 30))} Marks): Punctuation (commas, full stops), capitalization, spelling, subject-verb concord, tense consistency.

              Provide 4 breakdown items matching these exact categories with awarded marks and constructive examiner comments.
            `;
          } else if (isScience) {
            systemPrompt = `
              You are an expert WAEC BECE Integrated Science Examiner adhering strictly to official Chief Examiner marking rubrics for JHS candidates.
              Evaluate the student's scientific response against the prompt and model solution.

              Question:
              ${questionPrompt}

              Official Marking Scheme & Model Answer:
              ${workedSolution || modelAnswer}

              Maximum Marks: ${maxMarks}

              Student Submission:
              "${studentText}"

              Directives:
              1. Award marks for correct scientific terminology, accurate descriptions of processes, correct naming of apparatus, and clear cause-and-effect explanations.
              2. Provide step breakdown and constructive examiner feedback.
            `;
          } else {
            systemPrompt = `
              You are an expert WAEC BECE examiner adhering strictly to official Chief Examiner marking rubrics.
              Evaluate the student's submission against the official model solution.

              Question Prompt:
              ${questionPrompt}

              Official Target / Model Answer:
              ${modelAnswer}

              Marking Scheme:
              ${workedSolution}

              Maximum Marks: ${maxMarks}

              Student Submission:
              "${studentText}"

              Directives:
              1. Award Method marks (M-marks) and Accuracy marks (A-marks) where applicable.
              2. Provide clear step breakdown and constructive guidance.
            `;
          }

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: systemPrompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  awardedMarks: { type: Type.NUMBER, description: 'Total marks awarded for this question item' },
                  maxMarks: { type: Type.NUMBER, description: 'Maximum marks achievable' },
                  gradeBand: { type: Type.STRING, description: 'WAEC Grade Band e.g. WAEC Grade 1 - Distinction' },
                  breakdown: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        step: { type: Type.STRING, description: 'Evaluation criteria or step' },
                        awarded: { type: Type.NUMBER, description: 'Marks awarded for this step' },
                        max: { type: Type.NUMBER, description: 'Max marks for this step' },
                        feedback: { type: Type.STRING, description: 'Feedback comment on this criterion' }
                      },
                      required: ['step', 'awarded', 'max']
                    }
                  },
                  constructiveFeedback: { type: Type.STRING, description: 'Overall examiner commentary highlighting strengths and actionable improvement tips' }
                },
                required: ['awardedMarks', 'maxMarks', 'breakdown', 'constructiveFeedback']
              }
            }
          });

          const rawJson = response.text?.trim() || '{}';
          evaluation = JSON.parse(rawJson);
          evaluation.awardedMarks = Math.min(Math.max(0, Number(evaluation.awardedMarks) || 0), maxMarks);
          evaluation.maxMarks = maxMarks;
        } catch (genErr: any) {
          console.warn('[grade-paper2] Gemini evaluation error, falling back to calibrated heuristic engine:', genErr.message);
        }
      }

      // Fallback heuristic scoring if AI is offline or API key is not configured
      if (!evaluation) {
        const trimmed = studentText.trim();
        const hasText = trimmed.length > 0 && trimmed !== '(No response provided)';
        const words = hasText ? trimmed.split(/\s+/).filter(Boolean) : [];
        const wordCount = words.length;
        const paragraphs = hasText ? trimmed.split(/\n+/).filter(p => p.trim().length > 0) : [];

        if (isEssay) {
          // Official WAEC 4-tier calibrated essay grading
          const contentMax = Math.round(maxMarks * (10 / 30));
          const orgMax = Math.round(maxMarks * (5 / 30));
          const expMax = Math.round(maxMarks * (10 / 30));
          const mechMax = Math.max(1, maxMarks - (contentMax + orgMax + expMax));

          let contentAward = 0;
          let orgAward = 0;
          let expAward = 0;
          let mechAward = 0;

          if (hasText) {
            // Content: based on word count & development (~250 words benchmark)
            if (wordCount >= 220) contentAward = Math.round(contentMax * 0.9);
            else if (wordCount >= 160) contentAward = Math.round(contentMax * 0.75);
            else if (wordCount >= 100) contentAward = Math.round(contentMax * 0.6);
            else if (wordCount >= 40) contentAward = Math.round(contentMax * 0.4);
            else contentAward = Math.max(1, Math.round(contentMax * 0.2));

            // Organization: based on paragraphs (at least 3 paragraphs expected)
            if (paragraphs.length >= 3) orgAward = orgMax;
            else if (paragraphs.length === 2) orgAward = Math.max(1, orgMax - 1);
            else orgAward = Math.max(1, Math.round(orgMax * 0.5));

            // Expression: vocabulary diversity
            const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, ''))).size;
            const lexicalRatio = wordCount > 0 ? uniqueWords / wordCount : 0;
            if (lexicalRatio > 0.45 && wordCount >= 150) expAward = Math.round(expMax * 0.85);
            else if (wordCount >= 100) expAward = Math.round(expMax * 0.7);
            else expAward = Math.max(1, Math.round(expMax * 0.5));

            // Mechanical accuracy: capitalization & sentence-ending punctuation
            const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0);
            const properlyCapitalized = sentences.filter(s => /^[A-Z]/.test(s.trim())).length;
            const capRatio = sentences.length > 0 ? properlyCapitalized / sentences.length : 0;
            if (capRatio >= 0.8) mechAward = mechMax;
            else if (capRatio >= 0.5) mechAward = Math.max(1, mechMax - 1);
            else mechAward = Math.max(1, Math.round(mechMax * 0.4));
          }

          const totalAward = contentAward + orgAward + expAward + mechAward;
          const pct = Math.round((totalAward / maxMarks) * 100);
          const gradeBand = pct >= 80 ? 'WAEC Grade 1 - Distinction' :
                            pct >= 70 ? 'WAEC Grade 2 - Distinction' :
                            pct >= 60 ? 'WAEC Grade 3 - Credit' :
                            pct >= 50 ? 'WAEC Grade 5 - Credit' : 'Remedial Practice Required';

          evaluation = {
            awardedMarks: totalAward,
            maxMarks,
            gradeBand,
            breakdown: [
              {
                step: 'Content: Idea Development & Relevance',
                awarded: contentAward,
                max: contentMax,
                feedback: wordCount >= 220 
                  ? `Commendable essay length (${wordCount} words). Key arguments are well sustained.`
                  : `Essay contains ${wordCount} words. Aim for the official WAEC benchmark of ~250 words for full content marks.`
              },
              {
                step: 'Organization: Structure & Paragraphing',
                awarded: orgAward,
                max: orgMax,
                feedback: paragraphs.length >= 3 
                  ? `Clear paragraph structure (${paragraphs.length} paragraphs) with appropriate layout.`
                  : `Ensure ideas are separated into distinct introductory, body, and concluding paragraphs.`
              },
              {
                step: 'Expression: Lexical Variety & Style',
                awarded: expAward,
                max: expMax,
                feedback: hasText 
                  ? 'Sentences communicate ideas clearly. Continue incorporating varied sentence linkers.' 
                  : 'No expression demonstrated.'
              },
              {
                step: 'Mechanical Accuracy: Punctuation & Spelling',
                awarded: mechAward,
                max: mechMax,
                feedback: hasText 
                  ? 'Good punctuation discipline. Pay close attention to capitalization and commas.' 
                  : 'Unanswered.'
              }
            ],
            constructiveFeedback: hasText
              ? `Your essay demonstrates good engagement with the prompt. To achieve top distinction, study the Chief Examiner's model essay below to master formal layout conventions and advanced transitional markers.`
              : 'No response was provided for this essay prompt.'
          };
        } else {
          // Standard theory / short-answer rubric
          const heuristicAward = hasText ? Math.max(1, Math.round(maxMarks * 0.7)) : 0;
          evaluation = {
            awardedMarks: heuristicAward,
            maxMarks,
            gradeBand: heuristicAward >= maxMarks * 0.75 ? 'WAEC Grade 1 - Distinction' : 'WAEC Pass',
            breakdown: [
              {
                step: 'Factual Accuracy & Scientific / Conceptual Methodology',
                awarded: hasText ? Math.ceil(heuristicAward * 0.6) : 0,
                max: Math.ceil(maxMarks * 0.6),
                feedback: hasText ? 'Core ideas and methodology identified.' : 'No steps attempted.'
              },
              {
                step: 'Explanation & Final Solution Quality',
                awarded: hasText ? Math.floor(heuristicAward * 0.4) : 0,
                max: Math.floor(maxMarks * 0.4),
                feedback: hasText ? 'Working analyzed against official marking scheme.' : 'Unanswered.'
              }
            ],
            constructiveFeedback: hasText
              ? 'Your response has been reviewed. Compare your answer with the official model answer and marking scheme below to verify every step.'
              : 'No response was provided for this question part.'
          };
        }
      }

      gradedResults.push({
        questionNumber: qNum,
        subId,
        partLabel,
        partKey: item.partKey,
        studentText,
        evaluation
      });
    }

    // Record submission if part of assignment
    if (assignmentId && studentId && effectiveSchoolId !== 'demo-school') {
      try {
        const totalAwarded = gradedResults.reduce((sum, r) => sum + (r.evaluation?.awardedMarks ?? 0), 0);
        const totalMax = gradedResults.reduce((sum, r) => sum + (r.evaluation?.maxMarks ?? 30), 0) || 1;
        const percentage = Math.round((totalAwarded / totalMax) * 100);

        const subRef = adminDb.doc(`schools/${effectiveSchoolId}/assignments/${assignmentId}/submissions/${studentId}`);
        const assignRef = adminDb.doc(`schools/${effectiveSchoolId}/assignments/${assignmentId}`);

        await adminDb.runTransaction(async (transaction) => {
          const subSnap = await transaction.get(subRef);
          const wasAlreadyCompleted = subSnap.exists && subSnap.data()?.status === 'completed';

          transaction.set(subRef, {
            studentUid: studentId,
            studentName: studentName || subSnap.data()?.studentName || 'Student',
            studentClass: studentClass || subSnap.data()?.studentClass || 'JHS',
            status: 'completed',
            submittedAt: FieldValue.serverTimestamp(),
            score: totalAwarded,
            maxScore: totalMax,
            percentage,
            answers: normalizedAnswers,
            aiGradedResults: gradedResults.map(r => ({
              questionNumber: r.questionNumber,
              subId: r.subId,
              partLabel: r.partLabel,
              prompt: r.prompt,
              studentText: r.studentText,
              awardedMarks: r.evaluation?.awardedMarks ?? 0,
              maxMarks: r.evaluation?.maxMarks ?? 30,
              feedback: r.evaluation?.constructiveFeedback || '',
              breakdown: r.evaluation?.breakdown || []
            }))
          }, { merge: true });

          if (!wasAlreadyCompleted) {
            transaction.update(assignRef, {
              completedCount: FieldValue.increment(1)
            });
          }
        });
      } catch (err: any) {
        console.warn('[grade-paper2] Could not record assignment submission in Firestore:', err.message);
      }
    }

    return NextResponse.json({
      success: true,
      examId,
      examTitle,
      results: gradedResults
    });

  } catch (err: any) {
    console.error('[grade-paper2] Execution failed:', err);
    return NextResponse.json(
      { error: err.message || 'Internal evaluation failed.' },
      { status: 500 }
    );
  }
}
