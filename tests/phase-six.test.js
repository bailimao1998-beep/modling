import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { modules } from '../src/data/modules.js';
import { lessons } from '../src/data/lessons.js';
import { questions, getQuestionById } from '../src/data/questions.js';
import { getExamTemplate } from '../src/data/examTemplates.js';
import { getTopicsByModule } from '../src/data/topics.js';

const recurrenceMathUrl = new URL('../src/modules/recurrence/recurrenceMath.js', import.meta.url);
const recurrenceMath = existsSync(fileURLToPath(recurrenceMathUrl)) ? await import(recurrenceMathUrl) : {};
const recurrenceLabUrl = new URL('../src/modules/recurrence/recurrenceLab.js', import.meta.url);
const recurrenceLabSource = existsSync(fileURLToPath(recurrenceLabUrl)) ? readFileSync(recurrenceLabUrl, 'utf8') : '';
const recurrenceLessonUrl = new URL('../src/modules/recurrence/recurrenceLesson.js', import.meta.url);
const recurrenceLessonSource = existsSync(fileURLToPath(recurrenceLessonUrl)) ? readFileSync(recurrenceLessonUrl, 'utf8') : '';
const recurrencePracticeUrl = new URL('../src/modules/recurrence/recurrencePractice.js', import.meta.url);
const recurrencePractice = existsSync(fileURLToPath(recurrencePracticeUrl)) ? await import(recurrencePracticeUrl) : {};
const labsPageSource = readFileSync(new URL('../src/pages/labs.js', import.meta.url), 'utf8');
const lessonPageSource = readFileSync(new URL('../src/pages/lesson.js', import.meta.url), 'utf8');

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

test('opens recurrence as the fifth complete study module', () => {
  const recurrence = modules.find((module) => module.id === 'recurrence');
  assert.equal(recurrence.status, 'open');
  assert.equal(recurrence.route, '#/lesson?module=recurrence');
  assert.ok(recurrence.topics.length >= 5);
  assert.ok(getTopicsByModule('recurrence').every((topic) => topic.status === 'open'));
});

test('defines a complete recurrence lesson linked to real practice questions', () => {
  const lesson = lessons.recurrence;
  const requiredFields = ['id', 'moduleId', 'title', 'subtitle', 'topic', 'goals', 'plainExplanation', 'symbols', 'formulas', 'example', 'guidedPracticeIds', 'independentPracticeIds', 'summary', 'nextLessonId', 'checklist'];
  requiredFields.forEach((field) => assert.ok(field in lesson, `missing recurrence lesson field: ${field}`));
  assert.equal(lesson.moduleId, 'recurrence');
  assert.ok(lesson.checklist.length >= 10);
  [...lesson.guidedPracticeIds, ...lesson.independentPracticeIds].forEach((id) => {
    assert.equal(getQuestionById(id)?.module, 'recurrence', `${id} should be a recurrence question`);
  });
});

test('adds ten complete recurrence questions across all supported question types', () => {
  const recurrenceQuestions = questions.filter((question) => question.module === 'recurrence' && question.id.startsWith('r-q'));
  assert.ok(recurrenceQuestions.length >= 10);
  assert.deepEqual(recurrenceQuestions.slice(0, 10).map((question) => question.id), Array.from({ length: 10 }, (_, index) => `r-q${index + 1}`));
  assert.deepEqual(new Set(recurrenceQuestions.map((question) => question.type)), new Set(['single-choice', 'numeric-fill', 'matrix-fill', 'stepped']));
  recurrenceQuestions.forEach((question) => {
    ['id', 'module', 'topic', 'difficulty', 'type', 'title', 'question', 'steps', 'hints', 'answer', 'explanation', 'marks', 'errorTags'].forEach((field) => {
      assert.ok(field in question, `${question.id} missing ${field}`);
    });
    assert.equal(question.hints.length, 3);
  });
});

test('uses recurrence and matrix form for the ten-mark beta first question', () => {
  const beta = getQuestionById('beta-matrix');
  assert.equal(beta.module, 'recurrence');
  assert.equal(beta.topic, 'recurrence:matrix');
  assert.equal(beta.marks, 10);
  assert.equal(beta.steps.reduce((sum, step) => sum + step.marks, 0), 10);
  assert.deepEqual(beta.steps.slice(0, 5).map((step) => step.expectedAnswer), [2, 2, 0, -4, -8]);
  assert.ok(beta.question.includes('x_{k+2}=2x_{k+1}-2x_k'));
  assert.ok(getExamTemplate('full-beta').questionIds.includes('beta-matrix'));
});

test('exposes recurrence math helpers for both lab sections', () => {
  ['logisticStep', 'simulateLogistic', 'secondOrderSequence', 'recurrenceMatrix', 'nextRecurrenceState'].forEach((name) => {
    assert.equal(typeof recurrenceMath[name], 'function', `missing recurrence helper: ${name}`);
  });
});

test('simulates the default logistic map including the initial state', () => {
  const values = recurrenceMath.simulateLogistic({ r: 2.8, x0: 0.2, steps: 2 });
  assert.equal(values.length, 3);
  assert.deepEqual(values.map((item) => item.k), [0, 1, 2]);
  assert.ok(Math.abs(values[1].value - 0.448) < 1e-12);
  assert.ok(Math.abs(values[2].value - 0.6924288) < 1e-12);
});

test('matrix form reproduces the second-order recurrence through x6', () => {
  assert.deepEqual(recurrenceMath.recurrenceMatrix(2, -2), [[2, -2], [1, 0]]);
  assert.deepEqual(recurrenceMath.nextRecurrenceState([1, 0], [[2, -2], [1, 0]]), [2, 1]);
  assert.deepEqual(recurrenceMath.secondOrderSequence({ a: 2, b: -2, x0: 0, x1: 1, through: 6 }), [0, 1, 2, 2, 0, -4, -8]);
});

test('rejects invalid logistic and recurrence inputs', () => {
  assert.throws(() => recurrenceMath.simulateLogistic({ r: '', x0: 0.2, steps: 20 }), /r/);
  assert.throws(() => recurrenceMath.simulateLogistic({ r: 4.5, x0: 0.2, steps: 20 }), /r/);
  assert.throws(() => recurrenceMath.simulateLogistic({ r: 2.8, x0: 1.2, steps: 20 }), /x0/);
  assert.throws(() => recurrenceMath.secondOrderSequence({ a: 2, b: -2, x0: 0, x1: 1, through: 0 }), /through/);
});

test('provides the recurrence lab lifecycle and both interactive sections', () => {
  ['renderRecurrenceLab', 'bindRecurrenceLab', 'destroyRecurrenceLab'].forEach((name) => {
    assert.match(recurrenceLabSource, new RegExp(`export function ${name}\\(`), `missing recurrence lab export: ${name}`);
    assert.ok(recurrenceLessonSource.includes(name), `missing recurrence lesson export: ${name}`);
  });
  ['data-recurrence-lab', 'data-logistic-r', 'data-logistic-x0', 'data-logistic-steps', 'data-simulate-logistic', 'data-logistic-chart', 'data-recurrence-next', 'data-recurrence-reset', 'data-recurrence-sequence', 'data-recurrence-process'].forEach((attribute) => {
    assert.ok(recurrenceLabSource.includes(attribute), `recurrence lab missing ${attribute}`);
  });
});

test('lists all recurrence practice ids in order', () => {
  assert.deepEqual(recurrencePractice.recurrencePracticeIds, Array.from({ length: 10 }, (_, index) => `r-q${index + 1}`));
});

test('integrates recurrence lab into Labs render bind and cleanup', () => {
  ['renderRecurrenceLab', 'bindRecurrenceLab', 'destroyRecurrenceLab', 'data-lab-scroll="recurrence-lab"', 'id="recurrence-lab"'].forEach((text) => {
    assert.ok(labsPageSource.includes(text), `Labs page missing ${text}`);
  });
});

test('uses recurrence lab as the recurrence lesson visual', () => {
  ['renderRecurrenceLab', 'bindRecurrenceLab', 'destroyRecurrenceLab', 'recurrence: renderRecurrenceLab', "moduleId === 'recurrence'"].forEach((text) => {
    assert.ok(lessonPageSource.includes(text), `Lesson page missing ${text}`);
  });
});
