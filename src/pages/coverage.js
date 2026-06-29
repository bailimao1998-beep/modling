import { coverageMap, getCoverageSummary } from '../data/coverageMap.js';
import { modules } from '../data/modules.js';
import { loadState } from '../services/storage.js';
import { masteryLabels } from '../services/progress.js';
import { progressBar } from '../components/progressBar.js';
import { icon } from '../components/icon.js';

const statusLabels = { covered: '已覆盖', partial: '部分覆盖', missing: '缺口' };
const statusReasons = {
  covered: '已有课程、练习或真题入口，可以形成学习证据。',
  partial: '已有部分入口，但还缺独立练习、完整证明或更细分题型。',
  missing: '当前版本还没有完整课程或题目，只记录为后续补齐项。'
};

function topicEvidence(state, item) {
  const topic = state.progress?.topics?.[item.topic] || {};
  return {
    mastery: Number(topic.masteryLevel ?? topic.mastery ?? 0),
    lessonSeen: Boolean(topic.lessonSeen),
    guided: Number(topic.guidedCorrectCount || 0),
    independent: Number(topic.independentCorrectCount || 0),
    exam: Number(topic.examCorrectCount || 0),
    wrong: Number(topic.recentWrongCount || 0)
  };
}

function entryButtons(item) {
  const links = [];
  if (item.lessonRoute) links.push({ href: item.lessonRoute, label: '课程入口' });
  if (item.guidedQuestionIds?.[0]) links.push({ href: `#/practice?module=${item.module}&question=${item.guidedQuestionIds[0]}`, label: '引导题' });
  if (item.independentQuestionIds?.[0]) links.push({ href: `#/practice?module=${item.module}&question=${item.independentQuestionIds[0]}`, label: '独立题' });
  if (item.examQuestionIds?.[0]) links.push({ href: `#/practice?module=${item.module}&question=${item.examQuestionIds[0]}`, label: '真题题型' });
  if (item.proofIds?.[0]) links.push({ href: '#/proofs', label: '证明训练' });
  return `<div class="card-actions">${links.map((link) => `<a class="secondary-button" href="${link.href}">${link.label} ${icon('arrow-right')}</a>`).join('')}</div>`;
}

function coverageCard(item, state) {
  const evidence = topicEvidence(state, item);
  return `<article class="question-card coverage-item" data-coverage-id="${item.id}">
    <div class="question-meta"><span>${item.source}</span><span>${item.sourceType}</span><span>${item.importance}</span><span class="${item.status === 'missing' ? 'danger-tag' : item.status === 'partial' ? 'status-label' : 'success-tag'}">${statusLabels[item.status]}</span></div>
    <h3>${item.title}</h3>
    <p><strong>为什么这样算覆盖：</strong>${statusReasons[item.status]}</p>
    <p><strong>小白解释：</strong>${item.beginnerNote}</p>
    <p><strong>考试关联：</strong>${item.examNote}</p>
    <div class="module-evidence">
      <span>掌握证据</span><strong>${masteryLabels[evidence.mastery] || masteryLabels[0]}</strong>
      <small>看课 ${evidence.lessonSeen ? '已记录' : '未记录'} · 引导题 ${evidence.guided} · 独立题 ${evidence.independent} · 考试题 ${evidence.exam} · 最近错误 ${evidence.wrong}</small>
    </div>
    ${entryButtons(item)}
  </article>`;
}

export function renderCoverage() {
  const state = loadState();
  const summary = getCoverageSummary();
  const problemItems = coverageMap.filter((item) => item.status !== 'covered');
  return `<section class="page coverage-page">
    <div class="page-heading"><div><span class="eyebrow">Coverage Map</span><h1>知识点覆盖地图</h1><p>这里回答“知识点是否齐全、哪些还没学、哪些只是看过但没掌握”。覆盖状态来自课程/题目/真题入口，掌握状态来自你的本地学习证据。</p></div><a class="primary-button" href="#/roadmap">${icon('map')} 小白学习路线</a></div>

    <div class="stats-grid">
      <article class="stat-card stat-primary"><span>总覆盖率</span><strong>${summary.coveragePercent}%</strong><small>${summary.covered}/${summary.total} 个知识点已覆盖</small></article>
      <article class="stat-card"><span>High 覆盖率</span><strong>${summary.highCoveragePercent}%</strong><small>${summary.highCovered}/${summary.highTotal} 个高优先级已覆盖</small></article>
      <article class="stat-card"><span>Partial</span><strong>${summary.partial}</strong><small>已有入口但证据链不完整</small></article>
      <article class="stat-card"><span>Missing</span><strong>${summary.missing}</strong><small>后续需要补课程或题</small></article>
    </div>

    <section class="section-block"><div class="section-heading"><div><span class="eyebrow">By Module</span><h2>每个模块覆盖情况</h2></div></div><div class="module-grid">${modules.filter((module) => summary.byModule[module.id]).map((module) => {
      const data = summary.byModule[module.id];
      const percent = data.total ? Math.round((data.covered / data.total) * 100) : 0;
      return `<article class="module-card"><div class="module-card-heading"><span class="module-dot" style="--module-color:${module.color}"></span><div><h3>${module.title}</h3><p>${data.covered} covered · ${data.partial} partial · ${data.missing} missing</p></div></div>${progressBar(percent, '')}<a class="secondary-button" href="${module.route}">进入模块 ${icon('arrow-right')}</a></article>`;
    }).join('')}</div></section>

    <section class="section-block"><div class="section-heading"><div><span class="eyebrow">Gaps</span><h2>Missing / Partial 知识点</h2></div><span class="count-badge">${problemItems.length}</span></div>
      <div class="question-list">${problemItems.map((item) => coverageCard(item, state)).join('')}</div>
    </section>

    <section class="section-block"><div class="section-heading"><div><span class="eyebrow">All Evidence</span><h2>全部知识点与掌握证据</h2></div></div>
      <div class="question-list">${coverageMap.map((item) => coverageCard(item, state)).join('')}</div>
    </section>
  </section>`;
}
