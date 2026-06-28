import { questions } from '../data/questions.js';
import { modules } from '../data/modules.js';
import { errorTypes } from '../data/errorTypes.js';
import { loadState } from '../services/storage.js';
import { filterQuestions } from '../services/practiceFilters.js';
import { questionCard, bindQuestionCard } from '../components/questionCard.js';
import { refreshIcons, icon } from '../components/icon.js';

function routeFilters() {
  const params = new URLSearchParams(location.hash.split('?')[1] || '');
  return {
    module: params.get('module') || 'all',
    difficulty: params.get('difficulty') || 'all',
    errorType: params.get('errorType') || 'all',
    reviewStatus: params.get('reviewStatus') || 'all',
    question: params.get('question')
  };
}

export function renderPractice() {
  const initial = routeFilters();
  return `<section class="page practice-page">
    <div class="page-heading"><div><span class="eyebrow">Focused Practice</span><h1>专项练习</h1><p>先筛出今天需要的题，再逐步作答。错误不会直接展开完整答案。</p></div><a class="secondary-button" href="#/mistakes">${icon('notebook-tabs')} 打开错题本</a></div>
    <section class="filter-bar" aria-label="练习筛选">
      <label><span>模块</span><select data-filter="module"><option value="all">全部开放模块</option>${modules.filter((module) => module.status === 'open').map((module) => `<option value="${module.id}" ${initial.module === module.id ? 'selected' : ''}>${module.title}</option>`).join('')}</select></label>
      <label><span>难度</span><select data-filter="difficulty"><option value="all">全部难度</option><option value="easy" ${initial.difficulty === 'easy' ? 'selected' : ''}>基础</option><option value="medium" ${initial.difficulty === 'medium' ? 'selected' : ''}>进阶</option><option value="exam" ${initial.difficulty === 'exam' ? 'selected' : ''}>考试</option></select></label>
      <label><span>错误类型</span><select data-filter="errorType"><option value="all">全部类型</option>${errorTypes.map((type) => `<option value="${type.id}" ${initial.errorType === type.id ? 'selected' : ''}>${type.label}</option>`).join('')}</select></label>
      <label><span>练习记录</span><select data-filter="reviewStatus"><option value="all">全部题目</option><option value="not-reviewed" ${initial.reviewStatus === 'not-reviewed' ? 'selected' : ''}>未练习过</option><option value="reviewed" ${initial.reviewStatus === 'reviewed' ? 'selected' : ''}>已练习过</option><option value="wrong-before" ${initial.reviewStatus === 'wrong-before' ? 'selected' : ''}>曾经做错</option></select></label>
      <div class="filter-count"><strong data-question-count>0</strong><span>道题</span></div>
    </section>
    <div class="question-list" data-question-list><div class="loading-state">正在整理练习题…</div></div>
  </section>`;
}

export function bindPracticePage() {
  const state = loadState();
  const initial = routeFilters();
  const list = document.querySelector('[data-question-list]');
  const filters = Object.fromEntries([...document.querySelectorAll('[data-filter]')].map((select) => [select.dataset.filter, select.value]));

  function renderList() {
    const filtered = filterQuestions(questions, state, filters);
    document.querySelector('[data-question-count]').textContent = filtered.length;
    list.innerHTML = filtered.length ? filtered.map((question) => questionCard(question, { wasWrong: state.mistakes.some((mistake) => mistake.questionId === question.id) })).join('') : `<div class="empty-state"><span>${icon('search-x')}</span><h2>没有符合条件的题目</h2><p>减少一个筛选条件，或选择“全部题目”。</p></div>`;
    filtered.forEach((question) => {
      const root = list.querySelector(`[data-question-id="${question.id}"]`);
      if (root) bindQuestionCard(root, question);
    });
    refreshIcons(list);
    if (initial.question) {
      const target = list.querySelector(`[data-question-id="${initial.question}"]`);
      target?.scrollIntoView({ block: 'start' });
      target?.classList.add('is-targeted');
      initial.question = null;
    }
  }

  document.querySelectorAll('[data-filter]').forEach((select) => select.addEventListener('change', () => {
    filters[select.dataset.filter] = select.value;
    renderList();
  }));
  renderList();
}
