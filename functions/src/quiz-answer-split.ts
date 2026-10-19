/** Pure helper shared by the quizAnswerVault function and the one-time hide-quiz-answers.js script. */
export function splitQuizAnswers(quiz: any): { stripped: any[]; keys: { correctAnswer: string; explanation: string }[] } | null {
  const questions: any[] = Array.isArray(quiz?.questions) ? quiz.questions : [];
  const hasAnswers = questions.some(q => q && ((q.correctAnswer ?? '') !== '' || (q.explanation ?? '') !== ''));
  if (!hasAnswers) return null;
  const keys = questions.map(q => ({ correctAnswer: String(q?.correctAnswer ?? ''), explanation: String(q?.explanation ?? '') }));
  const stripped = questions.map(q => {
    if (!q || typeof q !== 'object') return q;
    const { correctAnswer, explanation, ...rest } = q;
    return rest;
  });
  return { stripped, keys };
}
