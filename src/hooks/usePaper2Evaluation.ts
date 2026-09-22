import { useState } from 'react';
import { toSafeArray } from '@/components/exam/Paper2ExamRunner';

export function usePaper2Evaluation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradingResults, setGradingResults] = useState<any[]>([]);
  const [gradingError, setGradingError] = useState<string | null>(null);

  const evaluateAnswers = async ({
    schoolId,
    examId,
    exam,
    studentAnswers,
  }: {
    schoolId?: string;
    examId?: string;
    exam?: any;
    studentAnswers?: any;
  }) => {
    try {
      setIsSubmitting(true);
      setGradingError(null);

      // 1. Defensively normalize questions list
      const rawQuestions = exam?.paper2?.questions ?? exam?.questions;
      const questionsList = toSafeArray(rawQuestions);

      if (questionsList.length === 0) {
        throw new Error('No Paper 2 questions found in this exam variant.');
      }

      // 2. Build flattened answer items safely regardless of how studentAnswers is stored
      const formattedAnswers: Array<{
        questionNumber: string;
        subId: string;
        prompt: string;
        studentText: string;
        maxMarks: number;
        workedSolution: string;
      }> = [];

      if (Array.isArray(studentAnswers)) {
        studentAnswers.forEach((ans: any) => {
          const targetQ = questionsList.find(
            (q: any) => String(q?.questionNumber || q?.id) === String(ans?.questionNumber)
          );
          const subList = toSafeArray(targetQ?.subQuestions ?? targetQ?.parts);

          if (subList.length > 0) {
            const targetSub = subList.find(
              (s: any) => String(s?.subId || s?.partLabel || s?.partId) === String(ans?.subId)
            );

            if (targetSub) {
              formattedAnswers.push({
                questionNumber: String(ans.questionNumber || targetQ?.questionNumber || '1'),
                subId: String(ans.subId || targetSub.subId || '(a)'),
                prompt: targetSub.prompt || '',
                studentText: ans.studentText || ans.text || '',
                maxMarks: Number(targetSub.maxMarks || targetSub.marks) || 5,
                workedSolution: targetSub.workedSolution || targetSub.modelAnswer || ''
              });
            }
          } else if (targetQ) {
            const text = ans.studentText || ans.text || '';
            if (text.trim().length > 0) {
              formattedAnswers.push({
                questionNumber: String(ans.questionNumber || targetQ?.questionNumber || '1'),
                subId: 'main',
                prompt: targetQ.prompt || '',
                studentText: text,
                maxMarks: Number(targetQ.marks || targetQ.totalMarks || targetQ.points) || 30,
                workedSolution: targetQ.workedSolution || targetQ.modelAnswer || ''
              });
            }
          }
        });
      } else if (studentAnswers && typeof studentAnswers === 'object') {
        Object.entries(studentAnswers).forEach(([qNum, subMap]: [string, any]) => {
          const targetQ = questionsList.find(
            (q: any) => String(q?.questionNumber || q?.id) === String(qNum)
          );
          const subList = toSafeArray(targetQ?.subQuestions ?? targetQ?.parts);

          if (subMap && typeof subMap === 'object' && !Array.isArray(subMap)) {
            Object.entries(subMap).forEach(([subId, val]: [string, any]) => {
              const targetSub = subList.find(
                (s: any) => String(s?.subId || s?.partLabel || s?.partId) === String(subId)
              );

              const text = typeof val === 'string' ? val : val?.text || val?.value || '';
              if (text.trim().length > 0) {
                formattedAnswers.push({
                  questionNumber: String(qNum),
                  subId: String(subId),
                  prompt: targetSub?.prompt || targetQ?.prompt || '',
                  studentText: text,
                  maxMarks: Number(targetSub?.maxMarks || targetSub?.marks || targetQ?.marks || targetQ?.totalMarks) || 5,
                  workedSolution: targetSub?.workedSolution || targetSub?.modelAnswer || targetQ?.workedSolution || targetQ?.modelAnswer || ''
                });
              }
            });
          } else {
            const text = typeof subMap === 'string' ? subMap : subMap?.text || subMap?.value || '';
            if (text.trim().length > 0) {
              formattedAnswers.push({
                questionNumber: String(qNum),
                subId: 'main',
                prompt: targetQ?.prompt || '',
                studentText: text,
                maxMarks: Number(targetQ?.marks || targetQ?.totalMarks || targetQ?.points) || 30,
                workedSolution: targetQ?.workedSolution || targetQ?.modelAnswer || ''
              });
            }
          }
        });
      }

      if (formattedAnswers.length === 0) {
        throw new Error('Please write an answer for at least one question before submitting.');
      }

      // 3. Post to evaluation endpoint
      const response = await fetch('/api/grade-paper2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId: schoolId || 'demo-school',
          examId: examId || exam?.id || exam?.variantId || (exam?.year ? `paper_${exam.year}_variant` : 'bece_paper2'),
          answers: formattedAnswers
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Evaluation failed with status ${response.status}`);
      }

      // 4. Update state safely
      const safeResults = toSafeArray(data.results);
      setGradingResults(safeResults);
      return safeResults;
    } catch (err: any) {
      console.error('Grading execution failed:', err);
      setGradingError(err.message || 'Failed to complete evaluation.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    gradingResults,
    gradingError,
    evaluateAnswers,
  };
}
