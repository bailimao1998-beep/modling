function finiteNumber(value, label) {
  if (value === null || value === undefined || String(value).trim() === '') throw new Error(`${label} 不能为空。`);
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error(`${label} 必须是有限数值。`);
  return number;
}

export function logisticStep(x, r) {
  const state = finiteNumber(x, 'x');
  const rate = finiteNumber(r, 'r');
  return rate * state * (1 - state);
}

export function simulateLogistic({ r = 2.8, x0 = 0.2, steps = 20 } = {}) {
  const rate = finiteNumber(r, 'r');
  const initial = finiteNumber(x0, 'x0');
  const count = Number(steps);
  if (rate < 0 || rate > 4) throw new Error('r 必须在 0 到 4 之间。');
  if (initial < 0 || initial > 1) throw new Error('x0 必须在 0 到 1 之间。');
  if (!Number.isInteger(count) || count < 1 || count > 200) throw new Error('steps 必须是 1 到 200 的整数。');

  const result = [{ k: 0, value: initial }];
  let current = initial;
  for (let k = 1; k <= count; k += 1) {
    current = logisticStep(current, rate);
    result.push({ k, value: current });
  }
  return result;
}

export function recurrenceMatrix(a, b) {
  return [[finiteNumber(a, 'a'), finiteNumber(b, 'b')], [1, 0]];
}

export function nextRecurrenceState(state, matrix = recurrenceMatrix(2, -2)) {
  if (!Array.isArray(state) || state.length !== 2) throw new Error('state 必须包含两个连续状态。');
  if (!Array.isArray(matrix) || matrix.length !== 2 || matrix.some((row) => !Array.isArray(row) || row.length !== 2)) {
    throw new Error('matrix 必须是 2×2 矩阵。');
  }
  const [newer, older] = state.map((value, index) => finiteNumber(value, `state[${index}]`));
  const values = matrix.map((row, rowIndex) => row.map((value, colIndex) => finiteNumber(value, `matrix[${rowIndex}][${colIndex}]`)));
  return [
    values[0][0] * newer + values[0][1] * older,
    values[1][0] * newer + values[1][1] * older
  ];
}

export function secondOrderSequence({ a = 2, b = -2, x0 = 0, x1 = 1, through = 6 } = {}) {
  const end = Number(through);
  if (!Number.isInteger(end) || end < 1 || end > 200) throw new Error('through 必须是 1 到 200 的整数。');
  const sequence = [finiteNumber(x0, 'x0'), finiteNumber(x1, 'x1')];
  const matrix = recurrenceMatrix(a, b);
  while (sequence.length <= end) {
    const state = [sequence.at(-1), sequence.at(-2)];
    sequence.push(nextRecurrenceState(state, matrix)[0]);
  }
  return sequence;
}
