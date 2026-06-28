import { determinant, matrixPower } from '../../utils/math.js';

function assertSquare(adjacency) {
  if (!Array.isArray(adjacency) || !adjacency.length || adjacency.some((row) => row.length !== adjacency.length)) {
    throw new Error('邻接矩阵必须是非空方阵');
  }
}

export function completeGraphAdjacency(size = 4) {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => (row === col ? 0 : 1))
  );
}

export function toggleUndirectedEdge(adjacency, from, to) {
  assertSquare(adjacency);
  if (from === to || !adjacency[from] || adjacency[from][to] === undefined) {
    throw new Error('请选择两个不同且有效的顶点');
  }
  const next = adjacency.map((row) => [...row]);
  const value = next[from][to] ? 0 : 1;
  next[from][to] = value;
  next[to][from] = value;
  return next;
}

export function degreeMatrix(adjacency) {
  assertSquare(adjacency);
  const degrees = adjacency.map((row) => row.reduce((sum, value) => sum + Number(value || 0), 0));
  return adjacency.map((row, rowIndex) => row.map((_, colIndex) => (rowIndex === colIndex ? degrees[rowIndex] : 0)));
}

export function laplacianMatrix(adjacency) {
  const degrees = degreeMatrix(adjacency);
  return adjacency.map((row, rowIndex) =>
    row.map((value, colIndex) => Number(degrees[rowIndex][colIndex]) - Number(value))
  );
}

export function adjacencyPower(adjacency, exponent) {
  assertSquare(adjacency);
  const power = Number(exponent);
  if (!Number.isInteger(power) || power < 0) throw new Error('walk 长度必须是非负整数');
  return matrixPower(adjacency, power).map((row) => row.map((value) => Math.round(Number(value))));
}

export function walkCount(adjacency, from, to, length) {
  const power = adjacencyPower(adjacency, length);
  if (!power[from] || power[from][to] === undefined) throw new Error('顶点编号无效');
  return { power, count: power[from][to] };
}

export function cofactorMinor(matrix, deletedRow, deletedColumn) {
  assertSquare(matrix);
  if (!matrix[deletedRow] || matrix[deletedRow][deletedColumn] === undefined) {
    throw new Error('删除的行或列无效');
  }
  return matrix
    .filter((_, rowIndex) => rowIndex !== deletedRow)
    .map((row) => row.filter((_, colIndex) => colIndex !== deletedColumn));
}

export function spanningTreeCount(adjacency, deletedRow = 0, deletedColumn = 0) {
  const laplacian = laplacianMatrix(adjacency);
  const minor = cofactorMinor(laplacian, deletedRow, deletedColumn);
  const count = Math.round(Math.abs(determinant(minor)));
  return { laplacian, minor, count };
}
