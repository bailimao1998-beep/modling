import assert from 'node:assert/strict';
import { multiplyMatrices, predictDistribution } from '../src/utils/math.js';
import { gradeQuestion, gradeStep } from '../src/services/grading.js';
import { getNextMastery } from '../src/services/progress.js';
import { getNextReviewDate } from '../src/services/spacedReview.js';

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

test('multiplies 2x2 matrices by row-column dot products', () => {
  assert.deepEqual(
    multiplyMatrices(
      [
        [1, 2],
        [3, 4]
      ],
      [
        [2, 0],
        [1, 2]
      ]
    ),
    [
      [4, 4],
      [10, 8]
    ]
  );
});

test('predicts a Markov distribution using row-vector convention', () => {
  const next = predictDistribution([1, 0, 0], [
    [0.4, 0.6, 0],
    [0.25, 0, 0.75],
    [1, 0, 0]
  ]);
  assert.deepEqual(next, [0.4, 0.6, 0]);
});

test('grades matrix entries and identifies the wrong element', () => {
  const result = gradeQuestion(
    {
      type: 'matrix-fill',
      answer: [
        [4, 4],
        [10, 8]
      ],
      marks: 4
    },
    [
      [4, 4],
      [9, 8]
    ]
  );
  assert.equal(result.correct, false);
  assert.equal(result.score, 3);
  assert.equal(result.stepResults[0].location, '第 2 行第 1 列');
});

test('grades one step without revealing the expected answer', () => {
  const step = {
    stepId: 's1',
    expectedAnswer: 4,
    marks: 1,
    validationType: 'numeric',
    feedbackCorrect: '正确。',
    feedbackWrong: '重新检查行乘列。'
  };
  const result = gradeStep(step, 3);
  assert.equal(result.correct, false);
  assert.equal(result.score, 0);
  assert.equal(result.feedback, '重新检查行乘列。');
  assert.equal('expectedAnswer' in result, false);
});

test('numeric feedback guides retry without exposing the full answer', () => {
  const result = gradeQuestion(
    { type: 'numeric-fill', answer: 10, marks: 2, errorTags: ['计算错误'] },
    9
  );
  assert.equal(result.correct, false);
  assert.equal(result.feedback.includes('10'), false);
});

test('updates mastery by evidence, with mistakes lowering confidence', () => {
  assert.equal(getNextMastery(0, { event: 'lesson-complete' }), 1);
  assert.equal(getNextMastery(1, { event: 'guided-correct' }), 2);
  assert.equal(getNextMastery(2, { event: 'independent-correct' }), 3);
  assert.equal(getNextMastery(4, { event: 'wrong' }), 3);
});

test('schedules spaced review by successful review count and mistakes', () => {
  assert.equal(getNextReviewDate('2026-06-21', 0, true), '2026-06-23');
  assert.equal(getNextReviewDate('2026-06-21', 2, true), '2026-06-29');
  assert.equal(getNextReviewDate('2026-06-21', 3, false), '2026-06-22');
});
