import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { modules } from '../src/data/modules.js';
import { createDefaultState } from '../src/services/storage.js';
import { createStudyBackup, mergeImportedStudyData } from '../src/services/dataManagement.js';
import { buildBetaExamReport } from '../src/services/examReport.js';
import { laplacianPsdProof } from '../src/data/proofs.js';

async function optionalImport(relativePath) {
  const url = new URL(relativePath, import.meta.url);
  return existsSync(fileURLToPath(url)) ? import(url) : {};
}

const studyPlan = await optionalImport('../src/services/studyPlan.js');
const routerSource = readFileSync(new URL('../src/router/router.js', import.meta.url), 'utf8');
const sidebarSource = readFileSync(new URL('../src/components/sidebar.js', import.meta.url), 'utf8');
const componentStyles = readFileSync(new URL('../src/styles/components.css', import.meta.url), 'utf8');
const proofsPageSource = readFileSync(new URL('../src/pages/proofs.js', import.meta.url), 'utf8');
const mainSource = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

test('registers the exam roadmap route and sidebar entry', () => {
  assert.ok(routerSource.includes("'/roadmap'"));
  assert.ok(sidebarSource.includes("href: '#/roadmap'"));
});

test('prioritizes at most three due review questions in today tasks', () => {
  assert.equal(typeof studyPlan.generateTodayTasks, 'function');
  const state = createDefaultState();
  state.reviewSchedule = Object.fromEntries(Array.from({ length: 4 }, (_, index) => [`q${index + 1}`, {
    questionId: `q${index + 1}`,
    module: 'matrix',
    topic: 'matrix:vectors',
    title: `到期题 ${index + 1}`,
    nextReviewDate: '2026-06-28'
  }]));
  const tasks = studyPlan.generateTodayTasks(state, { dateISO: '2026-06-29' });
  assert.equal(tasks.filter((task) => task.kind === 'review').length, 3);
  assert.ok(tasks.slice(0, 3).every((task) => task.kind === 'review'));
});

test('recommends the open module with the lowest mastery evidence', () => {
  const state = createDefaultState();
  modules.forEach((module) => module.topics.forEach((topic) => {
    state.progress.topics[topic] = { mastery: module.id === 'graph' ? 0 : 5 };
  }));
  state.examHistory = [{ mode: 'full-beta', at: '2026-06-29T08:00:00.000Z' }];
  state.proofHistory = [{ proofId: 'normalized-laplacian-psd', at: '2026-06-29T08:00:00.000Z' }];
  const tasks = studyPlan.generateTodayTasks(state, { dateISO: '2026-06-29' });
  const masteryTask = tasks.find((task) => task.kind === 'mastery');
  assert.equal(masteryTask.moduleId, 'graph');
  assert.equal(masteryTask.route, '#/lesson?module=graph');
});

test('proof trainer data contains an exact five-line exam version', () => {
  assert.equal(Array.isArray(laplacianPsdProof.examVersion), true);
  assert.equal(laplacianPsdProof.examVersion.length, 5);
  assert.ok(laplacianPsdProof.examVersion.every((line) => typeof line === 'string' && line.length > 10));
});

test('proof trainer exposes reset template copy and practice recording controls', () => {
  ['data-proof-reset', 'data-proof-template', 'data-copy-proof', 'mutateState', 'proofHistory', "document.execCommand('copy')"].forEach((token) => {
    assert.ok(proofsPageSource.includes(token), `proof trainer missing ${token}`);
  });
});

test('study backup export and import preserve exam and understood history', () => {
  const state = createDefaultState();
  state.examHistory = [{ mode: 'full-beta', score: 32, maxScore: 50 }];
  state.understoodMistakes = ['mistake-1'];
  const backup = createStudyBackup(state, '2026-06-29T12:00:00.000Z');
  assert.deepEqual(backup.data.examHistory, state.examHistory);
  assert.deepEqual(backup.data.understoodMistakes, state.understoodMistakes);
  const restored = mergeImportedStudyData(backup, createDefaultState());
  assert.deepEqual(restored.examHistory, state.examHistory);
  assert.deepEqual(restored.understoodMistakes, state.understoodMistakes);
});

test('fifty-mark beta report always defines its five scoring sections', () => {
  const report = buildBetaExamReport([]);
  assert.deepEqual(report.sections.map((section) => section.maxScore), [10, 10, 10, 8, 12]);
});

test('question and exam grids allow wide answers to scroll without widening the page', () => {
  assert.match(componentStyles, /\.question-list, \.exam-paper\s*\{[^}]*grid-template-columns: minmax\(0, 1fr\)/);
});

test('study state changes refresh header metrics outside the dashboard', () => {
  assert.ok(mainSource.includes('syncAppHeader(currentPath())'));
});
