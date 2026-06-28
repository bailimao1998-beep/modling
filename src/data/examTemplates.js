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
