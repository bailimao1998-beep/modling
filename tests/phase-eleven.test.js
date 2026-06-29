import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getQuestionById } from '../src/data/questions.js';
import { renderRichMathText } from '../src/utils/richMathText.js';

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

const questionCardSource = readFileSync(new URL('../src/components/questionCard.js', import.meta.url), 'utf8');
const examSource = readFileSync(new URL('../src/pages/exam.js', import.meta.url), 'utf8');
const pastPaperIds = [
  'past-q1-recurrence',
  'past-q2-graph',
  'past-q3-laplacian-proof',
  'past-q4-probability',
  'past-q5-markov'
];

test('question card keeps raw radio values while rendering option labels as rich math', () => {
  assert.ok(questionCardSource.includes('value="${option}"'));
  assert.ok(questionCardSource.includes('<span>${renderRichMathText(option)}</span>'));
});

test('stepped live feedback uses rich math without changing score bookkeeping', () => {
  assert.ok(questionCardSource.includes('feedback.innerHTML = renderRichMathText(result.feedback)'));
  assert.ok(questionCardSource.includes('feedback.className = `step-live-feedback ${result.correct ? \'correct-text\' : \'wrong-text\'}`'));
  assert.ok(questionCardSource.includes('feedback.dataset.score = result.score'));
});

test('past paper exam renders its own training disclaimer', () => {
  assert.ok(examSource.includes("mode === 'past-paper-2024'"));
  assert.ok(examSource.includes('data-past-paper-notice'));
  assert.ok(examSource.includes('不代表学校正式评分'));
});

test('past paper questions remain five stepped sections totaling fifty marks', () => {
  const questions = pastPaperIds.map(getQuestionById);
  assert.ok(questions.every((question) => question.type === 'stepped'));
  assert.deepEqual(questions.map((question) => question.marks), [10, 10, 10, 8, 12]);
});

test('past paper stems are self-contained and rich-math ready', () => {
  const [recurrence, graph, proof, probability, markov] = pastPaperIds.map(getQuestionById);
  assert.ok(recurrence.question.includes('[x_{k+1},x_k]^T'));
  assert.ok(graph.question.includes('L=D-A'));
  assert.ok(proof.question.includes('positive semidefinite'));
  assert.ok(probability.question.includes('E[X²]'));
  assert.ok(probability.question.includes('Var(X)'));
  assert.ok(markov.question.includes('P=[['));
  assert.ok(pastPaperIds.map(getQuestionById).every((question) => renderRichMathText(question.question).includes('katex')));
});
