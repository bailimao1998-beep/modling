import { nearlyEqual } from '../utils/math.js';

function normalizeText(value) {
  return String(value ?? '').trim().toLowerCase();
}

function compareNumeric(actual, expected) {
  return nearlyEqual(Number(actual), Number(expected));
}

function compareMatrix(actual, expected) {
  const stepResults = [];
  let score = 0;
  expected.forEach((row, rowIndex) => {
    row.forEach((expectedValue, colIndex) => {
      const userValue = actual?.[rowIndex]?.[colIndex];
      const correct = compareNumeric(userValue, expectedValue);
      if (correct) score += 1;
      else {
        stepResults.push({
          correct: false,
          location: `第 ${rowIndex + 1} 行第 ${colIndex + 1} 列`,
          expected: expectedValue,
          actual: userValue
        });
      }
    });
  });
  return { score, stepResults };
}

function compareByType(actual, expected, validationType = 'text') {
  if (validationType === 'numeric') return compareNumeric(actual, expected);
  if (validationType === 'matrix') return JSON.stringify(actual) === JSON.stringify(expected);
  return normalizeText(actual) === normalizeText(expected);
}

export function gradeStep(step, userAnswer) {
  const correct = compareByType(userAnswer, step.expectedAnswer, step.validationType);
  return {
    stepId: step.stepId,
    correct,
    score: correct ? step.marks : 0,
    maxScore: step.marks,
    feedback: correct ? step.feedbackCorrect : step.feedbackWrong
  };
}

export function gradeQuestion(question, userAnswer) {
  if (question.type === 'single-choice') {
    const correct = normalizeText(userAnswer) === normalizeText(question.answer);
    return {
      correct,
      score: correct ? question.marks : 0,
      maxScore: question.marks,
      feedback: correct ? '回答正确。' : '选项不正确，请回到定义重新判断。',
      errorType: correct ? null : question.errorTags?.[0]
    };
  }

  if (question.type === 'numeric-fill') {
    const correct = compareNumeric(userAnswer, question.answer);
    return {
      correct,
      score: correct ? question.marks : 0,
      maxScore: question.marks,
      feedback: correct ? '数值正确。' : '这个数值还不对，请检查公式、代入和运算步骤。',
      errorType: correct ? null : question.errorTags?.[0]
    };
  }

  if (question.type === 'matrix-fill') {
    const { score, stepResults } = compareMatrix(userAnswer, question.answer);
    const maxScore = question.answer.length * question.answer[0].length;
    const correct = score === maxScore;
    return {
      correct,
      score,
      maxScore,
      stepResults,
      firstWrongStep: stepResults[0]?.location,
      feedback: correct ? '矩阵每个元素都正确。' : `${stepResults[0].location} 的计算需要检查。`,
      errorType: correct ? null : question.errorTags?.[0]
    };
  }

  if (question.type === 'stepped') {
    const stepResults = question.steps.map((step) => ({
      ...gradeStep(step, userAnswer?.[step.stepId]),
      prompt: step.prompt
    }));
    const score = stepResults.reduce((total, item) => total + item.score, 0);
    const maxScore = stepResults.reduce((total, item) => total + item.maxScore, 0);
    const firstWrong = stepResults.find((item) => !item.correct);
    return {
      correct: score === maxScore,
      score,
      maxScore,
      stepResults,
      firstWrongStep: firstWrong?.prompt,
      feedback: score === maxScore ? '步骤完整正确。' : '还有步骤需要修正。',
      errorType: firstWrong ? question.errorTags?.[0] : null
    };
  }

  return { correct: false, score: 0, maxScore: question.marks || 1, feedback: '暂不支持该题型。' };
}
