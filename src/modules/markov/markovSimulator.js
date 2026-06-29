import cytoscape from 'cytoscape';
import Chart from 'chart.js/auto';
import { nearlyEqual, predictDistribution, simulateMarkov } from '../../utils/math.js';
import { validateTransitionMatrix } from '../../utils/validation.js';
import { renderRichMathText } from '../../utils/richMathText.js';

const states = ['晴天', '阴天', '雨天'];
const defaultMatrix = [
  [0.4, 0.6, 0],
  [0.25, 0, 0.75],
  [1, 0, 0]
];
const defaultDistribution = [1, 0, 0];
let activeMarkovSimulator = null;

function matrixEditor(matrix) {
  return `
    <div class="transition-editor">
      <div class="matrix-label-row"><span></span>${states.map((state) => `<span>到${state}</span>`).join('')}</div>
      ${matrix
        .map(
          (row, rowIndex) => `
          <div class="matrix-edit-row">
            <strong>从${states[rowIndex]}</strong>
            ${row
              .map(
                (value, colIndex) =>
                  `<input data-p="${rowIndex}-${colIndex}" aria-label="从${states[rowIndex]}到${states[colIndex]}的概率" type="number" min="0" max="1" step="0.01" value="${value}" />`
              )
              .join('')}
          </div>`
        )
        .join('')}
    </div>
  `;
}

function distributionInputs(values) {
  return `
    <div class="distribution-inputs">
      ${states
        .map(
          (state, index) => `
          <label>
            <span>${state}</span>
            <input data-dist="${index}" aria-label="${state}初始概率" type="number" min="0" max="1" step="0.01" value="${values[index]}" />
          </label>`
        )
        .join('')}
    </div>
  `;
}

export function renderMarkovSimulator() {
  return `
    <section class="interactive-panel markov-simulator" data-markov-simulator>
      <div class="panel-heading">
        <div>
          <h3>天气马尔可夫链模拟器</h3>
          <p>修改转移矩阵，观察状态图、矩阵校验和多日预测如何同步变化。</p>
        </div>
      </div>
      <div class="simulator-grid">
        <div class="simulator-pane"><h4>状态转移图</h4><p>箭头标签随矩阵同步变化。</p><div class="graph-pane" data-cy></div></div>
        <div class="control-pane simulator-pane">
          <h4>转移矩阵 P</h4><p>每行表示从当前天气出发。</p>
          ${matrixEditor(defaultMatrix)}
          <div class="validation-list" data-row-validation aria-live="polite"></div>
          <h4>初始概率分布 ρ</h4>
          ${distributionInputs(defaultDistribution)}
          <div class="validation-list" data-dist-validation aria-live="polite"></div>
          <div class="distribution-readout" data-current-dist></div>
          <div class="card-actions">
            <button class="primary-button" data-next-day type="button">下一天</button>
            <button class="secondary-button" data-run-ten type="button">连续模拟 10 天</button>
            <button class="secondary-button" data-apply-dist type="button">应用初始分布</button>
            <button class="ghost-button" data-reset-sim type="button">恢复默认</button>
          </div>
        </div>
        <div class="simulator-pane chart-pane"><h4>天气概率变化</h4><p>纵轴为概率，横轴为模拟天数。</p><div class="chart-frame markov-chart-frame"><canvas class="chart-canvas" data-markov-chart aria-label="天气概率随时间变化图"></canvas></div></div>
      </div>
    </section>
  `;
}

export function bindMarkovSimulator(root) {
  destroyMarkovSimulator();
  const container = root.querySelector('[data-markov-simulator]');
  if (!container) return;
  let currentDistribution = [...defaultDistribution];
  let history = [{ day: 0, distribution: currentDistribution }];
  let cy;
  let chart;

  function readMatrix() {
    return defaultMatrix.map((row, rowIndex) =>
      row.map((_, colIndex) => Number(container.querySelector(`[data-p="${rowIndex}-${colIndex}"]`).value || 0))
    );
  }

  function readInitialDistribution() {
    return states.map((_, index) => Number(container.querySelector(`[data-dist="${index}"]`).value || 0));
  }

  function edgeElements(matrix) {
    const elements = states.map((state, index) => ({ data: { id: `s${index}`, label: state } }));
    matrix.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (Number(value) > 0) {
          elements.push({
            data: {
              id: `e${rowIndex}-${colIndex}`,
              source: `s${rowIndex}`,
              target: `s${colIndex}`,
              label: Number(value).toFixed(2)
            }
          });
        }
      });
    });
    return elements;
  }

  function renderGraph(matrix) {
    if (cy) cy.destroy();
    cy = cytoscape({
      container: container.querySelector('[data-cy]'),
      elements: edgeElements(matrix),
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            'background-color': '#e3f0ef',
            'border-color': '#2f6672',
            'border-width': 2,
            color: '#173c43',
            'text-valign': 'center',
            'text-halign': 'center',
            width: 58,
            height: 58,
            'font-size': 14
          }
        },
        {
          selector: 'edge',
          style: {
            label: 'data(label)',
            width: 2,
            'line-color': '#668b91',
            'target-arrow-color': '#668b91',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'font-size': 12,
            'text-background-color': '#fff',
            'text-background-opacity': 0.9
          }
        }
      ],
      layout: { name: 'circle', padding: 28 }
    });
  }

  function renderChart() {
    const data = {
      labels: history.map((item) => `第 ${item.day} 天`),
      datasets: states.map((state, index) => ({
        label: state,
        data: history.map((item) => item.distribution[index]),
        borderWidth: 2,
        tension: 0.25
      }))
    };
    if (chart) {
      chart.data = data;
      chart.update();
      return;
    }
    chart = new Chart(container.querySelector('[data-markov-chart]'), {
      type: 'line',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { min: 0, max: 1 } }
      }
    });
  }

  function renderValidation(matrix) {
    const validation = validateTransitionMatrix(matrix);
    container.querySelector('[data-row-validation]').innerHTML = validation
      .map(
        (row, index) =>
          `<p class="${row.valid ? 'correct' : 'wrong'}">第 ${index + 1} 行概率和：${row.sum.toFixed(3)} ${
            row.valid ? '有效' : '需要等于 1'
          }</p>`
      )
      .join('');
    return validation.every((row) => row.valid);
  }

  function renderDistribution() {
    container.querySelector('[data-current-dist]').innerHTML = renderRichMathText(`当前分布：ρ = [${currentDistribution
      .map((value) => value.toFixed(3))
      .join(', ')}]`);
  }

  function validateDistribution(distribution) {
    const total = distribution.reduce((sum, value) => sum + value, 0);
    const validValues = distribution.every((value) => Number.isFinite(value) && value >= 0 && value <= 1);
    const valid = validValues && nearlyEqual(total, 1, 1e-4);
    container.querySelector('[data-dist-validation]').innerHTML = `<p class="${valid ? 'correct' : 'wrong'}">初始分布概率和：${total.toFixed(3)} ${valid ? '有效' : '需要等于 1，且每项在 0 到 1 之间'}</p>`;
    return valid;
  }

  function sync() {
    const matrix = readMatrix();
    renderGraph(matrix);
    renderValidation(matrix);
    validateDistribution(readInitialDistribution());
    renderDistribution();
    renderChart();
  }

  container.querySelectorAll('[data-p]').forEach((input) => {
    input.addEventListener('input', () => {
      const matrix = readMatrix();
      renderGraph(matrix);
      renderValidation(matrix);
    });
  });

  container.querySelectorAll('[data-dist]').forEach((input) => {
    input.addEventListener('input', () => validateDistribution(readInitialDistribution()));
  });

  container.querySelector('[data-next-day]')?.addEventListener('click', () => {
    const matrix = readMatrix();
    if (!renderValidation(matrix)) return;
    currentDistribution = predictDistribution(currentDistribution, matrix);
    history.push({ day: history.length, distribution: currentDistribution });
    renderDistribution();
    renderChart();
  });

  container.querySelector('[data-run-ten]')?.addEventListener('click', () => {
    const matrix = readMatrix();
    if (!renderValidation(matrix)) return;
    const simulated = simulateMarkov(currentDistribution, matrix, 10);
    simulated.slice(1).forEach((item) => {
      history.push({ day: history.length, distribution: item.distribution });
    });
    currentDistribution = history.at(-1).distribution;
    renderDistribution();
    renderChart();
  });

  container.querySelector('[data-apply-dist]')?.addEventListener('click', () => {
    const distribution = readInitialDistribution();
    if (!validateDistribution(distribution)) return;
    currentDistribution = distribution;
    history = [{ day: 0, distribution: currentDistribution }];
    renderDistribution();
    renderChart();
  });

  container.querySelector('[data-reset-sim]')?.addEventListener('click', () => {
    defaultMatrix.forEach((row, rowIndex) => row.forEach((value, colIndex) => { container.querySelector(`[data-p="${rowIndex}-${colIndex}"]`).value = value; }));
    defaultDistribution.forEach((value, index) => { container.querySelector(`[data-dist="${index}"]`).value = value; });
    currentDistribution = [...defaultDistribution];
    history = [{ day: 0, distribution: currentDistribution }];
    sync();
  });

  sync();
  activeMarkovSimulator = {
    destroy() {
      chart?.destroy();
      cy?.destroy();
    }
  };
}

export function destroyMarkovSimulator() {
  activeMarkovSimulator?.destroy();
  activeMarkovSimulator = null;
}
