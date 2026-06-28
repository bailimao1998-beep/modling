import { renderMatrixLessonDemo, bindMatrixLessonDemo } from '../modules/matrix/matrixLesson.js';
import { renderMarkovSimulator, bindMarkovSimulator } from '../modules/markov/markovLesson.js';
import { icon } from '../components/icon.js';

export function renderLabs() {
  return `<section class="page labs-page">
    <div class="page-heading"><div><span class="eyebrow">Interactive Labs</span><h1>把公式变成可以操作的对象</h1><p>在这里反复试验，不计入考试时间；答题记录仍由练习页负责。</p></div></div>
    <nav class="lab-jump-nav" aria-label="实验目录"><a href="#matrix-lab">矩阵乘法</a><a href="#markov-lab">天气模拟</a><a href="#future-labs">即将开放</a></nav>
    <section class="lab-section" id="matrix-lab"><div class="section-heading"><div><span class="eyebrow">Lab 01</span><h2>矩阵乘法实验室</h2></div><p>逐格移动当前行和列，观察点积如何落入结果矩阵。</p></div>${renderMatrixLessonDemo()}</section>
    <section class="lab-section" id="markov-lab"><div class="section-heading"><div><span class="eyebrow">Lab 02</span><h2>马尔可夫天气模拟器</h2></div><p>状态图、转移矩阵与概率曲线同步更新。</p></div>${renderMarkovSimulator()}</section>
    <section class="lab-section" id="future-labs"><div class="section-heading"><div><span class="eyebrow">Next Labs</span><h2>后续互动实验</h2></div></div><div class="preview-grid">
      <article class="preview-card"><span class="preview-icon">${icon('network')}</span><span class="status-label">即将开放</span><h3>图论实验室</h3><p>从可拖动的顶点和边生成邻接矩阵、度矩阵与图拉普拉斯矩阵，并逐步构造 spanning tree。</p><ul><li>邻接矩阵同步</li><li>walks and paths 高亮</li><li>生成树步骤检查</li></ul></article>
      <article class="preview-card"><span class="preview-icon warm">${icon('chart-area')}</span><span class="status-label">即将开放</span><h3>概率密度实验室</h3><p>拖动区间观察曲线下面积，并比较期望、方差如何随分布变化。</p><ul><li>积分面积可视化</li><li>期望位置</li><li>方差与离散程度</li></ul></article>
    </div></section>
  </section>`;
}

export function bindLabsPage() {
  bindMatrixLessonDemo(document);
  bindMarkovSimulator(document);
}
