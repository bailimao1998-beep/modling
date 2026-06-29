import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getExamTemplate } from '../src/data/examTemplates.js';
import { getQuestionById } from '../src/data/questions.js';

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const template = getExamTemplate('past-paper-2024');
const pastPaperQuestions = template.questionIds.map(getQuestionById);
const [q1, q2, q3, q4, q5] = pastPaperQuestions;

test('past-paper-2024 uses five exact past paper questions only', () => {
  assert.equal(template.id, 'past-paper-2024');
  assert.equal(pastPaperQuestions.length, 5);
  assert.ok(pastPaperQuestions.every(Boolean));
  assert.ok(pastPaperQuestions.every((question) => question.source === '2024-2025 past paper'));
  assert.ok(pastPaperQuestions.every((question) => question.sourceType === 'exact-past-paper'));
  assert.ok(!pastPaperQuestions.some((question) => question.sourceType === 'adapted-practice'));
});

test('Q1 matches the recurrence conditions values matrix and eigenvalue training', () => {
  assert.ok(q1.question.includes('x0=0'));
  assert.ok(q1.question.includes('x1=1'));
  assert.ok(q1.question.includes('x_{k+2}=2x_{k+1}-2x_k'));
  assert.deepEqual(q1.answer, {
    s1: 2,
    s2: 2,
    s3: 0,
    s4: -4,
    s5: -8,
    s6: 2,
    s7: -2,
    s8: 1,
    s9: 0,
    s10: 'x_{k+1},x_k',
    s11: '1+i',
    s12: '1-i'
  });
  assert.ok(q1.hints.some((hint) => hint.includes('A=[[2,-2],[1,0]]')));
  assert.ok(q1.steps.some((step) => step.prompt.includes('explicit expression')));
  assert.ok(q1.steps.some((step) => step.prompt.includes('eigenvalue')));
});

test('Q2 uses length 4 walks for K4 and the exact spanning tree result', () => {
  assert.ok(q2.question.includes('K4'));
  assert.ok(q2.question.includes('length 4 walks'));
  assert.ok(q2.question.includes('(A^4)_13'));
  assert.equal(q2.answer.s2, 20);
  assert.equal(q2.answer.s4, 16);
  assert.ok(!q2.question.includes('(A^2)_13'));
});

test('Q3 states the normalized Laplacian proof template without free-text scoring', () => {
  assert.ok(q3.question.includes('L_sym=I-D^{-1/2}AD^{-1/2}'));
  assert.ok(q3.question.includes('f^T L_sym f'));
  assert.ok(q3.question.includes('positive semidefinite'));
  assert.ok(q3.explanation.includes('不是完整自由文本评分'));
});

test('Q4 includes the die-repeat probability and the calibrated triangular density facts', () => {
  assert.ok(q4.question.includes('fair die rolled six times'));
  assert.ok(q4.question.includes('至少一个重复'));
  assert.equal(q4.answer.s1, '1 - 5!/6^5');
  assert.ok(q4.steps.find((step) => step.stepId === 's1').feedbackCorrect.includes('0.9846'));
  assert.ok(q4.question.includes('P(X≤0.5)=1/8'));
  assert.equal(q4.answer.s2, 0.125);
  assert.equal(q4.answer.s3, 1);
  assert.equal(q4.answer.s4, 1.166667);
  assert.equal(q4.answer.s5, 0.166667);
  assert.ok(!q4.question.includes('P(0.5≤X≤1.5)'));
});

test('Q5 matches the exact Markov initial distribution one-step and stationary distribution', () => {
  assert.ok(q5.question.includes('sunny, cloudy, rainy'));
  assert.ok(q5.question.includes('P=[[2/5,3/5,0],[1/4,0,3/4],[1,0,0]]'));
  assert.ok(q5.question.includes('ρ0=[1/2,1/2,0]'));
  assert.ok(q5.question.includes('ρ1=[13/40,3/10,3/8]'));
  assert.ok(q5.question.includes('ρ* = 1/41[20,12,9]'));
  assert.deepEqual(q5.answer, {
    s1: '13/40',
    s2: '3/10',
    s3: '3/8',
    s4: '20/41',
    s5: '12/41',
    s6: '9/41'
  });
  assert.ok(!q5.question.includes('ρ₀=[0,1,0]'));
});

test('npm test runs the phase twelve checks', () => {
  assert.ok(packageJson.scripts.test.includes('tests/phase-twelve.test.js'));
});
