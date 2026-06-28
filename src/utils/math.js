import { det, matrix, multiply, pow } from 'mathjs';

export function nearlyEqual(a, b, epsilon = 1e-6) {
  return Math.abs(Number(a) - Number(b)) <= epsilon;
}

export function multiplyMatrices(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
    throw new Error('矩阵不能为空');
  }
  const aCols = a[0].length;
  const bRows = b.length;
  if (aCols !== bRows) {
    throw new Error('第一个矩阵的列数必须等于第二个矩阵的行数');
  }
  return a.map((row) =>
    b[0].map((_, colIndex) =>
      row.reduce((sum, value, i) => sum + Number(value) * Number(b[i][colIndex]), 0)
    )
  );
}

export function matrixPower(values, exponent) {
  return pow(matrix(values), exponent).toArray();
}

export function determinant(values) {
  return det(matrix(values));
}

export function dotProduct(row, column) {
  return row.reduce((sum, value, index) => sum + Number(value) * Number(column[index]), 0);
}

export function getColumn(values, index) {
  return values.map((row) => row[index]);
}

export function predictDistribution(distribution, transitionMatrix) {
  const result = multiplyMatrices([distribution], transitionMatrix)[0];
  return result.map((value) => Number(value.toFixed(8)));
}

export function simulateMarkov(initialDistribution, transitionMatrix, days) {
  const history = [{ day: 0, distribution: initialDistribution.map(Number) }];
  let current = initialDistribution.map(Number);
  for (let day = 1; day <= days; day += 1) {
    current = predictDistribution(current, transitionMatrix);
    history.push({ day, distribution: current });
  }
  return history;
}

export function rowSums(matrixValues) {
  return matrixValues.map((row) => row.reduce((sum, value) => sum + Number(value || 0), 0));
}

export function parseMatrixText(text, rows, cols) {
  const numbers = String(text)
    .replace(/\[/g, '')
    .replace(/\]/g, '')
    .split(/[\s,;]+/)
    .filter(Boolean)
    .map(Number);
  if (numbers.length !== rows * cols || numbers.some(Number.isNaN)) {
    return null;
  }
  return Array.from({ length: rows }, (_, r) => numbers.slice(r * cols, r * cols + cols));
}

export function normalizeDistribution(values) {
  const total = values.reduce((sum, value) => sum + Number(value || 0), 0);
  if (!total) return values.map(() => 0);
  return values.map((value) => Number((Number(value || 0) / total).toFixed(6)));
}
