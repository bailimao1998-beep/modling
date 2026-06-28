import katex from 'katex';
import 'katex/dist/katex.min.css';

export function mathHtml(tex, displayMode = false) {
  return katex.renderToString(tex, {
    throwOnError: false,
    displayMode
  });
}

export function formulaBlock(formulas = []) {
  return formulas
    .map((formula) => `<div class="formula-block">${mathHtml(formula, true)}</div>`)
    .join('');
}
