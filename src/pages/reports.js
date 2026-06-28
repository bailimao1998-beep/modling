import Chart from 'chart.js/auto';
import { modules } from '../data/modules.js';
import { loadState } from '../services/storage.js';
import { getErrorSummary, getModuleMasteryPercent, getSevenDayActivity, getWeakestModule } from '../services/analytics.js';
import { todayISO } from '../utils/format.js';
import { icon } from '../components/icon.js';

let reportCharts = [];

export function cleanupReportsPage() {
  reportCharts.forEach((chart) => chart.destroy());
  reportCharts = [];
}

export function renderReports() {
  const state = loadState();
  const errorSummary = getErrorSummary(state, todayISO());
  const weak = getWeakestModule(state, modules);
  const attempts = Object.values(state.attempts || {}).flat().length;
  const activeDays = new Set(Object.values(state.attempts || {}).flat().map((item) => item.at?.slice(0, 10))).size;
  return `<section class="page reports-page">
    <div class="page-heading"><div><span class="eyebrow">Learning Report</span><h1>学习报告</h1><p>把练习证据整理成下一步行动，不把数字当作评价。</p></div><a class="primary-button" href="#/practice">${icon('play')} 继续练习</a></div>
    <div class="report-summary"><article><span>累计作答</span><strong>${attempts}</strong><small>包含重复练习</small></article><article><span>活跃学习日</span><strong>${activeDays}</strong><small>有作答记录的日期</small></article><article><span>待处理错题</span><strong>${state.mistakes.length}</strong><small>${errorSummary.due.length} 项已到期</small></article></div>
    <div class="report-grid">
      <article class="chart-card chart-wide"><div class="chart-heading"><div><h2>模块掌握度</h2><p>每个模块按全部目录知识点计算。</p></div></div><div class="chart-frame"><canvas data-mastery-chart aria-label="五大模块掌握度柱状图"></canvas></div></article>
      <article class="chart-card"><div class="chart-heading"><div><h2>近 7 天练习</h2><p>每天提交答案的次数。</p></div></div><div class="chart-frame"><canvas data-activity-chart aria-label="近七天练习数量图"></canvas></div></article>
      <article class="chart-card"><div class="chart-heading"><div><h2>错误类型分布</h2><p>用于识别最常出现的错误模式。</p></div></div><div class="chart-frame"><canvas data-error-chart aria-label="错误类型分布图"></canvas></div></article>
    </div>
    <section class="recommendation-panel"><span class="recommendation-icon">${icon('compass')}</span><div><span class="eyebrow">Next Step</span><h2>下一步学习建议</h2><p>${weak ? `当前证据中，${weak.title} 的掌握度最低。先完成该模块最基础的一节课程或一道 easy 题，再回到到期错题。` : '从矩阵基础课程开始，完成互动演示后做一道 easy 题。'}</p></div><a class="secondary-button" href="${weak?.route || '#/lesson?module=matrix'}">前往学习 ${icon('arrow-right')}</a></section>
  </section>`;
}

export function bindReportsPage() {
  cleanupReportsPage();
  const state = loadState();
  const activity = getSevenDayActivity(state, todayISO());
  const errors = getErrorSummary(state, todayISO()).byType;
  const baseOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };

  const masteryCanvas = document.querySelector('[data-mastery-chart]');
  if (masteryCanvas) reportCharts.push(new Chart(masteryCanvas, {
    type: 'bar',
    data: { labels: modules.map((module) => module.title), datasets: [{ data: modules.map((module) => getModuleMasteryPercent(state, module)), backgroundColor: modules.map((module) => module.color), borderRadius: 4 }] },
    options: { ...baseOptions, indexAxis: 'y', scales: { x: { min: 0, max: 100, ticks: { callback: (value) => `${value}%` } }, y: { grid: { display: false } } } }
  }));

  const activityCanvas = document.querySelector('[data-activity-chart]');
  if (activityCanvas) reportCharts.push(new Chart(activityCanvas, {
    type: 'line',
    data: { labels: activity.map((item) => item.date.slice(5)), datasets: [{ label: '作答次数', data: activity.map((item) => item.count), borderColor: '#2f6672', backgroundColor: 'rgba(47,102,114,.12)', fill: true, tension: 0.25, pointRadius: 3 }] },
    options: { ...baseOptions, scales: { y: { beginAtZero: true, ticks: { precision: 0 } }, x: { grid: { display: false } } } }
  }));

  const errorCanvas = document.querySelector('[data-error-chart]');
  if (errorCanvas) {
    const labels = Object.keys(errors);
    reportCharts.push(new Chart(errorCanvas, {
      type: 'doughnut',
      data: { labels: labels.length ? labels : ['暂无错题'], datasets: [{ data: labels.length ? Object.values(errors) : [1], backgroundColor: labels.length ? ['#b65c5c','#a77d45','#526b55','#68708a','#765b78','#2f6672','#8a6744','#7b8589'] : ['#e7ebe9'], borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '66%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10 } } } }
    }));
  }
}
