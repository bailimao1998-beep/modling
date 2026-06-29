import { renderRichMathText } from '../utils/richMathText.js';

export function stepAnswer(question) {
  return `
    <div class="step-list">
      ${question.steps
        .map(
          (step, index) => `
          <label class="step-item" data-step-item="${step.stepId}">
            <span class="step-index">${index + 1}</span>
            <span class="step-prompt">${renderRichMathText(step.prompt)}</span>
            <input data-step-input="${step.stepId}" type="text" inputmode="decimal" autocomplete="off" />
            <span class="step-live-feedback" data-step-feedback="${step.stepId}" aria-live="polite"></span>
          </label>`
        )
        .join('')}
    </div>
  `;
}

export function readStepAnswers(root, question) {
  return Object.fromEntries(
    question.steps.map((step) => [step.stepId, root.querySelector(`[data-step-input="${step.stepId}"]`)?.value])
  );
}
