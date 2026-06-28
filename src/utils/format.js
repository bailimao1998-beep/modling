export function formatDate(dateLike) {
  if (!dateLike) return '暂无';
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return '暂无';
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function percent(value) {
  return `${Math.round(value)}%`;
}

export function formatMatrix(matrix) {
  return matrix.map((row) => `[${row.join(', ')}]`).join('\n');
}
