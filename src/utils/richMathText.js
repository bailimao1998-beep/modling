import katex from 'katex';

const matrixPattern = /\[\s*(?:\[\s*[^\[\]]+\s*\]\s*,?\s*)+\]/g;
const vectorPattern = /\[\s*([^\[\]\n]+?,[^\[\]\n]+?)\s*\](\s*\^T)?/g;
const mathCellPattern = /^[0-9A-Za-zρλπτ_{}()[\]+\-*/^.=,≤≥×₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹\s]+$/u;
const subscriptDigits = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
const superscriptDigits = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function digitString(value, map) {
  return [...value].map((digit) => map[digit]).join('');
}

function normalizeTex(value) {
  let tex = String(value).trim();
  tex = tex.replace(/([xy])([₀₁₂₃₄₅₆₇₈₉]+)/gu, (_, symbol, digits) => `${symbol}_{${digitString(digits, subscriptDigits)}}`);
  tex = tex.replace(/ρ([₀₁₂₃₄₅₆₇₈₉]+)/gu, (_, digits) => `\\rho_{${digitString(digits, subscriptDigits)}}`);
  tex = tex.replace(/ρ([0-9]+)/gu, '\\rho_{$1}');
  tex = tex.replace(/ρ/gu, '\\rho');
  tex = tex.replace(/λ/gu, '\\lambda');
  tex = tex.replace(/τ/gu, '\\tau');
  tex = tex.replace(/π/gu, '\\pi');
  tex = tex.replace(/\bdet(?=\()/g, '\\det');
  tex = tex.replace(/([ADLPx])([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/gu, (_, symbol, digits) => `${symbol}^{${digitString(digits, superscriptDigits)}}`);
  tex = tex.replaceAll('≤', '\\le ');
  tex = tex.replaceAll('≥', '\\ge ');
  tex = tex.replaceAll('×', '\\times ');
  return tex;
}

function isStandaloneMath(value) {
  const trimmed = String(value).trim();
  if (!trimmed || !mathCellPattern.test(trimmed)) return false;
  return /^[A-Z]$/.test(trimmed) || /[_^=()[\]×≤≥ρλπτ0-9]/u.test(trimmed);
}

function renderInlineMath(tex, fallback) {
  try {
    const html = katex.renderToString(tex, { throwOnError: false, displayMode: false });
    return html.includes('katex-error') ? escapeHtml(fallback) : `<span class="rich-math">${html}</span>`;
  } catch {
    return escapeHtml(fallback);
  }
}

function matrixTex(value) {
  const rows = [...value.matchAll(/\[([^\[\]]+)\]/g)].map((match) => match[1].split(',').map((cell) => cell.trim()));
  if (!rows.length || rows.some((row) => !row.length || row.length !== rows[0].length)) return null;
  if (rows.flat().some((cell) => !cell || !mathCellPattern.test(cell))) return null;
  return `\\begin{bmatrix}${rows.map((row) => row.map(normalizeTex).join('&')).join('\\\\')}\\end{bmatrix}`;
}

function vectorTex(value, transpose) {
  const cells = value.split(',').map((cell) => cell.trim());
  if (cells.length < 2 || cells.some((cell) => !cell || !mathCellPattern.test(cell))) return null;
  return `\\begin{bmatrix}${cells.map(normalizeTex).join('&')}\\end{bmatrix}${transpose ? '^{\\mathsf T}' : ''}`;
}

function expressionTex(value) {
  if (/^f\^T\s+L_sym\s+f$/u.test(value)) return 'f^{\\mathsf T} L_{\\mathrm{sym}} f';
  if (/^L_sym$/u.test(value)) return 'L_{\\mathrm{sym}}';
  if (/^f\^T$/u.test(value)) return 'f^{\\mathsf T}';
  if (/^Var\(X\)$/u.test(value)) return '\\operatorname{Var}(X)';
  if (/^E\[X(?:²|\^2)?\]$/u.test(value)) {
    return value.includes('²') || value.includes('^2') ? '\\mathbb{E}[X^2]' : '\\mathbb{E}[X]';
  }
  if (/^P\(/u.test(value)) return normalizeTex(value).replace(/^P/u, '\\mathbb{P}');
  return normalizeTex(value);
}

export function renderRichMathText(text) {
  if (text === null || text === undefined) return '';
  const tokens = [];
  const stash = (tex, fallback) => {
    const index = tokens.push(renderInlineMath(tex, fallback)) - 1;
    return `\uE000MATH${index}\uE001`;
  };

  let output = String(text).replace(matrixPattern, (value) => {
    const tex = matrixTex(value);
    return tex ? stash(tex, value) : value;
  });

  output = output.replace(vectorPattern, (value, cells, transpose) => {
    const tex = vectorTex(cells, Boolean(transpose));
    return tex ? stash(tex, value) : value;
  });

  if (!tokens.length && isStandaloneMath(output)) {
    return renderInlineMath(expressionTex(output), output);
  }

  const expressions = [
    /Var\(X\)/g,
    /E\[X(?:²|\^2)?\]/g,
    /P\([^()\n]{1,48}\)/g,
    /\bf\^T\s+L_sym\s+f\b/g,
    /\bL_sym\b/g,
    /\bf\^T\b/g,
    /\bL\s*=\s*D\s*-\s*A\b/g,
    /\b[ADLP][\^⁰¹²³⁴⁵⁶⁷⁸⁹]+[0-9]*/g,
    /[xy]_(?:\{[^{}\n]+\}|[A-Za-z0-9]+)/g,
    /[xy][₀₁₂₃₄₅₆₇₈₉]+/gu,
    /ρ(?:_(?:\{[^{}\n]+\}|[A-Za-z0-9]+)|[0-9]+|[₀₁₂₃₄₅₆₇₈₉]+)?/gu
  ];
  expressions.forEach((pattern) => {
    output = output.replace(pattern, (value) => stash(expressionTex(value), value));
  });

  let html = escapeHtml(output).replaceAll('\n', '<br />');
  tokens.forEach((token, index) => {
    html = html.replaceAll(`\uE000MATH${index}\uE001`, token);
  });
  return html;
}
