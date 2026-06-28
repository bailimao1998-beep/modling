import Chart from 'chart.js/auto';
import { loadState, mutateState } from '../services/storage.js';
import { formatDate, todayISO } from '../utils/format.js';
import { getNextReviewDate } from '../services/spacedReview.js';
import { getErrorSummary } from '../services/analytics.js';
import { getTopicTitle } from '../data/topics.js';
import { icon, refreshIcons } from '../components/icon.js';

let mistakeChart = null;

function topEntry(values) {
  return Object.entries(values).sort((a, b) => b[1] - a[1])[0] || null;
}

function mistakeCard(mistake) {
  return `<article class="mistake-card ${mistake.understoodAt ? 'is-understood' : ''}" data-mistake-id="${mistake.id}">
    <div class="question-meta"><span>${mistake.module === 'matrix' ? '数学基础' : '马尔可夫链'}</span><span class="danger-tag">${mistake.errorType}</span>${mistake.understoodAt ? '<span>已理解</span>' : ''}</div>
    <div class="mistake-heading"><div><h3>${mistake.title}</h3><p>${getTopicTitle(mistake.topic)}</p></div><span class="review-date">${icon('calendar-clock')} ${mistake.nextReviewDate}</span></div>
    <div class="mistake-summary"><div><span>错误步骤</span><strong>${mistake.wrongStep}</strong></div><div><span>正确思路</span><p>${mistake.correctThinking || '回到题目定义和对应步骤重新推导。'}</p></div></div>
    <details class="mistake-detail"><summary>展开作答详情</summary><div class="answer-compare"><div><span>当时答案</span><code>${JSON.stringify(mistake.userAnswer)}</code></div><div><span>参考答案</span><code>${JSON.stringify(mistake.correctAnswer)}</code></div><div><span>记录时间</span><strong>${formatDate(mistake.errorTime)}</strong></div><div><span>已复习</span><strong>${mistake.reviewCount} 次</strong></div></div></details>
    <div class="card-actions"><a class="primary-button" href="#/practice?module=${mistake.module}&question=${mistake.questionId}">${icon('rotate-ccw')} 重做这道题</a><button class="secondary-button" data-review-mistake type="button">${icon('calendar-plus')} 记录一次复习</button><button class="ghost-button" data-understand-mistake type="button" ${mistake.understoodAt ? 'disabled' : ''}>${icon('check-circle-2')} ${mistake.understoodAt ? '已标记理解' : '我已经理解'}</button></div>
  </article>`;
}

export function renderMistakes() {
  const state = loadState();
  const summary = getErrorSummary(state, todayISO());
  const frequent = topEntry(summary.byTopic);
  const topError = topEntry(summary.byType);
  return `<section class="page mistakes-page">
    <div class="page-heading"><div><span class="eyebrow">Mistake Review</span><h1>错题本</h1><p>按错误原因复习，比只看正确答案更容易形成稳定步骤。</p></div><a class="primary-button" href="#/practice?reviewStatus=wrong-before">${icon('play')} 开始错题训练</a></div>
    <div class="mistake-overview"><article><span>当前错题</span><strong>${state.mistakes.length}</strong><small>${state.mistakes.filter((item) => item.understoodAt).length} 道已标记理解</small></article><article><span>今日应复习</span><strong>${summary.due.length}</strong><small>${summary.due.length ? '优先处理到期内容' : '今天没有到期错题'}</small></article><article><span>高频错误知识点</span><strong class="text-stat">${frequent ? getTopicTitle(frequent[0]) : '暂无'}</strong><small>${frequent ? `${frequent[1]} 次记录` : '继续练习后生成'}</small></article></div>
    <div class="mistake-dashboard"><article class="chart-card"><div class="chart-heading"><div><h2>错误类型统计</h2><p>${topError ? `当前最多：${topError[0]}` : '产生错题后显示分布。'}</p></div></div><div class="chart-frame small"><canvas data-mistake-chart aria-label="错误类型统计图"></canvas></div></article><article class="due-panel"><span class="eyebrow">Review Queue</span><h2>今日应复习错题</h2>${summary.due.length ? `<div class="due-list">${summary.due.slice(0, 4).map((item) => `<a href="#mistake-${item.id}"><span>${icon('alert-circle')}</span><div><strong>${item.title}</strong><small>${item.errorType}</small></div></a>`).join('')}</div>` : `<div class="empty-state compact"><span>${icon('calendar-check')}</span><p>复习队列已清空，可以做一道新题。</p></div>`}</article></div>
    <section class="section-block"><div class="section-heading"><div><span class="eyebrow">All Mistakes</span><h2>全部错题记录</h2></div><span class="count-badge">${state.mistakes.length}</span></div>${state.mistakes.length ? `<div class="mistake-list">${state.mistakes.map(mistakeCard).join('')}</div>` : `<div class="empty-state"><span>${icon('notebook-tabs')}</span><h2>还没有错题</h2><p>做题出错后，这里会保存答案、错误步骤、错误类型和复习日期。</p><a class="secondary-button" href="#/practice">去做练习</a></div>`}</section>
  </section>`;
}

function rerender() {
  const view = document.querySelector('#route-view');
  if (!view) return;
  view.innerHTML = renderMistakes();
  bindMistakesPage();
  refreshIcons(view);
}

export function bindMistakesPage() {
  mistakeChart?.destroy();
  const summary = getErrorSummary(loadState(), todayISO());
  const labels = Object.keys(summary.byType);
  const canvas = document.querySelector('[data-mistake-chart]');
  if (canvas) mistakeChart = new Chart(canvas, { type: 'doughnut', data: { labels: labels.length ? labels : ['暂无错题'], datasets: [{ data: labels.length ? Object.values(summary.byType) : [1], backgroundColor: labels.length ? ['#b65c5c','#a77d45','#526b55','#68708a','#765b78','#2f6672','#8a6744','#7b8589'] : ['#e7ebe9'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { position: 'right', labels: { boxWidth: 10 } } } } });

  document.querySelectorAll('[data-review-mistake]').forEach((button) => button.addEventListener('click', () => {
    const id = button.closest('[data-mistake-id]')?.dataset.mistakeId;
    mutateState((state) => {
      const mistake = state.mistakes.find((item) => item.id === id);
      if (mistake) { mistake.reviewCount += 1; mistake.nextReviewDate = getNextReviewDate(todayISO(), mistake.reviewCount, true); }
    });
    rerender();
  }));

  document.querySelectorAll('[data-understand-mistake]').forEach((button) => button.addEventListener('click', () => {
    const id = button.closest('[data-mistake-id]')?.dataset.mistakeId;
    mutateState((state) => {
      const mistake = state.mistakes.find((item) => item.id === id);
      if (mistake) { mistake.understoodAt = new Date().toISOString(); state.understoodMistakes = [...new Set([...(state.understoodMistakes || []), mistake.questionId])]; delete state.reviewSchedule[mistake.questionId]; }
    });
    rerender();
  }));
}
