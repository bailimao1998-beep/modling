import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

const root = new URL('../', import.meta.url);
const globalCss = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const componentsCss = readFileSync(new URL('../src/styles/components.css', import.meta.url), 'utf8');
const examSource = readFileSync(new URL('../src/pages/exam.js', import.meta.url), 'utf8');
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('UI guide documents the shared visual system', () => {
  const guideUrl = new URL('../docs/UI_GUIDE.md', import.meta.url);
  assert.equal(existsSync(guideUrl), true);
  const guide = readFileSync(guideUrl, 'utf8');
  assert.ok(guide.includes('颜色系统'));
  assert.ok(guide.includes('按钮层级'));
  assert.ok(guide.includes('移动端规范'));
});

test('core CSS exposes the phase thirteen design tokens', () => {
  assert.ok(globalCss.includes('--color-bg: #F7F8FA'));
  assert.ok(globalCss.includes('--color-primary: #3B82F6'));
  assert.ok(globalCss.includes('--radius-xl: 24px'));
  assert.ok(globalCss.includes('--shadow-focus'));
});

test('core CSS keeps accessible focus and mobile rules', () => {
  assert.ok(globalCss.includes(':focus-visible'));
  assert.ok(globalCss.includes('@media (max-width: 430px)'));
  assert.ok(componentsCss.includes('@media (max-width: 768px)'));
});

test('interactive result boxes have restrained motion feedback', () => {
  assert.ok(componentsCss.includes('@keyframes result-enter'));
  assert.ok(componentsCss.includes('animation: result-enter'));
  assert.ok(componentsCss.includes('transition:'));
});

test('exam page keeps the past paper notice styling hook', () => {
  assert.ok(examSource.includes('exam-training-note'));
  assert.ok(examSource.includes('data-past-paper-notice'));
});

test('matrix answers preserve the visual bracket treatment', () => {
  assert.ok(componentsCss.includes('.matrix-answer::before'));
  assert.ok(componentsCss.includes('.matrix-answer::after'));
  assert.ok(componentsCss.includes('border-left'));
  assert.ok(componentsCss.includes('border-right'));
  assert.ok(componentsCss.includes('grid-template-columns'));
});

test('npm test runs the phase thirteen checks', () => {
  assert.ok(packageJson.scripts.test.includes('tests/phase-thirteen.test.js'));
});
