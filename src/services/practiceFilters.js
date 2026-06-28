export function filterQuestions(questions, state, filters = {}) {
  const { module = 'all', difficulty = 'all', errorType = 'all', reviewStatus = 'all' } = filters;
  const attempts = state?.attempts || {};
  const mistakes = state?.mistakes || [];

  return questions.filter((question) => {
    if (module !== 'all' && question.module !== module) return false;
    if (difficulty !== 'all' && question.difficulty !== difficulty) return false;
    if (errorType !== 'all' && !question.errorTags?.includes(errorType)) return false;

    const hasAttempt = Boolean(attempts[question.id]?.length);
    const wasWrong = mistakes.some((mistake) => mistake.questionId === question.id);
    if (reviewStatus === 'reviewed' && !hasAttempt) return false;
    if (reviewStatus === 'not-reviewed' && hasAttempt) return false;
    if (reviewStatus === 'wrong-before' && !wasWrong) return false;
    return true;
  });
}
