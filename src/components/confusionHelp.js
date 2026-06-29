import { getBeginnerSupport } from '../data/coverageMap.js';
import { icon } from './icon.js';

export function confusionHelp(topic, moduleId = 'matrix', label = '我看不懂这一步') {
  const support = getBeginnerSupport(topic, moduleId);
  return `<div class="confusion-help">
    <button class="ghost-button" data-confusion-toggle type="button">${icon('circle-help')} ${label}</button>
    <div class="confusion-panel" data-confusion-panel hidden>
      <strong>这一步需要的前置知识</strong>
      <p>${support.prerequisites}</p>
      <strong>更简单的解释</strong>
      <p>${support.explanation}</p>
      <div class="card-actions">
        <a class="secondary-button" href="${support.lessonRoute}">返回对应 lesson ${icon('arrow-right')}</a>
        <a class="secondary-button" href="${support.questionRoute}">做一道引导题 ${icon('arrow-right')}</a>
      </div>
    </div>
  </div>`;
}

export function bindConfusionHelp(root = document) {
  root.querySelectorAll('[data-confusion-toggle]').forEach((button) => {
    if (button.dataset.boundConfusion) return;
    button.dataset.boundConfusion = 'true';
    button.addEventListener('click', () => {
      const panel = button.closest('.confusion-help')?.querySelector('[data-confusion-panel]');
      if (!panel) return;
      panel.hidden = !panel.hidden;
    });
  });
}
