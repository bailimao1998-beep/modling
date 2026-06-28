import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import viteConfig from '../vite.config.js';

const sourceRoot = fileURLToPath(new URL('../src', import.meta.url));

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : extname(entry.name) === '.js' ? [path] : [];
  });
}

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

const examSource = readFileSync(new URL('../src/pages/exam.js', import.meta.url), 'utf8');
const mistakesSource = readFileSync(new URL('../src/pages/mistakes.js', import.meta.url), 'utf8');
const sidebarSource = readFileSync(new URL('../src/components/sidebar.js', import.meta.url), 'utf8');

test('exam navigation does not render internal hash anchors', () => {
  assert.doesNotMatch(examSource, /href=["'`]#exam-/);
});

test('mistake review navigation does not render internal hash anchors', () => {
  assert.doesNotMatch(mistakesSource, /href=["'`]#mistake-/);
});

test('source hash links are router links only', () => {
  const unsafeLinks = sourceFiles(sourceRoot).flatMap((file) => {
    const matches = [...readFileSync(file, 'utf8').matchAll(/href=["'`](#[^"'`]*)/g)];
    return matches.filter((match) => !match[1].startsWith('#/')).map((match) => `${file}: ${match[0]}`);
  });
  assert.deepEqual(unsafeLinks, []);
});

test('application route links remain hash-router links', () => {
  assert.match(sidebarSource, /href:\s*'#\/dashboard'/);
  assert.match(sidebarSource, /href:\s*'#\/exam'/);
  assert.match(examSource, /href="#\/exam/);
});

test('Vite uses the repository base for builds and previews only', () => {
  assert.equal(viteConfig({ command: 'serve', isPreview: false }).base, '/');
  assert.equal(viteConfig({ command: 'build', isPreview: false }).base, '/modling/');
  assert.equal(viteConfig({ command: 'serve', isPreview: true }).base, '/modling/');
});
