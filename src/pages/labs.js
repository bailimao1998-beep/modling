import { renderMatrixLessonDemo, bindMatrixLessonDemo } from '../modules/matrix/matrixLesson.js';
import { renderRecurrenceLab, bindRecurrenceLab, destroyRecurrenceLab } from '../modules/recurrence/recurrenceLesson.js';
import { renderMarkovSimulator, bindMarkovSimulator, destroyMarkovSimulator } from '../modules/markov/markovLesson.js';
import { renderGraphLab, bindGraphLab, destroyGraphLab } from '../modules/graph/graphLesson.js';
import { renderProbabilityLab, bindProbabilityLab, destroyProbabilityLab } from '../modules/probability/probabilityLesson.js';

export function renderLabs() {
  return `<section class="page labs-page">
    <div class="page-heading"><div><span class="eyebrow">Interactive Labs</span><h1>把公式变成可以操作的对象</h1><p>在这里反复试验，不计入考试时间；答题记录仍由练习页负责。</p></div></div>
    <nav class="lab-jump-nav" aria-label="实验目录"><button type="button" data-lab-scroll="matrix-lab">矩阵乘法</button><button type="button" data-lab-scroll="recurrence-lab">动态系统</button><button type="button" data-lab-scroll="graph-lab">图论</button><button type="button" data-lab-scroll="probability-lab">概率密度</button><button type="button" data-lab-scroll="markov-lab">天气模拟</button></nav>
    <section class="lab-section" id="matrix-lab"><div class="section-heading"><div><span class="eyebrow">Lab 01</span><h2>矩阵乘法实验室</h2></div><p>逐格移动当前行和列，观察点积如何落入结果矩阵。</p></div>${renderMatrixLessonDemo()}</section>
    <section class="lab-section" id="recurrence-lab"><div class="section-heading"><div><span class="eyebrow">Lab 02</span><h2>动态系统实验室</h2></div><p>模拟 logistic map，并把二阶递推逐步改写成矩阵状态更新。</p></div>${renderRecurrenceLab()}</section>
    <section class="lab-section" id="graph-lab"><div class="section-heading"><div><span class="eyebrow">Lab 03</span><h2>图论实验室</h2></div><p>编辑 K4，联动查看 A、D、L、walks 与 spanning trees。</p></div>${renderGraphLab()}</section>
    <section class="lab-section" id="probability-lab"><div class="section-heading"><div><span class="eyebrow">Lab 04</span><h2>概率密度实验室</h2></div><p>把区间概率、期望与方差放回密度曲线下理解。</p></div>${renderProbabilityLab()}</section>
    <section class="lab-section" id="markov-lab"><div class="section-heading"><div><span class="eyebrow">Lab 05</span><h2>马尔可夫天气模拟器</h2></div><p>状态图、转移矩阵与概率曲线同步更新。</p></div>${renderMarkovSimulator()}</section>
  </section>`;
}

export function bindLabsPage() {
  bindMatrixLessonDemo(document);
  bindRecurrenceLab(document);
  bindGraphLab(document);
  bindProbabilityLab(document);
  bindMarkovSimulator(document);
  document.querySelectorAll('[data-lab-scroll]').forEach((button) => button.addEventListener('click', () => {
    document.getElementById(button.dataset.labScroll)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
}

export function cleanupLabsPage() {
  destroyRecurrenceLab();
  destroyGraphLab();
  destroyProbabilityLab();
  destroyMarkovSimulator();
}
