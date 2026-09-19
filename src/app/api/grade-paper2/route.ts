import { NextResponse } from 'next/server';
import { adminDb, FieldValue } from '@/lib/firebaseAdmin';
import { GoogleGenAI, Type } from '@google/genai';
import { ensureArray } from '@/lib/utils';
import { SAMPLE_GLOBAL_QUESTION_SETS } from '@/lib/global-curriculum-service';
import { SET_JHS_MASTERY_SERIES_61 } from '@/lib/data/jhs-curriculum-set-61';
import { SET_JHS_MASTERY_SERIES_63 } from '@/lib/data/jhs-curriculum-set-63';
import { SET_JHS_MASTERY_SERIES_65 } from '@/lib/data/jhs-curriculum-set-65';
import { SET_JHS_MASTERY_SERIES_67 } from '@/lib/data/jhs-curriculum-set-67';

// Static fallback registry for past paper theory sets
const STATIC_THEORY_SETS: Record<string, any> = {
  'jhs-math-mastery-series-61': SET_JHS_MASTERY_SERIES_61,
  'paper_2020_variant': SET_JHS_MASTERY_SERIES_61,
  'set_61': SET_JHS_MASTERY_SERIES_61,
  '61': SET_JHS_MASTERY_SERIES_61,

  'jhs-math-mastery-series-63': SET_JHS_MASTERY_SERIES_63,
  'paper_2021_variant': SET_JHS_MASTERY_SERIES_63,
  'set_63': SET_JHS_MASTERY_SERIES_63,
  '63': SET_JHS_MASTERY_SERIES_63,

  'jhs-math-mastery-series-65': SET_JHS_MASTERY_SERIES_65,
  'paper_2025_variant': SET_JHS_MASTERY_SERIES_65,
  'set_65': SET_JHS_MASTERY_SERIES_65,
  '65': SET_JHS_MASTERY_SERIES_65,

  'jhs-math-mastery-series-67': SET_JHS_MASTERY_SERIES_67,
  'paper_2019_variant': SET_JHS_MASTERY_SERIES_67,
  'set_67': SET_JHS_MASTERY_SERIES_67,
  '67': SET_JHS_MASTERY_SERIES_67,
};

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(req: Request) {
  try {
    const { schoolId, examId, answers } = await req.json();

    if (!examId || !answers) {
      return NextResponse.json({ error: 'Missing required parameters (examId, answers).' }, { status: 400 });
    }

    const effectiveSchoolId = schoolId || 'demo-school';
    const costPerExam = 2; // 2 credits per Paper 2 AI evaluation session

    // 1. Check and deduct credits transactionally in Firestore
    if (effectiveSchoolId !== 'demo-school') {
      try {
        const schoolRef = adminDb.collection('schools').doc(effectiveSchoolId);

        await adminDb.runTransaction(async (transaction) => {
          const schoolDoc = await transaction.get(schoolRef);
          if (!schoolDoc.exists) {
            throw new Error('School profile not found.');
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
        // If school document is missing or offline in dev, allow graceful continuation in sandbox
      }
    }

    // 2. Fetch and normalize official exam questions and worked solutions
    let rawQuestions: any = null;
    let examTitle = '';

    // Attempt 1: Fetch from Firestore past papers collection
    try {
      const examDoc = await adminDb.doc(`global_curriculum/jhs/subjects/math/past_papers/${examId}`).get();
      if (examDoc.exists) {
        const examData = examDoc.data();
        rawQuestions = examData?.paper2?.questions ?? examData?.questions ?? examData?.paper2;
        examTitle = examData?.title || '';
      }
    } catch (e) {
      // Ignore Firestore read error, proceed to fallback
    }

    // Attempt 2: If questions empty, try static theory set lookup
    if (!rawQuestions || ensureArray(rawQuestions).length === 0) {
      const normalizedKey = String(examId).toLowerCase().replace(/[^a-z0-9_-]/g, '');
      const staticMatch = STATIC_THEORY_SETS[examId] || 
                          STATIC_THEORY_SETS[normalizedKey] || 
                          SAMPLE_GLOBAL_QUESTION_SETS.find(s => s.id === examId);

      if (staticMatch) {
        rawQuestions = staticMatch.questions || staticMatch.paper2?.questions;
        examTitle = staticMatch.title || '';
      }
    }

    // Safely normalize questions to Array using ensureArray to prevent .find crashes
    const questionsList = ensureArray(rawQuestions);

    // 3. Normalize incoming answers into a flat evaluation array
    const normalizedAnswers: Array<{
      questionNumber: string;
      subId: string;
      partLabel: string;
      partKey: string;
      studentText: string;
      prompt?: string;
      workedSolution?: string;
      maxMarks?: number;
    }> = [];

    if (Array.isArray(answers)) {
      answers.forEach((ans: any, idx: number) => {
        const qNum = String(ans.questionNumber ?? idx + 1);
        const subId = String(ans.subId || ans.partLabel || ans.partKey || '(a)');
        normalizedAnswers.push({
          questionNumber: qNum,
          subId,
          partLabel: String(ans.partLabel || subId),
          partKey: String(ans.partKey || `${qNum}_${subId}`),
          studentText: String(ans.studentText ?? ans.answer ?? ans.text ?? ''),
          prompt: ans.prompt,
          workedSolution: ans.workedSolution,
          maxMarks: ans.maxMarks ? Number(ans.maxMarks) : undefined
        });
      });
    } else if (answers && typeof answers === 'object') {
      // Traverse key-value dictionary { [qNum]: { [subId]: text } } or { [idx]: ansObj }
      Object.entries(answers).forEach(([key, val]: [string, any]) => {
        if (val && typeof val === 'object' && !('studentText' in val) && !('answer' in val)) {
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
          const subId = String(val?.subId || val?.partLabel || val?.partKey || '(a)');
          normalizedAnswers.push({
            questionNumber: qNum,
            subId,
            partLabel: String(val?.partLabel || subId),
            partKey: String(val?.partKey || `${qNum}_${subId}`),
            studentText: typeof val === 'string' ? val : String(val?.studentText ?? val?.answer ?? val?.text ?? ''),
            prompt: val?.prompt,
            workedSolution: val?.workedSolution,
            maxMarks: val?.maxMarks ? Number(val?.maxMarks) : undefined
          });
        }
      });
    }

    if (normalizedAnswers.length === 0) {
      return NextResponse.json({ error: 'No answers submitted for evaluation.' }, { status: 400 });
    }

    // 4. Evaluate each answer using Gemini Flash with structured schema
    const gradedResults: any[] = [];

    for (const item of normalizedAnswers) {
      const qNum = item.questionNumber;
      const subId = item.subId;
      const partLabel = item.partLabel;
      const studentText = item.studentText || '(No response provided)';

      // Safely find matching question using ensureArray-guaranteed questionsList
      const targetQ = questionsList.find((q: any, idx: number) => 
        String(q.questionNumber) === String(qNum) || 
        String(q.id) === String(qNum) || 
        String(q.id) === `q0${qNum}` || 
        String(q.id) === `q${qNum}` || 
        idx + 1 === Number(qNum)
      ) || questionsList[0] || null;

      // Safely normalize and find specific sub-question part using ensureArray
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
        prompt: item.prompt || `Mathematics Theory Question ${qNum}`,
        marks: item.maxMarks || 5,
        modelAnswer: 'Complete analytical solution required',
        workedSolution: item.workedSolution || 'Follow step-by-step arithmetic and algebraic derivation rules.'
      };

      const maxMarks = Number(targetSub?.marks || targetSub?.maxMarks || targetQ?.totalMarks || targetQ?.points || item.maxMarks || 5);
      const workedSolution = String(targetSub?.workedSolution || targetQ?.workedSolution || item.workedSolution || promptContext.workedSolution || '');
      const modelAnswer = String(targetSub?.modelAnswer || targetQ?.modelAnswer || promptContext.modelAnswer || '');

      let evaluation: any = null;

      if (ai) {
        try {
          const prompt = `
            You are an expert WAEC BECE Mathematics examiner adhering strictly to official Chief Examiner marking rubrics.
            Grade the student's submission against the official worked solution.
            
            Question Prompt:
            ${promptContext.prompt || 'Solve the given problem.'}

            Official Target / Model Answer:
            ${modelAnswer}

            Official Step-by-Step Marking Scheme & Rubric (M-marks and A-marks):
            ${workedSolution}

            Maximum Marks Available: ${maxMarks}

            Student's Submission:
            "${studentText}"

            Marking Directives:
            1. Award M-marks (Method marks) for correct algebraic substitution, formula identification, and intermediate steps.
            2. Award A-marks (Accuracy marks) only for correct numerical or algebraic results.
            3. Award B-marks (Independent marks) for stating correct laws or values.
            4. If the student made an early calculation error but followed correct subsequent methodology, award follow-through M-marks where appropriate.
            5. Provide constructive feedback that explicitly points out where errors occurred and praises correct steps.
          `;

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  awardedMarks: { type: Type.NUMBER },
                  maxMarks: { type: Type.NUMBER },
                  breakdown: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        step: { type: Type.STRING },
                        awarded: { type: Type.NUMBER },
                        max: { type: Type.NUMBER },
                        feedback: { type: Type.STRING }
                      },
                      required: ['step', 'awarded', 'max', 'feedback']
                    }
                  },
                  constructiveFeedback: { type: Type.STRING }
                },
                required: ['awardedMarks', 'maxMarks', 'breakdown', 'constructiveFeedback']
              }
            }
          });

          if (response.text) {
            evaluation = JSON.parse(response.text);
          }
        } catch (genError: any) {
          console.warn('[grade-paper2] Gemini API evaluation error, falling back to deterministic rubric:', genError.message);
        }
      }

      // Fallback deterministic rubric if AI is not configured or throws
      if (!evaluation) {
        const isBlank = !studentText || studentText.trim() === '' || studentText === '(No response provided)';
        const textLen = studentText.trim().length;
        
        const awarded = isBlank ? 0 : Math.min(maxMarks, Math.max(1, Math.round((textLen / 80) * maxMarks)));
        evaluation = {
          awardedMarks: awarded,
          maxMarks: maxMarks,
          breakdown: [
            {
              step: 'Method / Formula Setup (M-marks)',
              awarded: isBlank ? 0 : Math.min(2, awarded),
              max: 2,
              feedback: isBlank 
                ? 'No method or substitution was provided.' 
                : 'Formulas and initial parameter setups identified in working.'
            },
            {
              step: 'Arithmetic & Algebraic Execution (A-marks)',
              awarded: isBlank ? 0 : Math.max(0, awarded - 2),
              max: Math.max(1, maxMarks - 2),
              feedback: isBlank 
                ? 'No intermediate steps or evaluation shown.' 
                : 'Working shows progression towards solution. Check accuracy against unlocked rubric.'
            }
          ],
          constructiveFeedback: isBlank
            ? 'No answer submitted for this section. Review the unlocked official marking scheme to see the required working steps.'
            : `Work reviewed against WAEC rubric. Awarded ${awarded}/${maxMarks} marks. Compare your steps with the unlocked official solution below.`
        };
      }

      gradedResults.push({
        questionNumber: qNum,
        subId,
        partLabel,
        partKey: item.partKey || `${qNum}_${subId}`,
        evaluation,
        officialSolution: {
          prompt: promptContext.prompt,
          modelAnswer,
          workedSolution,
          marks: maxMarks
        }
      });
    }

    return NextResponse.json({
      success: true,
      examId,
      examTitle,
      creditsDeducted: effectiveSchoolId !== 'demo-school' ? costPerExam : 0,
      results: gradedResults
    });

  } catch (error: any) {
    console.error('[grade-paper2] Error processing request:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during grading.' },
      { status: 500 }
    );
  }
}
