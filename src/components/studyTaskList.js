import { icon } from './icon.js';

const taskIcons = { review: 'rotate-ccw', mastery: 'target', exam: 'timer', proof: 'graduation-cap' };

export function studyTaskList(tasks, { limit = tasks.length } = {}) {
  const visible = tasks.slice(0, limit);
  if (!visible.length) return `<div class="empty-state compact"><span>${icon('check-circle-2')}</span><h3>今天的计划已清空</h3><p>可以休息，或在 48 小时后回来巩固。</p></div>`;
  return `<div class="study-task-list">${visible.map((task) => `<article class="study-task-item"><span class="study-task-icon">${icon(taskIcons[task.kind] || 'target')}</span><div><strong>${task.title}</strong><p>${task.reason}</p></div><a class="secondary-button" href="${task.route}">${task.actionLabel} ${icon('arrow-right')}</a></article>`).join('')}</div>`;
}
