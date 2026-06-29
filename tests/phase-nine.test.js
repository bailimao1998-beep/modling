import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
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
const lockfile = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));
const pagesUrl = new URL('../.github/workflows/pages.yml', import.meta.url);
const pagesSource = existsSync(fileURLToPath(pagesUrl)) ? readFileSync(pagesUrl, 'utf8') : '';
const sidebarSource = readFileSync(new URL('../src/components/sidebar.js', import.meta.url), 'utf8');

test('sets the beta release version consistently to 0.8.0', () => {
  assert.equal(packageJson.version, '0.8.0');
  assert.equal(lockfile.version, '0.8.0');
  assert.equal(lockfile.packages[''].version, '0.8.0');
});

test('defines a Node 22 GitHub Pages deployment workflow', () => {
  assert.ok(pagesSource.includes('branches: [main]'));
  assert.ok(pagesSource.includes('node-version: 22'));
  assert.ok(pagesSource.includes('npm ci'));
  assert.ok(pagesSource.includes('npm test'));
  assert.ok(pagesSource.includes('npm run build'));
  assert.ok(pagesSource.includes('actions/upload-pages-artifact@v3'));
  assert.ok(pagesSource.includes('actions/deploy-pages@v4'));
});

test('opens a separate 2024-2025 past paper with five questions totaling fifty marks', () => {
  const template = getExamTemplate('past-paper-2024');
  const expectedIds = [
    'past-q1-recurrence',
    'past-q2-graph',
    'past-q3-laplacian-proof',
    'past-q4-probability',
    'past-q5-markov'
  ];
  assert.equal(template.id, 'past-paper-2024');
  assert.equal(template.status, 'open');
  assert.equal(template.durationMinutes, 120);
  assert.deepEqual(template.questionIds, expectedIds);
  const paperQuestions = expectedIds.map(getQuestionById);
  assert.ok(paperQuestions.every(Boolean));
  assert.equal(paperQuestions.reduce((sum, question) => sum + question.marks, 0), 50);
});

test('uses roadmap instead of reports in the five-item mobile navigation', () => {
  assert.ok(sidebarSource.includes("['/dashboard', '/roadmap', '/courses', '/practice', '/mistakes']"));
  assert.ok(!sidebarSource.includes("['/dashboard', '/courses', '/practice', '/mistakes', '/reports']"));
});
