import { renderRichMathText } from '../utils/richMathText.js';

export function hintPanel(question) {
  return `
    <div class="hint-panel" data-hints>
      <div class="hint-header">
        <strong>三级提示</strong>
        <button class="secondary-button" data-next-hint type="button">显示提示 1</button>
      </div>
      <ol class="hint-list" data-hint-list></ol>
    </div>
  `;
}

export function bindHintPanel(root, hints = []) {
  let visibleCount = 0;
  const button = root.querySelector('[data-next-hint]');
  const list = root.querySelector('[data-hint-list]');
  button?.addEventListener('click', () => {
    visibleCount = Math.min(hints.length, visibleCount + 1);
    list.innerHTML = hints.slice(0, visibleCount).map((hint) => `<li>${renderRichMathText(hint)}</li>`).join('');
    button.textContent = visibleCount >= hints.length ? '提示已全部显示' : `显示提示 ${visibleCount + 1}`;
    button.disabled = visibleCount >= hints.length;
  });
}
