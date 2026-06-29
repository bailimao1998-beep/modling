export const examTemplates = [
  {
    id: 'quick',
    title: '15 分钟快速测',
    durationMinutes: 15,
    description: '3 道代表题，快速检查矩阵与马尔可夫链核心步骤。',
    questionIds: ['m-q3', 'mk-q3', 'mk-q7'],
    status: 'open'
  },
  {
    id: 'module',
    title: '30 分钟模块测',
    durationMinutes: 30,
    description: '更完整的计算与概念组合，适合一轮模块复习之后。',
    questionIds: ['m-q4', 'm-q5', 'm-q8', 'mk-q5', 'mk-q7'],
    status: 'open'
  },
  {
    id: 'full-beta',
    title: '50 分结构模拟卷 beta',
    durationMinutes: 120,
    description: '按往年卷结构组织递推关系、图论、图拉普拉斯、概率和马尔可夫链五部分。证明题采用步骤填空半自动判分。',
    questionIds: ['beta-matrix', 'beta-graph', 'beta-laplacian', 'beta-probability', 'beta-markov'],
    status: 'open'
  },
  {
    id: 'past-paper-2024',
    title: '2024-2025 真题训练 beta',
    durationMinutes: 120,
    description: '基于去年卷结构整理的真题训练，证明题仍采用结构化半自动判分。',
    questionIds: ['past-q1-recurrence', 'past-q2-graph', 'past-q3-laplacian-proof', 'past-q4-probability', 'past-q5-markov'],
    status: 'open'
  },
  {
    id: 'full',
    title: '2 小时完整模拟',
    durationMinutes: 120,
    description: '按完整考试节奏组织的 50 分模拟卷。',
    questionIds: [],
    status: 'preview'
  }
];

export function getExamTemplate(id) {
  return examTemplates.find((template) => template.id === id) || examTemplates[0];
}
