import { icon, refreshIcons } from '../components/icon.js';
import { createDefaultState, loadState, saveState, STORAGE_KEY } from '../services/storage.js';
import {
  createStudyBackup,
  getStudyDataSummary,
  mergeImportedStudyData,
  studyBackupFilename,
  validateStudyBackup
} from '../services/dataManagement.js';

function formatTimestamp(value) {
  if (!value) return '暂无学习记录';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '暂无学习记录' : date.toLocaleString('zh-CN', { dateStyle: 'medium', timeStyle: 'short' });
}

function summaryMarkup(summary) {
  return `<article><span>累计作答</span><strong data-data-attempts>${summary.attempts}</strong><small>包含重复练习</small></article>
    <article><span>当前错题</span><strong data-data-mistakes>${summary.mistakes}</strong><small>仍保留在错题本</small></article>
    <article><span>考试记录</span><strong data-data-exams>${summary.exams}</strong><small>已提交模拟考试</small></article>`;
}

export function renderSettings() {
  const summary = getStudyDataSummary(loadState(), STORAGE_KEY);
  return `<section class="page settings-page">
    <div class="page-heading"><div><span class="eyebrow">Local Data</span><h1>学习数据管理</h1><p>备份只在你的浏览器中生成和读取，不会上传到服务器。</p></div></div>
    <div class="report-summary" data-data-summary>${summaryMarkup(summary)}</div>
    <section class="data-management-grid">
      <article class="data-action-card"><span class="data-action-icon">${icon('download')}</span><div><h2>导出学习数据</h2><p>下载包含进度、作答、错题、复习计划和考试记录的 JSON 备份。</p></div><button class="primary-button" type="button" data-export-study>${icon('download')} 导出 JSON</button></article>
      <article class="data-action-card"><span class="data-action-icon">${icon('upload')}</span><div><h2>导入学习数据</h2><p>选择本项目生成的 JSON。导入前会校验结构并要求确认。</p><input type="file" accept="application/json,.json" data-import-file aria-label="选择学习数据 JSON 文件" /></div><button class="secondary-button" type="button" data-import-study disabled>${icon('upload')} 导入所选文件</button></article>
      <article class="data-action-card danger-zone"><span class="data-action-icon">${icon('trash-2')}</span><div><h2>重置学习数据</h2><p>只删除当前项目的学习记录，不会影响浏览器中其他网站的数据。</p></div><button class="secondary-button danger-button" type="button" data-reset-study>${icon('trash-2')} 重置本项目数据</button></article>
    </section>
    <section class="storage-detail" aria-label="本地存储详情"><div><span>localStorage key</span><code>${summary.storageKey}</code></div><div><span>最近更新时间</span><strong data-data-updated>${formatTimestamp(summary.lastUpdatedAt)}</strong></div></section>
    <div class="data-feedback" data-data-feedback role="status" aria-live="polite"></div>
  </section>`;
}

export function bindSettingsPage() {
  const feedback = document.querySelector('[data-data-feedback]');
  const fileInput = document.querySelector('[data-import-file]');
  const importButton = document.querySelector('[data-import-study]');

  function showFeedback(message, type = 'success') {
    if (!feedback) return;
    feedback.className = `data-feedback is-${type}`;
    feedback.textContent = message;
  }

  function syncSummary() {
    const summary = getStudyDataSummary(loadState(), STORAGE_KEY);
    document.querySelector('[data-data-attempts]').textContent = summary.attempts;
    document.querySelector('[data-data-mistakes]').textContent = summary.mistakes;
    document.querySelector('[data-data-exams]').textContent = summary.exams;
    document.querySelector('[data-data-updated]').textContent = formatTimestamp(summary.lastUpdatedAt);
  }

  document.querySelector('[data-export-study]')?.addEventListener('click', () => {
    try {
      const backup = createStudyBackup(loadState());
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = studyBackupFilename(new Date(backup.exportedAt));
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showFeedback(`已生成 ${link.download}。`);
    } catch (error) {
      showFeedback(`导出失败：${error.message}`, 'error');
    }
  });

  fileInput?.addEventListener('change', () => {
    importButton.disabled = !fileInput.files?.length;
    showFeedback(fileInput.files?.[0] ? `已选择 ${fileInput.files[0].name}，等待导入确认。` : '', 'neutral');
  });

  importButton?.addEventListener('click', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text());
      const validation = validateStudyBackup(payload);
      if (!validation.valid) throw new Error(validation.errors.join(' '));
      if (!confirm('导入将覆盖当前学习数据，确定继续吗？')) return;
      saveState(mergeImportedStudyData(payload, createDefaultState()));
      window.dispatchEvent(new CustomEvent('study-state-change'));
      syncSummary();
      showFeedback('导入完成，数据概况已更新。');
      fileInput.value = '';
      importButton.disabled = true;
    } catch (error) {
      showFeedback(`导入失败：${error.message}`, 'error');
    }
  });

  document.querySelector('[data-reset-study]')?.addEventListener('click', () => {
    if (!confirm('确定重置本项目的全部学习数据吗？')) return;
    if (!confirm('此操作无法撤销。请再次确认重置。')) return;
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('study-state-change'));
    syncSummary();
    showFeedback('学习数据已重置，本项目已恢复为空白状态。');
  });

  refreshIcons(document);
}
