import assert from 'node:assert/strict';
import { getModuleTitle, modules } from '../src/data/modules.js';
import { lessons } from '../src/data/lessons.js';
import { questions } from '../src/data/questions.js';
import { getExamTemplate } from '../src/data/examTemplates.js';
import { applyQuestionProgress } from '../src/services/progress.js';
import {
  completeGraphAdjacency,
  degreeMatrix,
  laplacianMatrix,
  toggleUndirectedEdge,
  walkCount,
  cofactorMinor,
  spanningTreeCount
} from '../src/modules/graph/graphMath.js';
import {
  intervalProbability,
  triangularDensity,
  triangularMoments
} from '../src/modules/probability/probabilityMath.js';

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

function closeTo(actual, expected, epsilon = 1e-6) {
  assert.ok(Math.abs(actual - expected) <= epsilon, `${actual} is not close to ${expected}`);
}

test('looks up module labels without page-specific branching', () => {
  assert.equal(getModuleTitle('graph'), '图论');
  assert.equal(getModuleTitle('probability'), '概率论');
  assert.equal(getModuleTitle('unknown'), 'unknown');
});

test('a correct due review raises mastery and advances its schedule', () => {
  const state = {
    progress: { topics: { 'graph:adjacency': { mastery: 3 } } },
    reviewSchedule: {
      'g-q1': { questionId: 'g-q1', successCount: 1, nextReviewDate: '2026-06-28' }
    }
  };
  const question = { id: 'g-q1', module: 'graph', topic: 'graph:adjacency', difficulty: 'easy', type: 'matrix-fill', title: '邻接矩阵' };
  const outcome = applyQuestionProgress(state, question, { correct: true }, '2026-06-28');
  assert.equal(outcome.event, 'review-correct-48h');
  assert.equal(state.progress.topics['graph:adjacency'].mastery, 4);
  assert.equal(state.reviewSchedule['g-q1'].successCount, 2);
  assert.equal(state.reviewSchedule['g-q1'].nextReviewDate, '2026-07-02');
});

test('a wrong due review lowers mastery and returns the next day', () => {
  const state = {
    progress: { topics: { 'graph:adjacency': { mastery: 3 } } },
    reviewSchedule: {
      'g-q1': { questionId: 'g-q1', successCount: 2, nextReviewDate: '2026-06-27' }
    }
  };
  const question = { id: 'g-q1', module: 'graph', topic: 'graph:adjacency', difficulty: 'easy', type: 'matrix-fill', title: '邻接矩阵' };
  const outcome = applyQuestionProgress(state, question, { correct: false }, '2026-06-28');
  assert.equal(outcome.event, 'wrong');
  assert.equal(state.progress.topics['graph:adjacency'].mastery, 2);
  assert.equal(state.reviewSchedule['g-q1'].successCount, 0);
  assert.equal(state.reviewSchedule['g-q1'].nextReviewDate, '2026-06-29');
});

test('computes K4 matrices walks and spanning trees', () => {
  const adjacency = completeGraphAdjacency(4);
  assert.deepEqual(adjacency, [
    [0, 1, 1, 1],
    [1, 0, 1, 1],
    [1, 1, 0, 1],
    [1, 1, 1, 0]
  ]);
  assert.deepEqual(degreeMatrix(adjacency), [
    [3, 0, 0, 0],
    [0, 3, 0, 0],
    [0, 0, 3, 0],
    [0, 0, 0, 3]
  ]);
  assert.deepEqual(laplacianMatrix(adjacency), [
    [3, -1, -1, -1],
    [-1, 3, -1, -1],
    [-1, -1, 3, -1],
    [-1, -1, -1, 3]
  ]);
  assert.equal(walkCount(adjacency, 0, 2, 4).count, 20);
  assert.deepEqual(cofactorMinor(laplacianMatrix(adjacency), 0, 0), [
    [3, -1, -1],
    [-1, 3, -1],
    [-1, -1, 3]
  ]);
  assert.equal(spanningTreeCount(adjacency, 0, 0).count, 16);
});

test('toggles an undirected edge without mutating the source matrix', () => {
  const original = completeGraphAdjacency(4);
  const changed = toggleUndirectedEdge(original, 0, 1);
  assert.equal(changed[0][1], 0);
  assert.equal(changed[1][0], 0);
  assert.equal(original[0][1], 1);
});

test('integrates the triangular density on either side and across one', () => {
  assert.equal(triangularDensity(0.5), 0.5);
  assert.equal(triangularDensity(1.5), 0.5);
  closeTo(intervalProbability(0, 0.5).value, 0.125);
  closeTo(intervalProbability(1, 1.5).value, 0.375);
  const split = intervalProbability(0.5, 1.5);
  closeTo(split.value, 0.75);
  assert.equal(split.pieces.length, 2);
});

test('computes the triangular density moments', () => {
  const moments = triangularMoments();
  closeTo(moments.expectation, 1);
  closeTo(moments.secondMoment, 7 / 6);
  closeTo(moments.variance, 1 / 6);
});

test('opens graph and probability with complete lesson and question data', () => {
  assert.equal(modules.find((module) => module.id === 'graph').status, 'open');
  assert.equal(modules.find((module) => module.id === 'probability').status, 'open');
  assert.ok(lessons.graph?.goals.length >= 4);
  assert.ok(lessons.probability?.goals.length >= 4);
  assert.ok(questions.filter((question) => question.module === 'graph' && question.id.startsWith('g-q')).length >= 8);
  assert.ok(questions.filter((question) => question.module === 'probability' && question.id.startsWith('p-q')).length >= 8);
});

test('defines an open beta exam with five sections totaling fifty marks', () => {
  const template = getExamTemplate('full-beta');
  const examQuestions = template.questionIds.map((id) => questions.find((question) => question.id === id));
  assert.equal(template.status, 'open');
  assert.equal(examQuestions.length, 5);
  assert.equal(examQuestions.reduce((sum, question) => sum + question.marks, 0), 50);
});
