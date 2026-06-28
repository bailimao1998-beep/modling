import Chart from 'chart.js/auto';
import { formulaBlock } from '../../components/formula.js';
import { intervalProbability, triangularDensity, triangularMoments } from './probabilityMath.js';

let activeProbabilityLab = null;

function numberText(value) {
  return Number(value.toFixed(6)).toString();
}

function fractionText(value) {
  const known = [
    [0.125, '1/8'], [0.166667, '1/6'], [0.375, '3/8'], [0.75, '3/4'], [1.166667, '7/6']
  ];
  const match = known.find(([decimal]) => Math.abs(value - decimal) < 1e-5);
  return match ? `${match[1]} = ${numberText(value)}` : numberText(value);
}

export function renderProbabilityLab() {
  return `<section class="interactive-panel probability-lab" data-probability-lab>
    <div class="panel-heading"><div><h3>三角形概率密度实验室</h3><p>概率是曲线下面积；期望是带权平均位置；方差描述分散程度。</p></div></div>
    <div class="probability-lab-layout">
      <div class="lab-pane density-chart-pane"><div class="lab-pane-heading"><h4>概率密度 p(x)</h4><span>总面积 = 1</span></div><div class="density-formula">${formulaBlock(['p(x)=\\begin{cases}x,&0<x\\le1\\\\2-x,&1<x\\le2\\\\0,&\\text{otherwise}\\end{cases}'])}</div><div class="chart-frame density-chart-frame"><canvas data-density-chart aria-label="三角形概率密度和区间面积图"></canvas></div></div>
      <div class="lab-pane probability-controls-pane"><span class="eyebrow">Interval Probability</span><h4>计算 P(a ≤ X ≤ b)</h4><div class="compact-form-row two"><label><span>下限 a</span><input data-prob-a type="number" step="0.1" value="0" /></label><label><span>上限 b</span><input data-prob-b type="number" step="0.1" value="0.5" /></label></div><div class="card-actions"><button class="primary-button" data-calculate-probability type="button">计算区间概率</button><button class="secondary-button" data-probability-example type="button">示例 0 到 0.5</button></div><div data-probability-result class="calculation-result"><p>示例结果应为 1/8 = 0.125。</p></div><div data-integration-steps></div></div>
    </div>
    <div class="moment-grid">
      <section class="training-panel"><span class="eyebrow">First Moment</span><h4>期望 E[X]</h4><p>把每个位置 x 按密度 p(x) 加权，得到平均位置。</p><button class="secondary-button" data-moment="expectation" type="button">计算 E[X]</button></section>
      <section class="training-panel"><span class="eyebrow">Second Moment</span><h4>二阶矩 E[X²]</h4><p>先计算平方后的带权平均，为方差做准备。</p><button class="secondary-button" data-moment="secondMoment" type="button">计算 E[X²]</button></section>
      <section class="training-panel"><span class="eyebrow">Variance</span><h4>方差 Var(X)</h4><p>使用 E[X²]-E[X]²，衡量分布离中心有多分散。</p><button class="secondary-button" data-moment="variance" type="button">计算 Var(X)</button></section>
    </div>
    <div class="calculation-result moment-result" data-moment-output><p>选择上方按钮查看对应积分和结果。</p></div>
  </section>`;
}

export function destroyProbabilityLab() {
  activeProbabilityLab?.destroy();
  activeProbabilityLab = null;
}

export function bindProbabilityLab(root = document) {
  destroyProbabilityLab();
  const container = root.querySelector('[data-probability-lab]');
  if (!container) return;
  const points = Array.from({ length: 81 }, (_, index) => Number((index * 0.025).toFixed(3)));
  const chart = new Chart(container.querySelector('[data-density-chart]'), {
    type: 'line',
    data: {
      labels: points,
      datasets: [
        { label: '选定区间面积', data: points.map(() => null), borderWidth: 0, pointRadius: 0, fill: 'origin', backgroundColor: 'rgba(167,125,69,0.28)' },
        { label: 'p(x)', data: points.map(triangularDensity), borderColor: '#8a6744', backgroundColor: '#8a6744', borderWidth: 2.5, pointRadius: 0, tension: 0, fill: false }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: { legend: { position: 'bottom' } },
      scales: { x: { title: { display: true, text: 'x' }, ticks: { maxTicksLimit: 9 } }, y: { min: 0, max: 1.05, title: { display: true, text: 'p(x)' } } }
    }
  });

  function updateShade(a, b) {
    const lower = Math.max(0, a);
    const upper = Math.min(2, b);
    chart.data.datasets[0].data = points.map((x) => (x >= lower && x <= upper ? triangularDensity(x) : null));
    chart.update();
  }

  function calculateProbability() {
    const a = Number(container.querySelector('[data-prob-a]').value);
    const b = Number(container.querySelector('[data-prob-b]').value);
    try {
      const result = intervalProbability(a, b);
      updateShade(a, b);
      container.querySelector('[data-probability-result]').innerHTML = `<div class="result-box is-correct"><strong>P(${numberText(a)} ≤ X ≤ ${numberText(b)}) = ${fractionText(result.value)}</strong><p>概率就是选定区间内密度曲线下方的面积。</p></div>`;
      const steps = result.pieces.length
        ? result.pieces.map((piece, index) => `<li><strong>第 ${index + 1} 段：</strong>∫<sub>${piece.from}</sub><sup>${piece.to}</sup> ${piece.integrand} dx = [${piece.antiderivative}] = ${numberText(piece.value)}</li>`).join('')
        : '<li>区间与密度支持范围 (0,2) 没有重叠，因此面积为 0。</li>';
      container.querySelector('[data-integration-steps]').innerHTML = `<div class="integration-steps"><h4>${result.pieces.length > 1 ? '跨过 x=1，拆成两段积分' : '积分步骤'}</h4><ol>${steps}</ol></div>`;
    } catch (error) {
      container.querySelector('[data-probability-result]').innerHTML = `<div class="result-box is-wrong"><strong>区间无效</strong><p>${error.message}</p></div>`;
    }
  }

  function showMoment(kind) {
    const moments = triangularMoments();
    const content = {
      expectation: { title: 'E[X] = 1', formula: '∫₀¹ x² dx + ∫₁² x(2-x) dx = 1/3 + 2/3 = 1', note: '期望落在对称中心 x=1。' },
      secondMoment: { title: 'E[X²] = 7/6 = 1.166667', formula: '∫₀¹ x³ dx + ∫₁² x²(2-x) dx = 1/4 + 11/12 = 7/6', note: '二阶矩为方差提供平方尺度。' },
      variance: { title: 'Var(X) = 1/6 = 0.166667', formula: `E[X²]-E[X]² = ${fractionText(moments.secondMoment)} - 1² = 1/6`, note: '方差越小，概率质量越集中在期望附近。' }
    }[kind];
    container.querySelector('[data-moment-output]').innerHTML = `<div class="result-box is-correct"><strong>${content.title}</strong><p>${content.formula}</p><p>${content.note}</p></div>`;
  }

  container.querySelector('[data-calculate-probability]')?.addEventListener('click', calculateProbability);
  container.querySelector('[data-probability-example]')?.addEventListener('click', () => {
    container.querySelector('[data-prob-a]').value = '0';
    container.querySelector('[data-prob-b]').value = '0.5';
    calculateProbability();
  });
  container.querySelectorAll('[data-moment]').forEach((button) => button.addEventListener('click', () => showMoment(button.dataset.moment)));

  calculateProbability();
  activeProbabilityLab = { destroy: () => chart.destroy() };
}
