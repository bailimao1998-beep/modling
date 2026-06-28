import cytoscape from 'cytoscape';
import {
  completeGraphAdjacency,
  degreeMatrix,
  laplacianMatrix,
  spanningTreeCount,
  toggleUndirectedEdge,
  walkCount
} from './graphMath.js';

const vertices = ['v1', 'v2', 'v3', 'v4'];
const edges = [
  [0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]
];

let activeGraphLab = null;

function matrixTable(values, label) {
  return `<div class="matrix-output"><strong>${label}</strong><div class="table-scroll"><table class="lab-matrix" aria-label="${label}"><tbody>${values.map((row) => `<tr>${row.map((value) => `<td>${value}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
}

function vertexOptions(selected) {
  return vertices.map((vertex, index) => `<option value="${index}" ${index === selected ? 'selected' : ''}>${vertex}</option>`).join('');
}

function indexOptions(selected) {
  return vertices.map((_, index) => `<option value="${index}" ${index === selected ? 'selected' : ''}>第 ${index + 1} 行/列</option>`).join('');
}

export function renderGraphLab() {
  const adjacency = completeGraphAdjacency(4);
  return `<section class="interactive-panel graph-lab" data-graph-lab>
    <div class="panel-heading"><div><h3>K4 图论实验室</h3><p>点击图中的边或下方连接按钮，邻接矩阵、度矩阵与 Laplacian 会同步变化。</p></div><button class="secondary-button" data-reset-graph type="button">恢复 K4 默认图</button></div>
    <div class="graph-lab-layout">
      <div class="lab-pane graph-editor-pane"><div class="lab-pane-heading"><h4>无向图</h4><span data-edge-count>6 条有效边</span></div><div class="graph-lab-canvas" data-graph-cy aria-label="K4 可交互无向图"></div><div class="edge-toggle-grid" data-edge-controls>${edges.map(([from, to]) => `<button type="button" data-graph-edge="${from}-${to}" aria-pressed="true">${vertices[from]}—${vertices[to]} · 已连接</button>`).join('')}</div></div>
      <div class="lab-pane graph-matrices-pane"><div class="lab-pane-heading"><h4>图的三个核心矩阵</h4><span>L = D - A</span></div><div class="graph-matrix-stack" data-graph-matrices>${matrixTable(adjacency, '邻接矩阵 A')}${matrixTable(degreeMatrix(adjacency), '度矩阵 D')}${matrixTable(laplacianMatrix(adjacency), '图拉普拉斯 L')}</div></div>
    </div>
    <div class="graph-training-grid">
      <section class="training-panel"><span class="eyebrow">Walks</span><h4>用 A^k 计算 walks</h4><p>A^k 的第 i 行第 j 列，等于从 vi 到 vj 长度为 k 的 walks 数量。</p><div class="compact-form-row"><label><span>起点</span><select data-walk-start>${vertexOptions(0)}</select></label><label><span>终点</span><select data-walk-end>${vertexOptions(2)}</select></label><label><span>长度 k</span><input data-walk-length type="number" min="0" max="10" step="1" value="4" /></label></div><div class="card-actions"><button class="primary-button" data-calculate-walk type="button">计算 walks</button><button class="secondary-button" data-k4-walk-preset type="button">计算 v1 到 v3 长度 4</button></div><div class="calculation-result" data-walk-result><p>默认 K4 的往年卷类似题型结果应为 20。</p></div><div data-walk-power></div></section>
      <section class="training-panel"><span class="eyebrow">Matrix-tree theorem</span><h4>用 Laplacian minor 数生成树</h4><p>从 L 删除任一行与任一列，所得 minor 的 determinant 就是 spanning tree 数量。</p><div class="compact-form-row two"><label><span>删除行</span><select data-delete-row>${indexOptions(0)}</select></label><label><span>删除列</span><select data-delete-col>${indexOptions(0)}</select></label></div><div class="card-actions"><button class="primary-button" data-calculate-tree type="button">计算生成树数量</button></div><div class="calculation-result" data-tree-result><p>默认 K4 的结果应为 16。</p></div><div data-tree-minor></div></section>
    </div>
  </section>`;
}

export function destroyGraphLab() {
  activeGraphLab?.destroy();
  activeGraphLab = null;
}

export function bindGraphLab(root = document) {
  destroyGraphLab();
  const container = root.querySelector('[data-graph-lab]');
  if (!container) return;
  let adjacency = completeGraphAdjacency(4);

  const cy = cytoscape({
    container: container.querySelector('[data-graph-cy]'),
    elements: [
      ...vertices.map((vertex, index) => ({ data: { id: `v${index}`, label: String(index + 1) } })),
      ...edges.map(([from, to]) => ({ data: { id: `e${from}-${to}`, source: `v${from}`, target: `v${to}`, active: 1 } }))
    ],
    style: [
      { selector: 'node', style: { label: 'data(label)', 'background-color': '#e5f0e7', 'border-color': '#526b55', 'border-width': 2, color: '#2f4733', width: 54, height: 54, 'text-valign': 'center', 'text-halign': 'center', 'font-size': 15, 'font-weight': 700 } },
      { selector: 'edge', style: { width: 3, 'line-color': '#6d8871', 'curve-style': 'straight' } },
      { selector: 'edge[active = 0]', style: { width: 2, 'line-style': 'dashed', 'line-color': '#c9d1ce', opacity: 0.58 } }
    ],
    layout: { name: 'circle', padding: 34 }
  });

  function syncGraph() {
    edges.forEach(([from, to]) => {
      const active = adjacency[from][to] ? 1 : 0;
      cy.getElementById(`e${from}-${to}`).data('active', active);
      const button = container.querySelector(`[data-graph-edge="${from}-${to}"]`);
      if (button) {
        button.setAttribute('aria-pressed', String(Boolean(active)));
        button.classList.toggle('is-inactive', !active);
        button.textContent = `${vertices[from]}—${vertices[to]} · ${active ? '已连接' : '已关闭'}`;
      }
    });
    const count = edges.filter(([from, to]) => adjacency[from][to]).length;
    container.querySelector('[data-edge-count]').textContent = `${count} 条有效边`;
    container.querySelector('[data-graph-matrices]').innerHTML = `${matrixTable(adjacency, '邻接矩阵 A')}${matrixTable(degreeMatrix(adjacency), '度矩阵 D')}${matrixTable(laplacianMatrix(adjacency), '图拉普拉斯 L')}`;
  }

  function calculateWalk() {
    try {
      const from = Number(container.querySelector('[data-walk-start]').value);
      const to = Number(container.querySelector('[data-walk-end]').value);
      const length = Number(container.querySelector('[data-walk-length]').value);
      const result = walkCount(adjacency, from, to, length);
      container.querySelector('[data-walk-result]').innerHTML = `<div class="result-box is-correct"><strong>[A<sup>${length}</sup>]<sub>${from + 1}${to + 1}</sub> = ${result.count}</strong><p>因此从 ${vertices[from]} 到 ${vertices[to]} 有 ${result.count} 条长度为 ${length} 的 walks。K4 中 v1 到 v3、长度 4 的结果 20 是往年卷类似题型。</p></div>`;
      container.querySelector('[data-walk-power]').innerHTML = matrixTable(result.power, `A^${length}`);
    } catch (error) {
      container.querySelector('[data-walk-result]').innerHTML = `<div class="result-box is-wrong"><strong>无法计算</strong><p>${error.message}</p></div>`;
    }
  }

  function calculateTrees() {
    const row = Number(container.querySelector('[data-delete-row]').value);
    const col = Number(container.querySelector('[data-delete-col]').value);
    const result = spanningTreeCount(adjacency, row, col);
    container.querySelector('[data-tree-result]').innerHTML = `<div class="result-box is-correct"><strong>det(minor) = ${result.count}</strong><p>删除 L 的第 ${row + 1} 行和第 ${col + 1} 列。根据 Matrix-tree theorem，这张图有 ${result.count} 棵 spanning trees。</p></div>`;
    container.querySelector('[data-tree-minor]').innerHTML = matrixTable(result.minor, `L minor (${row + 1},${col + 1})`);
  }

  function toggle(from, to) {
    adjacency = toggleUndirectedEdge(adjacency, from, to);
    syncGraph();
    calculateWalk();
    calculateTrees();
  }

  cy.on('tap', 'edge', (event) => {
    const [from, to] = event.target.id().slice(1).split('-').map(Number);
    toggle(from, to);
  });
  container.querySelectorAll('[data-graph-edge]').forEach((button) => button.addEventListener('click', () => {
    const [from, to] = button.dataset.graphEdge.split('-').map(Number);
    toggle(from, to);
  }));
  container.querySelector('[data-calculate-walk]')?.addEventListener('click', calculateWalk);
  container.querySelector('[data-k4-walk-preset]')?.addEventListener('click', () => {
    container.querySelector('[data-walk-start]').value = '0';
    container.querySelector('[data-walk-end]').value = '2';
    container.querySelector('[data-walk-length]').value = '4';
    calculateWalk();
  });
  container.querySelector('[data-calculate-tree]')?.addEventListener('click', calculateTrees);
  container.querySelector('[data-reset-graph]')?.addEventListener('click', () => {
    adjacency = completeGraphAdjacency(4);
    syncGraph();
    calculateWalk();
    calculateTrees();
  });

  syncGraph();
  calculateWalk();
  calculateTrees();
  activeGraphLab = { destroy: () => cy.destroy() };
}
