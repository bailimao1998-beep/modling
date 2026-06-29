import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

const richMathUrl = new URL('../src/utils/richMathText.js', import.meta.url);
const richMathModule = existsSync(fileURLToPath(richMathUrl)) ? await import(richMathUrl) : {};
const renderRichMathText = richMathModule.renderRichMathText;
const questionCardSource = readFileSync(new URL('../src/components/questionCard.js', import.meta.url), 'utf8');
const examSource = readFileSync(new URL('../src/pages/exam.js', import.meta.url), 'utf8');
const lessonSource = readFileSync(new URL('../src/pages/lesson.js', import.meta.url), 'utf8');
const componentStyles = readFileSync(new URL('../src/styles/components.css', import.meta.url), 'utf8');
const recurrenceLabSource = readFileSync(new URL('../src/modules/recurrence/recurrenceLab.js', import.meta.url), 'utf8');
const markovLabSource = readFileSync(new URL('../src/modules/markov/markovSimulator.js', import.meta.url), 'utf8');

test('renders a positive two by two shorthand as a KaTeX bmatrix', () => {
  assert.equal(typeof renderRichMathText, 'function');
  const html = renderRichMathText('A=[[1,2],[3,4]]');
  assert.ok(html.includes('bmatrix'));
  assert.ok(html.includes('1&amp;2'));
});

test('renders a matrix containing negative entries', () => {
  const html = renderRichMathText('A=[[2,-2],[1,0]]');
  assert.ok(html.includes('bmatrix'));
  assert.ok(html.includes('-2'));
});

test('renders a labelled probability row vector', () => {
  const html = renderRichMathText('ρ0=[1,0,0]');
  assert.ok(html.includes('bmatrix'));
  assert.ok(html.includes('rho'));
});

test('renders standalone lesson symbols as inline math', () => {
  assert.ok(renderRichMathText('A_{ij}').includes('katex'));
  assert.ok(renderRichMathText('m × n').includes('times'));
  assert.ok(renderRichMathText('ρ_n').includes('rho'));
});

test('escapes ordinary HTML while preserving Chinese text', () => {
  const html = renderRichMathText('比较 <img src=x onerror=alert(1)> 与 A^2');
  assert.ok(html.includes('比较'));
  assert.ok(html.includes('&lt;img'));
  assert.ok(!html.includes('<img'));
});

test('question cards render question text through rich math', () => {
  assert.ok(questionCardSource.includes('renderRichMathText(question.question)'));
  assert.ok(!questionCardSource.includes('${question.question}</p>'));
});

test('exam questions render question and step text through rich math', () => {
  assert.ok(examSource.includes('renderRichMathText(question.question)'));
  assert.ok(examSource.includes('renderRichMathText(step.prompt)'));
});

test('lesson examples symbols and summaries use rich math', () => {
  assert.ok(lessonSource.includes('renderRichMathText(lesson.example.problem)'));
  assert.ok(lessonSource.includes('renderRichMathText(item.symbol)'));
  assert.ok(lessonSource.includes('renderRichMathText(item)'));
});

test('matrix answers keep a stable grid layout', () => {
  assert.match(componentStyles, /\.matrix-answer[^{}]*\{[^}]*grid-template-columns/s);
});

test('dynamic lab vectors use the shared rich math renderer', () => {
  assert.ok(recurrenceLabSource.includes('renderRichMathText'));
  assert.ok(markovLabSource.includes('renderRichMathText'));
});
