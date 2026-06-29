import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { coverageMap } from '../src/data/coverageMap.js';
import { questions, getQuestionById } from '../src/data/questions.js';

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
const targetCoverageIds = [
  'l1-eigenvalues',
  'l1-ode',
  'l2-incidence-matrix',
  'l3-covariance-independence',
  'l3-lln-clt-sampling',
  'l4-regular-ergodic',
  'l4-perron-frobenius'
];

function item(id) {
  return coverageMap.find((entry) => entry.id === id);
}

function questionExists(id) {
  return Boolean(getQuestionById(id));
}

test('missing and partial coverage gaps are reduced after phase fifteen', () => {
  const gaps = coverageMap.filter((entry) => entry.status !== 'covered');
  assert.ok(gaps.length <= 2, `expected at most 2 gaps, found ${gaps.length}: ${gaps.map((entry) => entry.id).join(', ')}`);
});

test('targeted missing and partial topics now have beginner learning chains', () => {
  targetCoverageIds.forEach((id) => {
    const coverage = item(id);
    assert.ok(coverage, `${id} missing from coverageMap`);
    assert.equal(coverage.status, 'covered', `${id} should be covered`);
    assert.ok(coverage.beginnerNote?.length > 10, `${id} needs beginnerNote`);
    assert.ok(coverage.examNote?.length > 10, `${id} needs examNote`);
    assert.ok(coverage.lessonRoute || coverage.lessonId, `${id} needs lesson entry`);
    assert.ok(coverage.guidedQuestionIds?.some(questionExists), `${id} needs guided question`);
    assert.ok(coverage.independentQuestionIds?.some(questionExists), `${id} needs independent question`);
  });
});

test('every high importance knowledge point has a lesson or question entry', () => {
  coverageMap.filter((entry) => entry.importance === 'high').forEach((entry) => {
    const hasQuestion = [
      ...(entry.guidedQuestionIds || []),
      ...(entry.independentQuestionIds || []),
      ...(entry.examQuestionIds || [])
    ].some(questionExists);
    assert.ok(entry.lessonRoute || entry.lessonId || hasQuestion || entry.proofIds?.length, `${entry.id} has no learning entry`);
  });
});

test('incidence matrix has at least one practice question', () => {
  const incidenceQuestions = questions.filter((question) => question.topic === 'graph:incidence');
  assert.ok(incidenceQuestions.length >= 1);
  assert.ok(incidenceQuestions.some((question) => question.hints?.length >= 3));
});

test('conditional probability or independence has at least one practice question', () => {
  const dependenceQuestions = questions.filter((question) => ['probability:basics', 'probability:dependence'].includes(question.topic));
  assert.ok(dependenceQuestions.some((question) => /conditional|independent|独立|条件/.test(`${question.title} ${question.question}`)));
});

test('LLN CLT and sampling have notes and beginner level practice', () => {
  const coverage = item('l3-lln-clt-sampling');
  assert.ok(coverage.beginnerNote.includes('样本') || coverage.beginnerNote.includes('sample'));
  assert.ok(coverage.examNote.includes('CLT') || coverage.examNote.includes('LLN'));
  assert.ok(coverage.guidedQuestionIds.some(questionExists));
  assert.ok(coverage.independentQuestionIds.some(questionExists));
});

test('regular ergodic and Perron Frobenius have explanation and practice entry', () => {
  ['l4-regular-ergodic', 'l4-perron-frobenius'].forEach((id) => {
    const coverage = item(id);
    assert.ok(/stationary|平稳|长期|eigenvalue|特征值/i.test(`${coverage.beginnerNote} ${coverage.examNote}`));
    assert.ok(coverage.guidedQuestionIds.some(questionExists));
    assert.ok(coverage.independentQuestionIds.some(questionExists));
  });
});

test('npm test runs the phase fifteen checks', () => {
  assert.ok(packageJson.scripts.test.includes('tests/phase-fifteen.test.js'));
});
