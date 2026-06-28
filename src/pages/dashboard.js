import { modules } from '../data/modules.js';
import { questions } from '../data/questions.js';
import { loadState } from '../services/storage.js';
import { getDueReviews } from '../services/spacedReview.js';
import { masteryLabels, getOverallMastery } from '../services/progress.js';
import { getModuleEvidence, getModuleMasteryPercent, getScoreEstimate, getStudyRecommendation } from '../services/analytics.js';
import { progressBar } from '../components/progressBar.js';
import { formatDate } from '../utils/format.js';
import { icon } from '../components/icon.js';

function masteryLabel(percent) {
  return masteryLabels[Math.min(5, Math.floor(percent / 20))] || masteryLabels[0];
}

function moduleCard(module, state) {
  const percent = getModuleMasteryPercent(state, module);
  const evidence = getModuleEvidence(state, module.id);
  const latest = evidence.latest;
  return `<article class="module-card">
    <div class="module-card-heading"><span class="module-dot" style="--module-color:${module.color}"></span><div><h3>${module.title}</h3><p>${module.subtitle}</p></div></div>
    <div class="module-status"><strong>${masteryLabel(percent)}</strong>${progressBar(percent, '')}</div>
    <div class="module-evidence"><span>最近练习</span><strong>${latest ? `${latest.score}/${latest.maxScore} 分` : '暂无记录'}</strong><small>${latest ? formatDate(latest.at) : module.status === 'open' ? '从一节短课开始' : '课程目录已开放'}</small></div>
    <a class="secondary-button" href="${module.route}">${module.status === 'open' ? '进入模块' : '查看目录'} ${icon('arrow-right')}</a>
  </article>`;
}

export function renderDashboard() {
  const state = loadState();
  const dueReviews = getDueReviews(state);
  const overall = getOverallMastery(state, modules);
  const learnedTopics = Object.values(state.progress.topics || {}).filter((item) => Number(item.mastery) > 0).length;
  const recommendation = getStudyRecommendation(state, modules, questions, new Date().toISOString().slice(0, 10));
  const estimates = getScoreEstimate(state, modules);
  const estimatedTotal = estimates.reduce((sum, item) => sum + item.estimatedMarks, 0);

  return `<section class="page dashboard-page">
    <div class="page-heading"><div><span class="eyebrow">Study Console</span><h1>今天，从最值得复习的地方开始</h1><p>进度只来自课程接触、练习表现和间隔复习证据。</p></div><a class="secondary-button" href="#/reports">${icon('chart-no-axes-combined')} 查看报告</a></div>

    <section class="today-card">
      <div class="today-icon">${icon(recommendation.kind === 'review' ? 'refresh-cw' : 'book-open')}</div>
      <div><span class="eyebrow">今日学习建议</span><h2>${recommendation.title}</h2><p>${recommendation.reason}</p></div>
      <a class="primary-button" href="${recommendation.route}">${icon('play')} 开始学习</a>
    </section>

    <div class="stats-grid">
      <article class="stat-card stat-primary"><span>总体掌握度</span><strong>${overall}%</strong><small>基于全部课程知识点</small></article>
      <article class="stat-card"><span>已学习知识点</span><strong>${learnedTopics}</strong><small>共 ${modules.reduce((sum, module) => sum + module.topics.length, 0)} 个目录知识点</small></article>
      <article class="stat-card"><span>已完成练习</span><strong>${state.progress.completedCount || 0}</strong><small>首次完整答对的题目</small></article>
      <article class="stat-card"><span>当前错题</span><strong>${state.mistakes.length}</strong><small>${dueReviews.length} 项今日到期</small></article>
    </div>

    <section class="section-block"><div class="section-heading"><div><span class="eyebrow">Five Modules</span><h2>五大模块进度</h2></div><a href="#/courses">打开知识地图 ${icon('arrow-right')}</a></div><div class="module-grid">${modules.map((module) => moduleCard(module, state)).join('')}</div></section>

    <div class="dashboard-columns">
      <section class="section-block"><div class="section-heading"><div><span class="eyebrow">Due Today</span><h2>今日待复习</h2></div><span class="count-badge">${dueReviews.length}</span></div>
        ${dueReviews.length ? `<div class="review-list">${dueReviews.slice(0, 5).map((item) => `<a href="#/practice?module=${item.module}&question=${item.questionId}"><span>${icon('rotate-ccw')}</span><div><strong>${item.title}</strong><small>${item.nextReviewDate} 到期</small></div><span>${icon('chevron-right')}</span></a>`).join('')}</div>` : `<div class="empty-state compact"><span>${icon('calendar-check')}</span><h3>今天没有到期复习</h3><p>完成新题后，系统会按 2、4、8、15 天安排复习。</p></div>`}
      </section>
      <section class="section-block"><div class="section-heading"><div><span class="eyebrow">Reference Only</span><h2>考试得分参考</h2></div><strong>${estimatedTotal.toFixed(1)} / 50</strong></div><p class="section-note">按当前掌握度折算，仅用于安排复习优先级，并非真实考试预测。</p><div class="estimate-list">${estimates.map((item) => `<div><span>${item.title}</span><div class="mini-track"><i style="width:${item.masteryPercent}%"></i></div><strong>${item.estimatedMarks}/${item.maxMarks}</strong></div>`).join('')}</div></section>
    </div>

    <footer class="recent-session">${icon('history')}<span>最近学习：${state.lastSession ? `${state.lastSession.action} · ${formatDate(state.lastSession.at)}` : '暂无记录，完成第一道题后会显示在这里。'}</span></footer>
  </section>`;
}
