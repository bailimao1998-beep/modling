import { getLessonByModule } from '../data/lessons.js';
import { getQuestionById } from '../data/questions.js';
import { formulaBlock } from '../components/formula.js';
import { mutateState } from '../services/storage.js';
import { updateTopicMastery } from '../services/progress.js';
import { renderMatrixLessonDemo, bindMatrixLessonDemo } from '../modules/matrix/matrixLesson.js';
import { renderRecurrenceLab, bindRecurrenceLab, destroyRecurrenceLab } from '../modules/recurrence/recurrenceLesson.js';
import { renderMarkovSimulator, bindMarkovSimulator, destroyMarkovSimulator } from '../modules/markov/markovLesson.js';
import { renderGraphLab, bindGraphLab, destroyGraphLab } from '../modules/graph/graphLesson.js';
import { renderProbabilityLab, bindProbabilityLab, destroyProbabilityLab } from '../modules/probability/probabilityLesson.js';
import { icon } from '../components/icon.js';
import { renderRichMathText } from '../utils/richMathText.js';
import { bindConfusionHelp, confusionHelp } from '../components/confusionHelp.js';
import { coverageMap } from '../data/coverageMap.js';

function moduleFromRoute() {
  return new URLSearchParams(location.hash.split('?')[1] || '').get('module') || 'matrix';
}

function practiceLinks(ids, label) {
  return `<div class="practice-link-list">${ids.map((id, index) => {
    const question = getQuestionById(id);
    return `<a href="#/practice?module=${question.module}&question=${id}"><span>${index + 1}</span><div><strong>${question.title}</strong><small>${question.difficulty} · ${question.marks} 分</small></div>${icon('arrow-right')}</a>`;
  }).join('')}</div><a class="secondary-button" href="#/practice?module=${moduleFromRoute()}">${label}</a>`;
}

function lessonModePanel(lesson, moduleId) {
  const related = coverageMap.filter((item) => item.module === moduleId);
  const high = related.find((item) => item.importance === 'high') || related[0];
  const pastPaper = related.find((item) => item.source === 'Past Paper 2024-2025');
  return `<article class="lesson-section lesson-mode-panel">
    <div class="section-heading"><div><span class="eyebrow">Learning Mode</span><h2>beginner mode / exam mode</h2></div><div class="card-actions"><button class="icon-text-button is-active" data-lesson-mode="beginner" type="button">beginner mode</button><button class="icon-text-button" data-lesson-mode="exam" type="button">exam mode</button></div></div>
    <div data-lesson-mode-panel="beginner">
      <h3>我为什么要学这个？</h3><p>${high?.beginnerNote || lesson.plainExplanation}</p>
      <h3>前置知识</h3><p>${high?.prerequisites?.length ? high.prerequisites.join('、') : '先读懂本节符号表和生活化解释。'}</p>
      <h3>一句话解释</h3><p>${lesson.plainExplanation}</p>
      <h3>常见误区</h3><p>把“看过课程”当成“已经掌握”。本系统只把看课记为已接触，必须通过引导题、独立题和考试题建立证据。</p>
      <h3>学完以后能做哪类题</h3><p>${lesson.guidedPracticeIds.concat(lesson.independentPracticeIds).slice(0, 3).join('、')} 这类题会优先检验本节。</p>
    </div>
    <div data-lesson-mode-panel="exam" hidden>
      <h3>考试怎么问</h3><p>${pastPaper?.examNote || high?.examNote || '通常会把本节知识放进分步骤计算题。'}</p>
      <h3>常见得分点</h3><p>写出正确公式、列出中间步骤、保持符号方向和矩阵顺序一致。</p>
      <h3>常见丢分点</h3><p>跳步、把行向量和列向量方向弄反、把 walk 和 path 混淆、或忘记概率归一化。</p>
      <h3>对应真题入口</h3><p>${pastPaper?.examQuestionIds?.[0] ? `<a href="#/practice?module=${moduleId}&question=${pastPaper.examQuestionIds[0]}">${pastPaper.title}</a>` : '<a href="#/exam?mode=past-paper-2024">2024-2025 真题训练 beta</a>'}</p>
    </div>
    ${confusionHelp(lesson.topic, moduleId, '我看不懂这一步')}
  </article>`;
}

export function renderLesson() {
  const moduleId = moduleFromRoute();
  const lesson = getLessonByModule(moduleId) || getLessonByModule('matrix');
  const visual = {
    matrix: renderMatrixLessonDemo,
    recurrence: renderRecurrenceLab,
    graph: renderGraphLab,
    probability: renderProbabilityLab,
    markov: renderMarkovSimulator
  }[moduleId]?.() || renderMatrixLessonDemo();
  return `<section class="page lesson-page">
    <div class="lesson-hero"><div><a class="back-link" href="#/courses?module=${moduleId}">${icon('arrow-left')} 返回知识地图</a><span class="eyebrow">Interactive Lesson</span><h1>${lesson.title}</h1><p>${lesson.subtitle}</p></div><a class="secondary-button" href="#/practice?module=${moduleId}">${icon('list-checks')} 进入练习</a></div>
    <div class="lesson-layout">
      <aside class="lesson-outline"><h2>本节结构</h2>${['本节目标','生活化解释','符号说明','关键公式','互动演示','分步骤例题','引导练习','独立练习','本节总结','下一步建议'].map((item,index) => `<button type="button" data-lesson-scroll="lesson-section-${index + 1}"><span>${index + 1}</span>${item}</button>`).join('')}</aside>
      <div class="lesson-content">
        ${lessonModePanel(lesson, moduleId)}
        <article class="lesson-section" id="lesson-section-1"><span class="section-number">01</span><h2>本节目标</h2><ul class="goal-list">${lesson.goals.map((goal) => `<li>${icon('target')} ${goal}</li>`).join('')}</ul></article>
        <article class="lesson-section" id="lesson-section-2"><span class="section-number">02</span><h2>生活化解释</h2><p>${lesson.plainExplanation}</p></article>
        <article class="lesson-section" id="lesson-section-3"><span class="section-number">03</span><h2>符号说明</h2><div class="table-scroll"><table class="symbol-table"><thead><tr><th>符号</th><th>含义</th></tr></thead><tbody>${lesson.symbols.map((item) => `<tr><td>${renderRichMathText(item.symbol)}</td><td>${renderRichMathText(item.meaning)}</td></tr>`).join('')}</tbody></table></div></article>
        <article class="lesson-section" id="lesson-section-4"><span class="section-number">04</span><h2>关键公式</h2>${formulaBlock(lesson.formulas)}</article>
        <article class="lesson-section lesson-interactive" id="lesson-section-5"><span class="section-number">05</span><h2>互动演示</h2>${visual}</article>
        <article class="lesson-section" id="lesson-section-6"><span class="section-number">06</span><h2>${lesson.example.title}</h2><p>${renderRichMathText(lesson.example.problem)}</p><ol class="worked-steps">${lesson.example.steps.map((step) => `<li>${renderRichMathText(step)}</li>`).join('')}</ol><div class="answer-callout"><strong>结论</strong><span>${renderRichMathText(lesson.example.answer)}</span></div></article>
        <article class="lesson-section" id="lesson-section-7"><span class="section-number">07</span><h2>引导练习</h2><p>按步骤作答，先获得方法反馈，再查看完整总结。</p>${practiceLinks(lesson.guidedPracticeIds, '开始引导练习')}</article>
        <article class="lesson-section" id="lesson-section-8"><span class="section-number">08</span><h2>独立练习</h2><p>不依赖例题完成，系统会把错误步骤加入错题本。</p>${practiceLinks(lesson.independentPracticeIds, '开始独立练习')}</article>
        <article class="lesson-section" id="lesson-section-9"><span class="section-number">09</span><h2>本节总结</h2><ul class="summary-list">${lesson.summary.map((item) => `<li>${icon('check')} ${renderRichMathText(item)}</li>`).join('')}</ul></article>
        <article class="lesson-section next-step-section" id="lesson-section-10"><span class="section-number">10</span><h2>下一步建议</h2><p>先标记已接触，再用练习建立真正的掌握证据。看完课程最多提升到“已接触”。</p><div class="card-actions"><button class="primary-button" data-complete-lesson type="button">${icon('check-circle-2')} 标记已学习</button><a class="secondary-button" href="#/labs">${icon('flask-conical')} 打开互动实验</a></div><div data-lesson-feedback></div></article>
      </div>
    </div>
  </section>`;
}

export function bindLessonPage() {
  const moduleId = moduleFromRoute();
  if (moduleId === 'matrix') bindMatrixLessonDemo(document);
  if (moduleId === 'recurrence') bindRecurrenceLab(document);
  if (moduleId === 'graph') bindGraphLab(document);
  if (moduleId === 'probability') bindProbabilityLab(document);
  if (moduleId === 'markov') bindMarkovSimulator(document);
  document.querySelectorAll('[data-lesson-scroll]').forEach((button) => button.addEventListener('click', () => {
    document.getElementById(button.dataset.lessonScroll)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  document.querySelectorAll('[data-lesson-mode]').forEach((button) => button.addEventListener('click', () => {
    const mode = button.dataset.lessonMode;
    document.querySelectorAll('[data-lesson-mode]').forEach((item) => item.classList.toggle('is-active', item === button));
    document.querySelectorAll('[data-lesson-mode-panel]').forEach((panel) => { panel.hidden = panel.dataset.lessonModePanel !== mode; });
  }));
  bindConfusionHelp(document);
  document.querySelector('[data-complete-lesson]')?.addEventListener('click', () => {
    const lesson = getLessonByModule(moduleId) || getLessonByModule('matrix');
    mutateState((state) => updateTopicMastery(state, lesson.topic, { event: 'lesson-complete' }));
    document.querySelector('[data-lesson-feedback]').innerHTML = '<div class="result-box is-correct"><strong>学习记录已保存</strong><p>接下来完成引导题，把“已接触”推进到“初步理解”。</p></div>';
  });
}

export function cleanupLessonPage() {
  destroyRecurrenceLab();
  destroyGraphLab();
  destroyProbabilityLab();
  destroyMarkovSimulator();
}
