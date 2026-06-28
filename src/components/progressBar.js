import { percent } from '../utils/format.js';

export function progressBar(value, label = '') {
  const safeValue = Math.max(0, Math.min(100, Number(value || 0)));
  return `
    <div class="progress-wrap" aria-label="${label || 'progress'}">
      <div class="progress-meta">
        <span>${label}</span>
        <strong>${percent(safeValue)}</strong>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width: ${safeValue}%"></div>
      </div>
    </div>
  `;
}
