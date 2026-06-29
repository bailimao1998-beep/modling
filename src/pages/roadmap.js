import { beginnerLearningPath, examRoadmap } from '../data/roadmap.js';
import { loadState } from '../services/storage.js';
import { generateTodayTasks } from '../services/studyPlan.js';
import { studyTaskList } from '../components/studyTaskList.js';
import { icon } from '../components/icon.js';

export function renderRoadmap() {
  const tasks = generateTodayTasks(loadState());
  return `<section class="page roadmap-page">
    <div class="page-heading"><div><span class="eyebrow">Exam Roadmap</span><h1>考前复习路线</h1><p>先保底、再补步骤分、最后整卷复盘。路线按得分策略组织，不要求一次学完。</p></div><a class="primary-button" href="#/exam?mode=full-beta">${icon('timer')} 进入 50 分 beta</a></div>
    <section class="roadmap-tasks"><div class="section-heading"><div><span class="eyebrow">Today</span><h2>今日复习任务</h2></div><span class="count-badge">${tasks.length}</span></div>${studyTaskList(tasks)}</section>
    <section class="section-block"><div class="section-heading"><div><span class="eyebrow">Beginner Path</span><h2>小白学习路线</h2></div><a href="#/coverage">查看知识覆盖 ${icon('arrow-right')}</a></div><div class="question-list">${beginnerLearningPath.map((step) => `<article class="question-card"><div class="question-meta"><span>第 ${step.number} 步</span><span>${step.module}</span></div><h3>${step.title}</h3><p>${step.reason}</p><a class="secondary-button" href="${step.href}">开始这一站 ${icon('arrow-right')}</a></article>`).join('')}</div></section>
    <section class="roadmap-stages" aria-label="四阶段考前路线">${examRoadmap.map((stage) => `<article class="roadmap-stage"><div class="roadmap-stage-number">${String(stage.number).padStart(2, '0')}</div><div class="roadmap-stage-content"><span class="eyebrow">${stage.target}</span><h2>${stage.title}</h2><p>${stage.description}</p><ul>${stage.topics.map((topic) => `<li>${icon('check')} ${topic}</li>`).join('')}</ul><div class="card-actions">${stage.actions.map((action) => `<a class="secondary-button" href="${action.href}">${action.label} ${icon('arrow-right')}</a>`).join('')}</div></div></article>`).join('')}</section>
  </section>`;
}
