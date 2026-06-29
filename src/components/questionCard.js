import { gradeQuestion, gradeStep } from '../services/grading.js';
import { recordQuestionAttempt, mutateState } from '../services/storage.js';
import { applyQuestionProgress } from '../services/progress.js';
import { modules } from '../data/modules.js';
import { getTopicTitle } from '../data/topics.js';
import { hintPanel, bindHintPanel } from './hintPanel.js';
import { stepAnswer, readStepAnswers } from './stepAnswer.js';
import { icon, refreshIcons } from './icon.js';
import { renderRichMathText } from '../utils/richMathText.js';
import { bindConfusionHelp, confusionHelp } from './confusionHelp.js';

const difficultyLabels = { easy: '基础', medium: '进阶', exam: '考试' };

function matrixInputs(question) {
  const rows = question.answer.length;
  const cols = question.answer[0].length;
  return `<div class="matrix-answer table-scroll" style="--cols:${cols}">${Array.from({ length: rows * cols }, (_, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    return `<input data-matrix-cell="${row}-${col}" aria-label="第 ${row + 1} 行第 ${col + 1} 列" inputmode="decimal" />`;
  }).join('')}</div>`;
}

function readMatrix(root, question) {
  return Array.from({ length: question.answer.length }, (_, row) =>
    Array.from({ length: question.answer[0].length }, (_, col) => root.querySelector(`[data-matrix-cell="${row}-${col}"]`)?.value)
  );
}

function answerControl(question) {
  if (question.type === 'single-choice') return `<div class="choice-list">${question.options.map((option) => `<label class="choice-option"><input name="${question.id}" value="${option}" type="radio" /><span>${renderRichMathText(option)}</span></label>`).join('')}</div>`;
  if (question.type === 'numeric-fill') return '<input class="answer-input" data-answer-input type="text" inputmode="decimal" autocomplete="off" placeholder="输入数值" />';
  if (question.type === 'matrix-fill') return matrixInputs(question);
  if (question.type === 'stepped') return stepAnswer(question);
  return '';
}

function readAnswer(root, question) {
  if (question.type === 'single-choice') return root.querySelector(`input[name="${question.id}"]:checked`)?.value;
  if (question.type === 'numeric-fill') return root.querySelector('[data-answer-input]')?.value;
  if (question.type === 'matrix-fill') return readMatrix(root, question);
  if (question.type === 'stepped') return readStepAnswers(root, question);
  return null;
}

function resultHtml(result, question) {
  const stepDetails = result.stepResults?.length ? `<div class="step-feedback">${result.stepResults.map((step) =>
    step.location
      ? `<p class="wrong"><strong>${renderRichMathText(step.location)}</strong>：当前填写 ${renderRichMathText(step.actual || '空')}，请重新做这一格的行乘列。</p>`
      : `<p class="${step.correct ? 'correct' : 'wrong'}"><strong>${renderRichMathText(step.prompt)}</strong>：${renderRichMathText(step.feedback)}</p>`
  ).join('')}</div>` : '';
  return `<div class="result-box ${result.correct ? 'is-correct' : 'is-wrong'}" aria-live="polite">
    <div class="result-heading">${icon(result.correct ? 'check-circle-2' : 'circle-alert')}<strong>${result.correct ? '完成' : '继续修正'} · ${result.score}/${result.maxScore} 分</strong></div>
    <p>${renderRichMathText(result.feedback)}</p>${stepDetails}
    ${confusionHelp(question.topic, question.module, '我看不懂这一步')}
    <details><summary>完成后查看思路总结</summary><p>${renderRichMathText(question.explanation)}</p></details>
  </div>`;
}

export function questionCard(question, options = {}) {
  const moduleTitle = modules.find((module) => module.id === question.module)?.title || question.module;
  const recommendedMinutes = question.recommendedMinutes || Math.max(2, question.marks * 2);
  return `<article class="question-card" data-question-id="${question.id}">
    <div class="question-meta"><span>${moduleTitle}</span><span>${getTopicTitle(question.topic)}</span><span>${difficultyLabels[question.difficulty]}</span><span>${question.marks} 分</span><span>${icon('clock-3')} ${recommendedMinutes} 分钟</span>${options.wasWrong ? '<span class="danger-tag">曾经做错</span>' : ''}</div>
    <h3>${question.title}</h3><p class="question-text">${renderRichMathText(question.question)}</p>
    ${answerControl(question)}
    ${question.type === 'stepped' ? `<div class="live-score">当前步骤得分 <strong data-live-score>0/${question.marks}</strong></div>` : ''}
    ${hintPanel(question)}
    <div class="card-actions"><button class="primary-button" data-submit-question type="button">${icon('check')} 提交答案</button>${options.compact ? '' : `<button class="ghost-button" data-clear-answer type="button">${icon('eraser')} 清空</button>`}</div>
    <div data-result></div>
  </article>`;
}

export function bindQuestionCard(root, question, options = {}) {
  bindHintPanel(root, question.hints || []);

  if (question.type === 'stepped') {
    root.querySelectorAll('[data-step-input]').forEach((input) => input.addEventListener('input', () => {
      const step = question.steps.find((item) => item.stepId === input.dataset.stepInput);
      const result = gradeStep(step, input.value);
      const feedback = root.querySelector(`[data-step-feedback="${step.stepId}"]`);
      const item = root.querySelector(`[data-step-item="${step.stepId}"]`);
      if (feedback) {
        feedback.innerHTML = renderRichMathText(result.feedback);
        feedback.className = `step-live-feedback ${result.correct ? 'correct-text' : 'wrong-text'}`;
        feedback.dataset.score = result.score;
      }
      item?.classList.toggle('is-correct', result.correct);
      item?.classList.toggle('is-wrong', !result.correct);
      const earned = [...root.querySelectorAll('[data-step-feedback]')].reduce((sum, node) => sum + Number(node.dataset.score || 0), 0);
      const score = root.querySelector('[data-live-score]');
      if (score) score.textContent = `${earned}/${question.marks}`;
    }));
  }

  root.querySelector('[data-submit-question]')?.addEventListener('click', () => {
    const userAnswer = readAnswer(root, question);
    const result = gradeQuestion(question, userAnswer);
    root.querySelector('[data-result]').innerHTML = resultHtml(result, question);
    refreshIcons(root.querySelector('[data-result]'));
    bindConfusionHelp(root.querySelector('[data-result]'));
    if (!options.skipStorage) {
      recordQuestionAttempt(question, result, userAnswer);
      mutateState((state) => {
        applyQuestionProgress(state, question, result);
      });
    }
    options.onGrade?.(result, userAnswer);
  });

  root.querySelector('[data-clear-answer]')?.addEventListener('click', () => {
    root.querySelectorAll('input').forEach((input) => { if (input.type === 'radio') input.checked = false; else input.value = ''; });
    root.querySelectorAll('[data-step-feedback]').forEach((node) => { node.textContent = ''; delete node.dataset.score; });
    const score = root.querySelector('[data-live-score]');
    if (score) score.textContent = `0/${question.marks}`;
    root.querySelector('[data-result]').innerHTML = '';
  });
}
