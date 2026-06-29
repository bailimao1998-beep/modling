import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

async function optionalImport(relativePath) {
  const url = new URL(relativePath, import.meta.url);
  return existsSync(fileURLToPath(url)) ? import(url) : {};
}

const dataManagement = await optionalImport('../src/services/dataManagement.js');
const examReport = await optionalImport('../src/services/examReport.js');
const proofTraining = await optionalImport('../src/services/proofTraining.js');
const proofsData = await optionalImport('../src/data/proofs.js');
const routerSource = readFileSync(new URL('../src/router/router.js', import.meta.url), 'utf8');
const sidebarSource = readFileSync(new URL('../src/components/sidebar.js', import.meta.url), 'utf8');
const examSource = readFileSync(new URL('../src/pages/exam.js', import.meta.url), 'utf8');
const proofsPageSource = readFileSync(new URL('../src/pages/proofs.js', import.meta.url), 'utf8');

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

const sampleState = {
  version: 2,
  progress: { topics: {}, completedQuestions: ['m-q1'], completedCount: 1 },
  attempts: { 'm-q1': [{ correct: true, at: '2026-06-29T09:00:00.000Z' }] },
  mistakes: [],
  reviewSchedule: {},
  examHistory: [],
  understoodMistakes: [],
  lastSession: { action: '学习记录已更新', at: '2026-06-29T09:00:00.000Z' }
};

test('creates a versioned local study backup without sharing state references', () => {
  assert.equal(typeof dataManagement.createStudyBackup, 'function');
  const backup = dataManagement.createStudyBackup(sampleState, '2026-06-29T10:00:00.000Z');
  assert.equal(backup.app, 'f11mt-study');
  assert.equal(backup.schemaVersion, 1);
  assert.equal(backup.exportedAt, '2026-06-29T10:00:00.000Z');
  assert.deepEqual(backup.data.progress.completedQuestions, ['m-q1']);
  backup.data.progress.completedQuestions.push('m-q2');
  assert.deepEqual(sampleState.progress.completedQuestions, ['m-q1']);
});

test('validates backup data and accepts a partial supported state', () => {
  assert.equal(typeof dataManagement.validateStudyBackup, 'function');
  const valid = dataManagement.validateStudyBackup({ data: { progress: { topics: {} }, mistakes: [] } });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.data.mistakes, []);
  const empty = dataManagement.validateStudyBackup({ data: { unrelated: true } });
  assert.equal(empty.valid, false);
  assert.match(empty.errors.join(' '), /progress|attempts|mistakes|reviewSchedule/);
  const malformed = dataManagement.validateStudyBackup({ data: { mistakes: {} } });
  assert.equal(malformed.valid, false);
});

const betaResults = [
  { question: { id: 'beta-matrix', module: 'recurrence', marks: 10 }, result: { score: 5, maxScore: 10, errorType: '公式选择错误' } },
  { question: { id: 'beta-graph', module: 'graph', marks: 10 }, result: { score: 8, maxScore: 10, errorType: '计算错误' } },
  { question: { id: 'beta-laplacian', module: 'graph', marks: 10 }, result: { score: 4, maxScore: 10, errorType: '概念不理解' } },
  { question: { id: 'beta-probability', module: 'probability', marks: 8 }, result: { score: 4, maxScore: 8, errorType: '计算错误' } },
  { question: { id: 'beta-markov', module: 'markov', marks: 12 }, result: { score: 7, maxScore: 12, errorType: '转移矩阵方向错误' } }
];

test('summarizes the fifty-mark beta exam by module', () => {
  assert.equal(typeof examReport.summarizeModuleScores, 'function');
  assert.deepEqual(examReport.summarizeModuleScores(betaResults), {
    recurrence: { score: 5, maxScore: 10 },
    graph: { score: 12, maxScore: 20 },
    probability: { score: 4, maxScore: 8 },
    markov: { score: 7, maxScore: 12 }
  });
});

test('counts beta exam errors by their readable error type', () => {
  assert.equal(typeof examReport.summarizeErrorTypes, 'function');
  assert.deepEqual(examReport.summarizeErrorTypes(betaResults), {
    '公式选择错误': 1,
    '计算错误': 2,
    '概念不理解': 1,
    '转移矩阵方向错误': 1
  });
});

test('checks proof step order and reports the first misplaced step', () => {
  assert.equal(typeof proofTraining.checkProofOrder, 'function');
  const expected = proofsData.laplacianPsdProof.steps.map((step) => step.id);
  assert.equal(Array.isArray(proofsData.laplacianPsdProof.practiceOrder), true);
  assert.notDeepEqual(proofsData.laplacianPsdProof.practiceOrder, expected);
  assert.deepEqual(proofTraining.checkProofOrder(expected, expected), { correct: true, firstWrongIndex: -1 });
  const swapped = [...expected];
  [swapped[1], swapped[2]] = [swapped[2], swapped[1]];
  assert.deepEqual(proofTraining.checkProofOrder(swapped, expected), { correct: false, firstWrongIndex: 1 });
});

test('registers settings and proofs pages in router and sidebar', () => {
  assert.ok(routerSource.includes("'/settings'"));
  assert.ok(routerSource.includes("'/proofs'"));
  assert.ok(sidebarSource.includes("href: '#/settings'"));
  assert.ok(sidebarSource.includes("href: '#/proofs'"));
});

test('renders the structured beta report only for the fifty-mark mode', () => {
  assert.ok(examSource.includes('buildBetaExamReport'));
  assert.ok(examSource.includes("mode === 'full-beta'"));
  assert.ok(examSource.includes('data-beta-sections'));
  assert.ok(examSource.includes('data-beta-modules'));
  assert.ok(examSource.includes('data-beta-errors'));
  assert.ok(examSource.includes('data-beta-recommendations'));
});

test('passes proof formulas to the shared renderer as an array', () => {
  assert.ok(proofsPageSource.includes('formulaBlock(['));
});
