import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { coverageMap, getCoverageSummary } from '../src/data/coverageMap.js';
import { beginnerLearningPath } from '../src/data/roadmap.js';
import { computeMasteryLevel } from '../src/services/progress.js';

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

const routerSource = readFileSync(new URL('../src/router/router.js', import.meta.url), 'utf8');
const sidebarSource = readFileSync(new URL('../src/components/sidebar.js', import.meta.url), 'utf8');
const lessonSource = readFileSync(new URL('../src/pages/lesson.js', import.meta.url), 'utf8');
const questionCardSource = readFileSync(new URL('../src/components/questionCard.js', import.meta.url), 'utf8');
const confusionHelpSource = readFileSync(new URL('../src/components/confusionHelp.js', import.meta.url), 'utf8');
const examSource = readFileSync(new URL('../src/pages/exam.js', import.meta.url), 'utf8');
const roadmapSource = readFileSync(new URL('../src/pages/roadmap.js', import.meta.url), 'utf8');
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('coverageMap exists and includes lecture and past paper sources', () => {
  assert.ok(Array.isArray(coverageMap));
  assert.ok(coverageMap.length >= 25);
  const sources = new Set(coverageMap.map((item) => item.source));
  ['Lecture 1', 'Lecture 2', 'Lecture 3', 'Lecture 4', 'Past Paper 2024-2025'].forEach((source) => {
    assert.ok(sources.has(source), `${source} missing`);
  });
});

test('coverageMap items expose learning routes evidence and coverage reasons', () => {
  const requiredKeys = ['id', 'title', 'module', 'source', 'sourceType', 'prerequisites', 'importance', 'status', 'beginnerNote', 'examNote'];
  coverageMap.forEach((item) => requiredKeys.forEach((key) => assert.ok(key in item, `${item.id} missing ${key}`)));
  coverageMap
    .filter((item) => item.importance === 'high')
    .forEach((item) => {
      const hasEntry = item.lessonId || item.lessonRoute || item.guidedQuestionIds?.length || item.independentQuestionIds?.length || item.examQuestionIds?.length || item.proofIds?.length;
      assert.ok(hasEntry, `${item.id} needs an entry point`);
    });
  const summary = getCoverageSummary(coverageMap);
  assert.ok(summary.total > 0);
  assert.ok(summary.covered > 0);
  assert.ok(summary.partial > 0);
  assert.ok(summary.missing >= 0);
});

test('Coverage page is registered in router and navigation', () => {
  assert.ok(routerSource.includes("'/coverage'"));
  assert.ok(routerSource.includes('renderCoverage'));
  assert.ok(sidebarSource.includes('#/coverage'));
  assert.ok(sidebarSource.includes('知识覆盖'));
});

test('Roadmap includes a beginner learning path in order', () => {
  assert.equal(beginnerLearningPath.length, 6);
  assert.deepEqual(beginnerLearningPath.map((step) => step.module), ['matrix', 'recurrence', 'graph', 'probability', 'markov', 'exam']);
  assert.ok(roadmapSource.includes('小白学习路线'));
});

test('lesson page contains beginner and exam mode copy', () => {
  assert.ok(lessonSource.includes('beginner mode'));
  assert.ok(lessonSource.includes('exam mode'));
  assert.ok(lessonSource.includes('我为什么要学这个'));
  assert.ok(lessonSource.includes('考试怎么问'));
});

test('confusion help entry exists in lesson practice and exam feedback', () => {
  assert.ok(lessonSource.includes('我看不懂这一步'));
  assert.ok(questionCardSource.includes('我看不懂这一步'));
  assert.ok(examSource.includes('我看不懂这一步'));
  assert.ok(questionCardSource.includes('confusionHelp(question.topic'));
  assert.ok(confusionHelpSource.includes('data-confusion-toggle'));
});

test('mastery evidence does not treat lessonSeen as exam mastery', () => {
  assert.equal(computeMasteryLevel({ lessonSeen: true }), 1);
  assert.equal(computeMasteryLevel({ lessonSeen: true, guidedCorrectCount: 1 }), 2);
  assert.equal(computeMasteryLevel({ independentCorrectCount: 1 }), 3);
  assert.equal(computeMasteryLevel({ lastReviewedAt: '2026-06-29' }), 4);
  assert.equal(computeMasteryLevel({ lessonSeen: true, examCorrectCount: 1 }), 5);
});

test('npm test runs the phase fourteen checks', () => {
  assert.ok(packageJson.scripts.test.includes('tests/phase-fourteen.test.js'));
});
