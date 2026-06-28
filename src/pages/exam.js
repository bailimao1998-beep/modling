import { getQuestionById } from '../data/questions.js';
import { examTemplates, getExamTemplate } from '../data/examTemplates.js';
import { gradeQuestion } from '../services/grading.js';
import { mutateState, recordQuestionAttempt } from '../services/storage.js';
import { updateTopicMastery } from '../services/progress.js';
import { icon, refreshIcons } from '../components/icon.js';

let timerId = null;
let remainingSeconds = 0;

export function cleanupExamPage() {
  clearInterval(timerId);
  timerId = null;
}

function modeFromRoute() { return new URLSearchParams(location.hash.split('?')[1] || '').get('mode'); }
function timeText(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`; }

function answerControl(question) {
  if (question.type === 'matrix-fill') return `<div class="matrix-answer" style="--cols:${question.answer[0].length}">${question.answer.flatMap((row, r) => row.map((_, c) => `<input data-exam-matrix="${question.id}:${r}-${c}" inputmode="decimal" aria-label="第 ${r + 1} 行第 ${c + 1} 列" />`)).join('')}</div>`;
  if (question.type === 'stepped') return `<div class="step-list">${question.steps.map((step, index) => `<label class="step-item"><span class="step-index">${index + 1}</span><span class="step-prompt">${step.prompt}</span><input data-exam-step="${question.id}:${step.stepId}" inputmode="decimal" /></label>`).join('')}</div>`;
  if (question.type === 'single-choice') return `<div class="choice-list">${question.options.map((option) => `<label class="choice-option"><input type="radio" name="exam-${question.id}" value="${option}" /><span>${option}</span></label>`).join('')}</div>`;
  return `<input data-exam-input="${question.id}" class="answer-input" inputmode="decimal" />`;
}

function readAnswer(question) {
  if (question.type === 'matrix-fill') return question.answer.map((row, r) => row.map((_, c) => document.querySelector(`[data-exam-matrix="${question.id}:${r}-${c}"]`)?.value));
  if (question.type === 'stepped') return Object.fromEntries(question.steps.map((step) => [step.stepId, document.querySelector(`[data-exam-step="${question.id}:${step.stepId}"]`)?.value]));
  if (question.type === 'single-choice') return document.querySelector(`input[name="exam-${question.id}"]:checked`)?.value;
  return document.querySelector(`[data-exam-input="${question.id}"]`)?.value;
}

function modeChooser() {
  return `<section class="page exam-page"><div class="page-heading"><div><span class="eyebrow">Exam Modes</span><h1>选择一次模拟考试</h1><p>计时开始后仍可标记题目并在提交前返回检查。</p></div></div><div class="exam-mode-grid">${examTemplates.map((template) => `<article class="exam-mode-card ${template.status === 'preview' ? 'is-disabled' : ''}"><span class="mode-icon">${icon(template.id === 'quick' ? 'zap' : template.id === 'module' ? 'layers-3' : 'graduation-cap')}</span><span class="status-label">${template.status === 'open' ? `${template.durationMinutes} 分钟` : '占位预告'}</span><h2>${template.title}</h2><p>${template.description}</p><strong>${template.status === 'open' ? `${template.questionIds.length} 道题` : '完整 50 分卷'}</strong>${template.status === 'open' ? `<a class="primary-button" href="#/exam?mode=${template.id}">${icon('play')} 开始考试</a>` : '<button class="secondary-button" disabled>后续开放</button>'}</article>`).join('')}</div></section>`;
}

export function renderExam() {
  const mode = modeFromRoute();
  if (!mode || getExamTemplate(mode).status === 'preview') return modeChooser();
  const template = getExamTemplate(mode);
  const questions = template.questionIds.map(getQuestionById);
  remainingSeconds = template.durationMinutes * 60;
  return `<section class="page exam-page"><div class="exam-toolbar"><div><a class="back-link" href="#/exam">${icon('arrow-left')} 退出本次考试</a><span class="eyebrow">${template.title}</span><h1>模拟考试</h1></div><div class="timer" data-timer><small>剩余时间</small><strong>${timeText(remainingSeconds)}</strong></div></div>
    <div class="exam-layout"><aside class="exam-nav"><h2>题目导航</h2><div class="exam-legend"><span><i class="answered-dot"></i>已答</span><span><i class="marked-dot"></i>标记</span></div>${questions.map((question, index) => `<button type="button" data-exam-nav="${question.id}" data-exam-scroll="${question.id}" aria-label="跳转到第 ${index + 1} 题"><span>第 ${index + 1} 题</span><small data-nav-status>未答</small></button>`).join('')}<button class="primary-button" data-submit-exam type="button">${icon('send')} 提交试卷</button></aside>
    <div class="exam-paper">${questions.map((question, index) => `<article class="question-card exam-question" id="exam-${question.id}" data-exam-question="${question.id}"><div class="exam-question-head"><div class="question-meta"><span>第 ${index + 1} 题</span><span>${question.marks} 分</span><span>${question.difficulty}</span></div><button class="icon-text-button" data-mark-question type="button">${icon('flag')} <span>标记</span></button></div><h3>${question.title}</h3><p>${question.question}</p>${answerControl(question)}</article>`).join('')}<div class="submit-panel"><h2>准备提交？</h2><p>提交后会显示总分、步骤得分、错误类型和推荐复习内容。</p><button class="primary-button" data-submit-exam type="button">${icon('send')} 提交试卷</button></div><div data-exam-result></div></div></div></section>`;
}

export function bindExamPage() {
  cleanupExamPage();
  const mode = modeFromRoute();
  if (!mode || getExamTemplate(mode).status === 'preview') return;
  const template = getExamTemplate(mode);
  const questions = template.questionIds.map(getQuestionById);
  const timer = document.querySelector('[data-timer] strong');
  let submitted = false;
  timerId = setInterval(() => { remainingSeconds -= 1; if (timer) timer.textContent = timeText(Math.max(0, remainingSeconds)); if (remainingSeconds <= 0) { clearInterval(timerId); submitExam(true); } }, 1000);

  document.querySelectorAll('[data-exam-scroll]').forEach((button) => button.addEventListener('click', () => {
    document.getElementById(`exam-${button.dataset.examScroll}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  document.querySelectorAll('.exam-paper input').forEach((input) => input.addEventListener('input', () => {
    const card = input.closest('[data-exam-question]');
    const status = document.querySelector(`[data-exam-nav="${card.dataset.examQuestion}"] [data-nav-status]`);
    const filled = [...card.querySelectorAll('input')].some((field) => field.type === 'radio' ? field.checked : field.value.trim());
    card.classList.toggle('is-answered', filled);
    if (status) status.textContent = filled ? '已答' : '未答';
  }));

  document.querySelectorAll('[data-mark-question]').forEach((button) => button.addEventListener('click', () => {
    const card = button.closest('[data-exam-question]');
    const marked = card.classList.toggle('is-marked');
    button.classList.toggle('is-active', marked);
    button.querySelector('span').textContent = marked ? '已标记' : '标记';
    document.querySelector(`[data-exam-nav="${card.dataset.examQuestion}"]`)?.classList.toggle('is-marked', marked);
  }));

  function submitExam(auto = false) {
    if (submitted || (!auto && !confirm('确认提交试卷吗？提交后将显示总分和步骤得分。'))) return;
    submitted = true;
    clearInterval(timerId);
    const results = questions.map((question) => { const answer = readAnswer(question); return { question, answer, result: gradeQuestion(question, answer) }; });
    results.forEach(({ question, answer, result }) => recordQuestionAttempt(question, result, answer));
    const score = results.reduce((sum, item) => sum + item.result.score, 0);
    const maxScore = results.reduce((sum, item) => sum + item.result.maxScore, 0);
    mutateState((state) => { state.examHistory.unshift({ at: new Date().toISOString(), mode, score, maxScore, durationSeconds: template.durationMinutes * 60 - remainingSeconds }); results.forEach(({ question, result }) => updateTopicMastery(state, question.topic, { event: result.correct ? 'exam-correct' : 'wrong' })); });
    const wrongTopics = [...new Set(results.filter((item) => !item.result.correct).map((item) => item.question.topic))];
    const target = document.querySelector('[data-exam-result]');
    target.innerHTML = `<section class="exam-results"><div class="score-ring"><strong>${score}</strong><span>/ ${maxScore}</span></div><div><span class="eyebrow">Exam Complete</span><h2>本次考试结果</h2><p>${wrongTopics.length ? `建议优先复习：${wrongTopics.join('、')}` : '所有题目完整得分，可以在 48 小时后再做一次巩固。'}</p></div>${results.map(({ question, result }, index) => `<article class="exam-result-row"><div><strong>第 ${index + 1} 题 · ${question.title}</strong><span>${result.score}/${result.maxScore} 分</span></div><p>${result.feedback}</p>${result.errorType ? `<span class="danger-tag">${result.errorType}</span>` : '<span class="success-tag">步骤完整</span>'}${result.stepResults ? `<div class="step-feedback">${result.stepResults.map((step) => `<p class="${step.correct ? 'correct' : 'wrong'}">${step.prompt || step.location}：${step.score ?? 0}/${step.maxScore ?? 1}</p>`).join('')}</div>` : ''}</article>`).join('')}<div class="card-actions"><a class="primary-button" href="#/mistakes">${icon('notebook-tabs')} 查看错题</a><a class="secondary-button" href="#/exam">选择另一模式</a></div></section>`;
    refreshIcons(target);
    target.scrollIntoView({ block: 'start' });
  }
  document.querySelectorAll('[data-submit-exam]').forEach((button) => button.addEventListener('click', () => submitExam(false)));
}
