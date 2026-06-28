import { modules } from '../data/modules.js';
import { loadState } from '../services/storage.js';
import { knowledgeMap } from '../components/knowledgeMap.js';
import { getModuleMasteryPercent } from '../services/analytics.js';
import { progressBar } from '../components/progressBar.js';
import { icon } from '../components/icon.js';

function selectedModule() {
  const params = new URLSearchParams(location.hash.split('?')[1] || '');
  return params.get('module') || 'matrix';
}

export function renderCourses() {
  const state = loadState();
  const selected = modules.find((module) => module.id === selectedModule()) || modules[0];
  const mastery = getModuleMasteryPercent(state, selected);
  return `<section class="page courses-page">
    <div class="page-heading"><div><span class="eyebrow">Course Map</span><h1>课程与知识地图</h1><p>先看结构，再选择今天要推进的一小步。</p></div></div>
    <div class="course-tabs" role="navigation" aria-label="模块目录">
      ${modules.map((module) => `<a class="${module.id === selected.id ? 'is-active' : ''}" href="#/courses?module=${module.id}">${module.title}</a>`).join('')}
    </div>
    <section class="course-overview">
      <div><span class="status-label">${selected.status === 'open' ? '可学习' : '目录已开放'}</span><h2>${selected.title}</h2><p>${selected.subtitle}</p></div>
      <div class="course-progress">${progressBar(mastery, '模块掌握度')}</div>
      <div class="card-actions">
        ${selected.status === 'open' ? `<a class="primary-button" href="#/lesson?module=${selected.id}">${icon('play')} 开始课程</a><a class="secondary-button" href="#/practice?module=${selected.id}">${icon('list-checks')} 练习</a>` : `<a class="secondary-button" href="#/labs">${icon('flask-conical')} 查看实验预告</a>`}
      </div>
    </section>
    <section class="section-block"><div class="section-heading"><div><span class="eyebrow">Learning Path</span><h2>${selected.title}学习路径</h2></div><p>${selected.status === 'open' ? '掌握度来自做题证据，不由浏览页面直接决定。' : '当前提供考试范围目录和简短介绍，互动内容将在后续阶段开放。'}</p></div>${knowledgeMap(selected.id, state)}</section>
  </section>`;
}

export function bindCoursesPage() {}
