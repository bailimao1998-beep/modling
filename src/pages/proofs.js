import { icon, refreshIcons } from '../components/icon.js';
import { formulaBlock } from '../components/formula.js';
import { laplacianPsdProof } from '../data/proofs.js';
import { checkProofBlanks, checkProofOrder } from '../services/proofTraining.js';
import { mutateState } from '../services/storage.js';

function stepCard(step, index, total) {
  return `<article class="proof-step-card" data-proof-step="${step.id}"><span class="proof-step-number">${index + 1}</span><p>${step.text}</p><div class="proof-move-controls"><button class="icon-button" type="button" data-proof-move="up" aria-label="向上移动此步骤" ${index === 0 ? 'disabled' : ''}>${icon('chevron-up')}</button><button class="icon-button" type="button" data-proof-move="down" aria-label="向下移动此步骤" ${index === total - 1 ? 'disabled' : ''}>${icon('chevron-down')}</button></div></article>`;
}

function practiceStepMarkup() {
  const proof = laplacianPsdProof;
  const practiceSteps = proof.practiceOrder.map((id) => proof.steps.find((step) => step.id === id));
  return practiceSteps.map((step, index) => stepCard(step, index, practiceSteps.length)).join('');
}

function copyText() {
  return [...laplacianPsdProof.completeTemplate, '', '考试版 5 行写法：', ...laplacianPsdProof.examVersion].join('\n');
}

async function copyProofText(text) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(text);
    return;
  } catch (error) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    if (!copied) throw error;
  }
}

export function renderProofs() {
  const proof = laplacianPsdProof;
  return `<section class="page proofs-page">
    <div class="page-heading"><div><span class="eyebrow">Proof Trainer beta</span><h1>图拉普拉斯证明训练器</h1><p>先整理论证顺序，再补齐关键表达。这里检查结构，不评价自由文本风格。</p></div></div>
    <section class="proof-target"><span>${icon('target')}</span><div><h2>证明目标</h2><p>${proof.target}</p>${formulaBlock(['L_{sym}=I-D^{-1/2}AD^{-1/2}'])}</div></section>
    <div class="proof-layout">
      <section class="proof-workspace"><div class="section-heading"><div><span class="eyebrow">Step 1</span><h2>排列证明步骤</h2></div><button class="secondary-button" type="button" data-proof-reset>${icon('rotate-ccw')} 恢复初始乱序</button></div><p>使用上下按钮，把七张卡片排成完整论证。</p><div class="proof-step-list" data-proof-steps>${practiceStepMarkup()}</div></section>
      <aside class="proof-blanks"><span class="eyebrow">Step 2</span><h2>关键空填空</h2><p>保留标准数学符号或英文关键词。</p><div class="proof-blank-list">${proof.blanks.map((blank) => `<label><span>${blank.label}</span><input data-proof-blank="${blank.id}" autocomplete="off" /></label>`).join('')}</div><button class="primary-button" type="button" data-submit-proof>${icon('check')} 检查证明结构</button></aside>
    </div>
    <details class="proof-template-disclosure" data-proof-template><summary>查看完整模板与考试版 5 行写法</summary><div class="proof-template"><h2>完整证明模板</h2>${proof.completeTemplate.map((line) => `<p>${line}</p>`).join('')}<h3>考试版 5 行写法</h3><ol>${proof.examVersion.map((line) => `<li>${line}</li>`).join('')}</ol><button class="secondary-button" type="button" data-copy-proof>${icon('copy')} 复制证明模板</button><span class="copy-feedback" data-copy-feedback role="status" aria-live="polite"></span></div></details>
    <div data-proof-result aria-live="polite"></div>
  </section>`;
}

function syncMoveButtons(container) {
  const cards = [...container.querySelectorAll('[data-proof-step]')];
  cards.forEach((card, index) => {
    card.querySelector('[data-proof-move="up"]').disabled = index === 0;
    card.querySelector('[data-proof-move="down"]').disabled = index === cards.length - 1;
    card.querySelector('.proof-step-number').textContent = index + 1;
  });
}

export function bindProofsPage() {
  const container = document.querySelector('[data-proof-steps]');
  const template = document.querySelector('[data-proof-template]');
  container?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-proof-move]');
    if (!button) return;
    const card = button.closest('[data-proof-step]');
    if (button.dataset.proofMove === 'up' && card.previousElementSibling) container.insertBefore(card, card.previousElementSibling);
    if (button.dataset.proofMove === 'down' && card.nextElementSibling) container.insertBefore(card.nextElementSibling, card);
    syncMoveButtons(container);
  });

  document.querySelector('[data-proof-reset]')?.addEventListener('click', () => {
    container.innerHTML = practiceStepMarkup();
    document.querySelectorAll('[data-proof-blank]').forEach((input) => {
      input.value = '';
      input.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
    });
    document.querySelector('[data-proof-result]').innerHTML = '';
    template.open = false;
    syncMoveButtons(container);
    refreshIcons(container);
  });

  document.querySelector('[data-copy-proof]')?.addEventListener('click', async () => {
    const feedback = document.querySelector('[data-copy-feedback]');
    try {
      await copyProofText(copyText());
      feedback.textContent = '已复制到剪贴板。';
    } catch (error) {
      feedback.textContent = `复制失败：${error.message}`;
    }
  });

  document.querySelector('[data-submit-proof]')?.addEventListener('click', () => {
    const expectedOrder = laplacianPsdProof.steps.map((step) => step.id);
    const actualOrder = [...container.querySelectorAll('[data-proof-step]')].map((card) => card.dataset.proofStep);
    const order = checkProofOrder(actualOrder, expectedOrder);
    const answers = Object.fromEntries(laplacianPsdProof.blanks.map((blank) => [blank.id, document.querySelector(`[data-proof-blank="${blank.id}"]`).value]));
    const blanks = checkProofBlanks(answers, laplacianPsdProof.blanks);

    container.querySelectorAll('[data-proof-step]').forEach((card) => card.classList.remove('is-wrong-order'));
    if (!order.correct) container.querySelectorAll('[data-proof-step]')[order.firstWrongIndex]?.classList.add('is-wrong-order');
    blanks.results.forEach((item) => {
      const input = document.querySelector(`[data-proof-blank="${item.id}"]`);
      input.classList.toggle('is-invalid', !item.correct);
      input.setAttribute('aria-invalid', String(!item.correct));
    });

    const expectedStep = laplacianPsdProof.steps[order.firstWrongIndex];
    const wrongBlanks = blanks.results.filter((item) => !item.correct).length;
    const target = document.querySelector('[data-proof-result]');
    const complete = order.correct && blanks.correct;
    target.innerHTML = `<section class="proof-result ${complete ? 'is-correct' : 'is-wrong'}"><div><span class="eyebrow">Result</span><h2>${complete ? '证明结构完整' : '还有结构需要修正'}</h2><p>${order.correct ? '步骤顺序正确。' : `第 ${order.firstWrongIndex + 1} 个位置应当是：“${expectedStep.text}”`}${wrongBlanks ? ` 另有 ${wrongBlanks} 个关键空未匹配。` : ''}${complete ? ' 建议在 48 小时后隐藏模板再做一次。' : ''}</p></div><div class="exam-writing-tip"><strong>考试写法提示</strong><p>${laplacianPsdProof.examTip}</p></div></section>`;
    template.open = true;
    mutateState((state) => {
      state.proofHistory ||= [];
      state.proofHistory.unshift({ proofId: laplacianPsdProof.id, correct: complete, at: new Date().toISOString() });
    });
    refreshIcons(target);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
