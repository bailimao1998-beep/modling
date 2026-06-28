import assert from 'node:assert/strict';
import { filterQuestions } from '../src/services/practiceFilters.js';
import {
  getErrorSummary,
  getSevenDayActivity,
  getStudyRecommendation,
  getScoreEstimate
} from '../src/services/analytics.js';

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

const sampleQuestions = [
  { id: 'm1', module: 'matrix', difficulty: 'easy', errorTags: ['计算错误'] },
  { id: 'm2', module: 'matrix', difficulty: 'exam', errorTags: ['行列式错误'] },
  { id: 'k1', module: 'markov', difficulty: 'medium', errorTags: ['计算错误'] }
];

test('filters practice questions across module difficulty error and review status', () => {
  const state = {
    attempts: { m1: [{ correct: false }], m2: [{ correct: true }] },
    mistakes: [{ questionId: 'm1', errorType: '计算错误' }]
  };
  const filtered = filterQuestions(sampleQuestions, state, {
    module: 'matrix',
    difficulty: 'easy',
    errorType: '计算错误',
    reviewStatus: 'wrong-before'
  });
  assert.deepEqual(filtered.map((question) => question.id), ['m1']);
});

test('aggregates error types topics and due mistakes', () => {
  const state = {
    mistakes: [
      { errorType: '计算错误', topic: 'matrix:multiplication', nextReviewDate: '2026-06-28' },
      { errorType: '计算错误', topic: 'markov:prediction', nextReviewDate: '2026-06-29' },
      { errorType: '行列式错误', topic: 'matrix:determinants', nextReviewDate: '2026-06-27' },
      { errorType: '计算错误', topic: 'matrix:multiplication', nextReviewDate: '2026-06-27', understoodAt: '2026-06-28T10:00:00Z' }
    ]
  };
  const summary = getErrorSummary(state, '2026-06-28');
  assert.equal(summary.byType['计算错误'], 3);
  assert.equal(summary.byTopic['matrix:determinants'], 1);
  assert.equal(summary.due.length, 2);
});

test('returns a continuous seven day attempt series', () => {
  const state = {
    attempts: {
      m1: [{ at: '2026-06-22T10:00:00Z' }, { at: '2026-06-28T09:00:00Z' }],
      k1: [{ at: '2026-06-28T11:00:00Z' }]
    }
  };
  const series = getSevenDayActivity(state, '2026-06-28');
  assert.equal(series.length, 7);
  assert.equal(series[0].date, '2026-06-22');
  assert.equal(series[0].count, 1);
  assert.equal(series[6].count, 2);
});

test('prioritizes due review work over new lessons', () => {
  const state = {
    reviewSchedule: {
      m1: { questionId: 'm1', title: '矩阵乘法', module: 'matrix', nextReviewDate: '2026-06-28' }
    },
    progress: { topics: {} }
  };
  const recommendation = getStudyRecommendation(state, [], sampleQuestions, '2026-06-28');
  assert.equal(recommendation.kind, 'review');
  assert.equal(recommendation.title, '矩阵乘法');
});

test('score estimate is explicitly bounded by module mastery', () => {
  const state = {
    progress: {
      topics: {
        'matrix:vectors': { mastery: 5 },
        'matrix:multiplication': { mastery: 3 }
      }
    }
  };
  const modules = [{ id: 'matrix', title: '数学基础', examWeight: 12, topics: ['matrix:vectors', 'matrix:multiplication'] }];
  const estimate = getScoreEstimate(state, modules);
  assert.equal(estimate[0].maxMarks, 12);
  assert.equal(estimate[0].estimatedMarks, 9.6);
});
