import { nearlyEqual, rowSums } from './math.js';

export function validateProbabilityRow(row) {
  const values = row.map(Number);
  const hasInvalid = values.some((value) => Number.isNaN(value) || value < 0 || value > 1);
  const sum = values.reduce((total, value) => total + value, 0);
  return {
    valid: !hasInvalid && nearlyEqual(sum, 1, 1e-4),
    sum,
    message: hasInvalid
      ? '概率必须在 0 到 1 之间'
      : nearlyEqual(sum, 1, 1e-4)
        ? '这一行概率有效'
        : `这一行概率之和是 ${sum.toFixed(3)}，需要等于 1`
  };
}

export function validateTransitionMatrix(matrix) {
  return rowSums(matrix).map((sum, index) => ({
    row: index,
    sum,
    valid: nearlyEqual(sum, 1, 1e-4)
  }));
}

export function isFilled(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}
