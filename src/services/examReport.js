const BETA_SECTIONS = [
  { id: 'beta-matrix', label: '第 1 题 递推关系', maxScore: 10 },
  { id: 'beta-graph', label: '第 2 题 图论计算', maxScore: 10 },
  { id: 'beta-laplacian', label: '第 3 题 图拉普拉斯证明 beta', maxScore: 10 },
  { id: 'beta-probability', label: '第 4 题 概率密度', maxScore: 8 },
  { id: 'beta-markov', label: '第 5 题 马尔可夫链', maxScore: 12 }
];

const REPORT_MODULES = ['recurrence', 'graph', 'probability', 'markov'];

export function summarizeModuleScores(results) {
  const summary = Object.fromEntries(REPORT_MODULES.map((moduleId) => [moduleId, { score: 0, maxScore: 0 }]));
  results.forEach(({ question, result }) => {
    if (!summary[question.module]) return;
    summary[question.module].score += result.score || 0;
    summary[question.module].maxScore += result.maxScore ?? question.marks ?? 0;
  });
  return summary;
}

export function summarizeErrorTypes(results) {
  return results.reduce((summary, { result }) => {
    if (result.errorType && result.score < result.maxScore) summary[result.errorType] = (summary[result.errorType] || 0) + 1;
    return summary;
  }, {});
}

function recommendation(label, text, href) {
  return { label, text, href };
}

export function buildBetaExamReport(results) {
  const byQuestion = Object.fromEntries(results.map((item) => [item.question.id, item]));
  const sections = BETA_SECTIONS.map((section) => ({
    ...section,
    score: byQuestion[section.id]?.result.score || 0
  }));
  const sectionScore = Object.fromEntries(sections.map((section) => [section.id, section.score]));
  const recommendations = [];
  if (sectionScore['beta-matrix'] < 6) recommendations.push(recommendation('递推关系', '回到动态系统课程，并重做 r-q10。', '#/lesson?module=recurrence'));
  if (sectionScore['beta-graph'] < 6) recommendations.push(recommendation('图论计算', '使用图论实验室复习 walks 与生成树，再做 g-q5、g-q8。', '#/labs'));
  if (sectionScore['beta-laplacian'] < 6) recommendations.push(recommendation('证明结构', '进入证明训练器，练习图拉普拉斯半正定证明的论证顺序。', '#/proofs'));
  if (sectionScore['beta-probability'] < 5) recommendations.push(recommendation('概率密度', '使用概率密度实验室复习分段积分，再做 p-q8。', '#/labs'));
  if (sectionScore['beta-markov'] < 8) recommendations.push(recommendation('马尔可夫链', '使用天气模拟器检查行向量方向，再做 mk-q7。', '#/labs'));
  if (!recommendations.length) recommendations.push(recommendation('间隔巩固', '各部分已达到本卷建议线，48 小时后再做一次限时复习。', '#/mistakes'));

  return {
    sections,
    moduleScores: summarizeModuleScores(results),
    errorTypes: summarizeErrorTypes(results),
    recommendations
  };
}
