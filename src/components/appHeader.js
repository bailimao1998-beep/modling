import { modules } from '../data/modules.js';
import { loadState } from '../services/storage.js';
import { getDueReviews } from '../services/spacedReview.js';
import { getOverallMastery } from '../services/progress.js';
import { icon } from './icon.js';

const routeTitles = {
  '/dashboard': '学习首页',
  '/courses': '课程与知识地图',
  '/lesson': '互动课程',
  '/labs': '互动实验',
  '/practice': '专项练习',
  '/mistakes': '错题本',
  '/exam': '模拟考试',
  '/reports': '学习报告'
};

export function appHeader() {
  return `
    <header class="app-header">
      <div class="header-leading">
        <button class="icon-button mobile-menu-button" data-toggle-sidebar type="button" aria-label="打开导航">
          ${icon('menu')}
        </button>
        <div>
          <span class="header-kicker">F11MT Study Workspace</span>
          <strong data-page-title>学习首页</strong>
        </div>
      </div>
      <div class="header-metrics" aria-label="学习状态">
        <a href="#/mistakes" class="header-metric">${icon('calendar-check')}<span>今日复习</span><strong data-header-due>0</strong></a>
        <a href="#/reports" class="header-metric">${icon('gauge')}<span>总掌握度</span><strong data-header-mastery>0%</strong></a>
        <span class="save-status" data-save-status>${icon('cloud-check')} 本地已保存</span>
      </div>
    </header>`;
}

export function syncAppHeader(pathname) {
  const state = loadState();
  const title = document.querySelector('[data-page-title]');
  const due = document.querySelector('[data-header-due]');
  const mastery = document.querySelector('[data-header-mastery]');
  if (title) title.textContent = routeTitles[pathname] || '学习空间';
  if (due) due.textContent = getDueReviews(state).length;
  if (mastery) mastery.textContent = `${getOverallMastery(state, modules)}%`;
}

export function bindAppHeader() {
  window.addEventListener('study-state-change', () => {
    const status = document.querySelector('[data-save-status]');
    if (status) status.lastChild.textContent = ' 本地已保存';
    syncAppHeader((location.hash || '#/dashboard').replace('#', '').split('?')[0]);
  });
}
