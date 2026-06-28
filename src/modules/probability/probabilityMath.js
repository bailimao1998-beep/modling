function leftIntegral(from, to) {
  return (to ** 2 - from ** 2) / 2;
}

function rightIntegral(from, to) {
  const antiderivative = (value) => 2 * value - value ** 2 / 2;
  return antiderivative(to) - antiderivative(from);
}

export function triangularDensity(x) {
  const value = Number(x);
  if (value <= 0 || value >= 2) return 0;
  if (value <= 1) return value;
  return 2 - value;
}

export function intervalProbability(a, b) {
  const start = Number(a);
  const end = Number(b);
  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) {
    throw new Error('区间需要满足 a ≤ b');
  }

  const lower = Math.max(0, start);
  const upper = Math.min(2, end);
  const pieces = [];
  if (lower < Math.min(upper, 1)) {
    const to = Math.min(upper, 1);
    const value = leftIntegral(lower, to);
    pieces.push({ from: lower, to, integrand: 'x', value, antiderivative: 'x²/2' });
  }
  if (Math.max(lower, 1) < upper) {
    const from = Math.max(lower, 1);
    const value = rightIntegral(from, upper);
    pieces.push({ from, to: upper, integrand: '2-x', value, antiderivative: '2x-x²/2' });
  }

  return {
    requested: [start, end],
    supported: upper > lower ? [lower, upper] : null,
    pieces,
    value: pieces.reduce((sum, piece) => sum + piece.value, 0)
  };
}

export function triangularMoments() {
  const expectation = 1 / 3 + 2 / 3;
  const secondMoment = 1 / 4 + 11 / 12;
  return {
    expectation,
    secondMoment,
    variance: secondMoment - expectation ** 2
  };
}
