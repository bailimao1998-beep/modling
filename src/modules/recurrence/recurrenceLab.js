import Chart from 'chart.js/auto';
import { formulaBlock } from '../../components/formula.js';
import { renderRichMathText } from '../../utils/richMathText.js';
import { nextRecurrenceState, recurrenceMatrix, simulateLogistic } from './recurrenceMath.js';

const defaultLogistic = { r: 2.8, x0: 0.2, steps: 20 };
const secondOrderMatrix = recurrenceMatrix(2, -2);
let activeRecurrenceLab = null;

function numberText(value) {
  const rounded = Number(Number(value).toFixed(6));
  return Object.is(rounded, -0) ? '0' : String(rounded);
}

function logisticTable(values) {
  return `<div class="table-scroll recurrence-table-scroll"><table class="lab-matrix recurrence-value-table"><thead><tr><th>k</th><th>x_k</th></tr></thead><tbody>${values.map((item) => `<tr><td>${item.k}</td><td>${numberText(item.value)}</td></tr>`).join('')}</tbody></table></div>`;
}

function sequenceTable(sequence) {
  return `<div class="table-scroll recurrence-table-scroll"><table class="lab-matrix recurrence-value-table" data-recurrence-sequence><thead><tr><th>k</th><th>x_k</th></tr></thead><tbody>${sequence.map((value, index) => `<tr><td>${index}</td><td>${numberText(value)}</td></tr>`).join('')}</tbody></table></div>`;
}

function behaviorText(r) {
  if (r < 1) return '当前 r 通常使状态逐步衰减到 0。';
  if (r < 3) return '当前 r 通常会收敛到一个稳定值。';
  if (r < 3.57) return '增大 r 后可能出现两个或多个值之间的周期震荡。';
  return '这个 r 区间可能出现复杂或混沌行为；相近初值也可能逐渐分开。';
}

export function renderRecurrenceLab() {
  return `<section class="interactive-panel recurrence-lab" data-recurrence-lab>
    <div class="panel-heading"><div><h3>动态系统与递推实验室</h3><p>先观察一阶非线性更新，再把二阶递推压缩成一个 2×2 矩阵系统。</p></div></div>
    <div class="recurrence-lab-layout">
      <section class="lab-pane logistic-pane">
        <div class="lab-pane-heading"><div><span class="eyebrow">First-order map</span><h4>Logistic map 模拟器</h4></div><span>x_{k+1}=rx_k(1-x_k)</span></div>
        <div class="compact-form-row"><label><span>参数 r</span><input data-logistic-r type="number" min="0" max="4" step="0.1" value="2.8" /></label><label><span>初始值 x₀</span><input data-logistic-x0 type="number" min="0" max="1" step="0.01" value="0.2" /></label><label><span>步数</span><input data-logistic-steps type="number" min="1" max="200" step="1" value="20" /></label></div>
        <div class="card-actions"><button class="primary-button" data-simulate-logistic type="button">模拟</button><button class="ghost-button" data-reset-logistic type="button">恢复默认参数</button></div>
        <div class="calculation-result" data-logistic-feedback aria-live="polite"></div>
        <div class="chart-frame recurrence-chart-frame"><canvas data-logistic-chart aria-label="Logistic map 状态随步数变化图"></canvas></div>
        <div data-logistic-table></div>
      </section>
      <section class="lab-pane second-order-pane">
        <div class="lab-pane-heading"><div><span class="eyebrow">Matrix form</span><h4>二阶递推矩阵化</h4></div><span>x₀=0，x₁=1</span></div>
        ${formulaBlock(['x_{k+2}=2x_{k+1}-2x_k', 'y_k=\\begin{bmatrix}x_{k+1}\\\\x_k\\end{bmatrix}', 'A=\\begin{bmatrix}2&-2\\\\1&0\\end{bmatrix},\\quad y_{k+1}=Ay_k'])}
        <div class="recurrence-state" data-recurrence-state></div>
        <div class="dot-process recurrence-process" data-recurrence-process></div>
        <div class="card-actions"><button class="primary-button" data-recurrence-next type="button">下一步</button><button class="ghost-button" data-recurrence-reset type="button">重新开始</button></div>
        <div data-recurrence-table>${sequenceTable([0, 1])}</div>
        <div class="concept-note"><strong>长期行为直觉</strong><p>|λ|&lt;1 的模式衰减，负值或复数可能带来震荡，|λ|&gt;1 的模式会增长。本例特征值为 1±i，模大于 1，因此会震荡并放大。</p></div>
      </section>
    </div>
  </section>`;
}

export function destroyRecurrenceLab() {
  activeRecurrenceLab?.destroy();
  activeRecurrenceLab = null;
}

export function bindRecurrenceLab(root = document) {
  destroyRecurrenceLab();
  const container = root.querySelector('[data-recurrence-lab]');
  if (!container) return;
  let chart = null;
  let sequence = [0, 1];
  let state = [1, 0];
  let stateIndex = 0;
  let lastProcess = null;

  function renderLogisticChart(values) {
    const data = {
      labels: values.map((item) => item.k),
      datasets: [{ label: 'x_k', data: values.map((item) => item.value), borderColor: '#68708a', backgroundColor: 'rgba(104,112,138,0.16)', borderWidth: 2.5, pointRadius: values.length > 60 ? 0 : 2, tension: 0.18, fill: false }]
    };
    if (chart) {
      chart.data = data;
      chart.update();
      return;
    }
    chart = new Chart(container.querySelector('[data-logistic-chart]'), {
      type: 'line',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' }, title: { display: true, text: 'x_k 随 k 的变化' } },
        scales: { x: { title: { display: true, text: 'k' } }, y: { title: { display: true, text: 'x_k' } } }
      }
    });
  }

  function simulate() {
    const r = container.querySelector('[data-logistic-r]').value;
    const x0 = container.querySelector('[data-logistic-x0]').value;
    const steps = container.querySelector('[data-logistic-steps]').value;
    try {
      const values = simulateLogistic({ r, x0, steps });
      renderLogisticChart(values);
      container.querySelector('[data-logistic-table]').innerHTML = logisticTable(values);
      container.querySelector('[data-logistic-feedback]').innerHTML = `<div class="result-box is-correct"><strong>已模拟 ${Number(steps)} 步</strong><p>${behaviorText(Number(r))}</p></div>`;
    } catch (error) {
      container.querySelector('[data-logistic-feedback]').innerHTML = `<div class="result-box is-wrong"><strong>参数无效</strong><p>${error.message}</p></div>`;
    }
  }

  function processHtml() {
    if (!lastProcess) return renderRichMathText('准备计算 y₁=Ay₀。点击“下一步”得到 x₂。');
    const { fromIndex, from, next } = lastProcess;
    return `<strong>${renderRichMathText(`y_${fromIndex + 1}=Ay_${fromIndex}`)}</strong><span>${renderRichMathText(`[2×${numberText(from[0])}-2×${numberText(from[1])}, ${numberText(from[0])}]^T = [${numberText(next[0])}, ${numberText(next[1])}]^T`)}</span>`;
  }

  function renderRecurrence() {
    const newestIndex = sequence.length - 1;
    container.querySelector('[data-recurrence-state]').innerHTML = `<span>当前状态</span><strong>${renderRichMathText(`y_${stateIndex} = [x_${newestIndex}, x_${newestIndex - 1}]^T = [${numberText(state[0])}, ${numberText(state[1])}]^T`)}</strong>`;
    container.querySelector('[data-recurrence-process]').innerHTML = processHtml();
    container.querySelector('[data-recurrence-table]').innerHTML = sequenceTable(sequence);
    const button = container.querySelector('[data-recurrence-next]');
    const complete = newestIndex >= 6;
    button.disabled = complete;
    button.textContent = complete ? '已计算到 x₆' : `下一步：计算 x${newestIndex + 1}`;
  }

  container.querySelector('[data-simulate-logistic]')?.addEventListener('click', simulate);
  container.querySelector('[data-reset-logistic]')?.addEventListener('click', () => {
    container.querySelector('[data-logistic-r]').value = defaultLogistic.r;
    container.querySelector('[data-logistic-x0]').value = defaultLogistic.x0;
    container.querySelector('[data-logistic-steps]').value = defaultLogistic.steps;
    simulate();
  });
  container.querySelector('[data-recurrence-next]')?.addEventListener('click', () => {
    if (sequence.length - 1 >= 6) return;
    const from = [...state];
    const next = nextRecurrenceState(from, secondOrderMatrix);
    lastProcess = { fromIndex: stateIndex, from, next };
    state = next;
    stateIndex += 1;
    sequence.push(next[0]);
    renderRecurrence();
  });
  container.querySelector('[data-recurrence-reset]')?.addEventListener('click', () => {
    sequence = [0, 1];
    state = [1, 0];
    stateIndex = 0;
    lastProcess = null;
    renderRecurrence();
  });

  simulate();
  renderRecurrence();
  activeRecurrenceLab = { destroy: () => chart?.destroy() };
}
