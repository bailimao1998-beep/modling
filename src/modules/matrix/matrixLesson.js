import { dotProduct, getColumn, multiplyMatrices } from '../../utils/math.js';

const matrixA = [
  [1, 2],
  [3, 4]
];
const matrixB = [
  [2, 0],
  [1, 2]
];
const answer = multiplyMatrices(matrixA, matrixB);

function matrixTable(values, name, active) {
  return `
    <div class="matrix-demo-table">
      <strong>${name}</strong>
      <div class="matrix-grid" style="--cols:${values[0].length}">
        ${values
          .flatMap((row, rowIndex) =>
            row.map((value, colIndex) => {
              const isActiveRow = active?.row === rowIndex && name === 'A';
              const isActiveCol = active?.col === colIndex && name === 'B';
              return `<span class="${isActiveRow || isActiveCol ? 'is-highlighted' : ''}">${value}</span>`;
            })
          )
          .join('')}
      </div>
    </div>
  `;
}

export function renderMatrixLessonDemo() {
  return `
    <section class="interactive-panel" data-matrix-demo>
      <div class="panel-heading">
        <div>
          <h3>矩阵乘法互动演示</h3>
          <p>按“下一格”查看行乘列过程，然后填写 AB 的结果。</p>
        </div>
        <button class="secondary-button" data-next-cell type="button">下一格</button>
      </div>
      <div class="matrix-demo-stage" data-matrix-stage></div>
      <div class="dot-process" data-dot-process></div>
      <div class="matrix-answer" style="--cols:2">
        <input data-demo-answer="0-0" inputmode="decimal" aria-label="结果第 1 行第 1 列" />
        <input data-demo-answer="0-1" inputmode="decimal" aria-label="结果第 1 行第 2 列" />
        <input data-demo-answer="1-0" inputmode="decimal" aria-label="结果第 2 行第 1 列" />
        <input data-demo-answer="1-1" inputmode="decimal" aria-label="结果第 2 行第 2 列" />
      </div>
      <div class="card-actions">
        <button class="primary-button" data-check-demo type="button">检查矩阵</button>
      </div>
      <div data-demo-feedback></div>
    </section>
  `;
}

export function bindMatrixLessonDemo(root) {
  const demo = root.querySelector('[data-matrix-demo]');
  if (!demo) return;
  let index = 0;
  const positions = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
  ];

  function render() {
    const [row, col] = positions[index];
    const column = getColumn(matrixB, col);
    const process = matrixA[row]
      .map((value, i) => `${value}×${column[i]}`)
      .join(' + ');
    demo.querySelector('[data-matrix-stage]').innerHTML = `
      ${matrixTable(matrixA, 'A', { row, col })}
      <span class="operator">×</span>
      ${matrixTable(matrixB, 'B', { row, col })}
      <span class="operator">=</span>
      <div class="matrix-demo-table">
        <strong>AB</strong>
        <div class="matrix-grid result-grid" style="--cols:2">
          ${positions
            .map(([r, c], cellIndex) => `<span class="${cellIndex === index ? 'is-current' : ''}">${cellIndex < index ? answer[r][c] : '?'}</span>`)
            .join('')}
        </div>
      </div>
    `;
    demo.querySelector('[data-dot-process]').innerHTML = `
      当前元素：第 ${row + 1} 行第 ${col + 1} 列，
      <strong>${process} = ${dotProduct(matrixA[row], column)}</strong>
    `;
  }

  demo.querySelector('[data-next-cell]')?.addEventListener('click', () => {
    index = (index + 1) % positions.length;
    render();
  });

  demo.querySelector('[data-check-demo]')?.addEventListener('click', () => {
    const wrong = [];
    positions.forEach(([row, col]) => {
      const input = demo.querySelector(`[data-demo-answer="${row}-${col}"]`);
      if (Number(input.value) !== answer[row][col]) {
        wrong.push(`第 ${row + 1} 行第 ${col + 1} 列`);
      }
    });
    demo.querySelector('[data-demo-feedback]').innerHTML = wrong.length
      ? `<div class="result-box is-wrong"><strong>还有 ${wrong.length} 个元素需要检查</strong><p>${wrong.join('、')} 算错了。回到对应行和列重新做点积。</p></div>`
      : '<div class="result-box is-correct"><strong>矩阵乘法正确</strong><p>四个元素都符合行乘列规则。</p></div>';
  });

  render();
}
