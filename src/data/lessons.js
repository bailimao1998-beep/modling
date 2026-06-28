export const lessons = {
  matrix: {
    id: 'matrix-foundations',
    moduleId: 'matrix',
    title: '矩阵基础',
    subtitle: '从行和列出发，真正理解矩阵乘法与行列式',
    topic: 'matrix:multiplication',
    goals: ['读懂向量与矩阵的尺寸', '用行乘列计算 2×2 矩阵乘法', '识别单位矩阵与矩阵乘方', '计算基础 2×2 和 3×3 行列式'],
    plainExplanation:
      '向量像一份有顺序的记录，例如 [做题数, 正确数, 用时]。矩阵把多份记录排成表格；矩阵乘法则把一组规则应用到另一组数据上。关键不是背四个格子的答案，而是每次只盯住一行和一列。',
    symbols: [
      { symbol: 'A_{ij}', meaning: '矩阵 A 第 i 行、第 j 列的元素' },
      { symbol: 'm × n', meaning: 'm 行、n 列的矩阵尺寸' },
      { symbol: 'I', meaning: '单位矩阵，作用类似普通乘法中的 1' },
      { symbol: 'det(A)', meaning: '矩阵 A 的行列式' }
    ],
    formulas: [
      'A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}',
      '(AB)_{ij}=\\sum_k A_{ik}B_{kj}',
      'I_2 = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}',
      '\\det\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}=ad-bc'
    ],
    example: {
      title: '完整例题：逐格计算 AB',
      problem: 'A=[[1,2],[3,4]]，B=[[2,0],[1,2]]，求 AB。',
      steps: [
        '第 1 行乘第 1 列：1×2 + 2×1 = 4。',
        '第 1 行乘第 2 列：1×0 + 2×2 = 4。',
        '第 2 行乘第 1 列：3×2 + 4×1 = 10。',
        '第 2 行乘第 2 列：3×0 + 4×2 = 8。'
      ],
      answer: 'AB=[[4,4],[10,8]]'
    },
    guidedPracticeIds: ['m-q4'],
    independentPracticeIds: ['m-q3', 'm-q5', 'm-q7'],
    summary: ['矩阵尺寸按“行 × 列”书写。', 'AB 的每个元素来自 A 的一行与 B 的一列的点积。', 'A² 表示 A×A，而不是逐元素平方。', '2×2 行列式使用 ad-bc。'],
    nextLessonId: 'markov-foundations',
    checklist: ['什么是向量', '什么是矩阵', '矩阵的行和列', '矩阵加法', '矩阵乘法', '行乘列规则', '2×2 矩阵乘法练习', '单位矩阵', '矩阵乘方', '2×2 和 3×3 行列式基础']
  },
  markov: {
    id: 'markov-foundations',
    moduleId: 'markov',
    title: '马尔可夫链',
    subtitle: '用状态、转移矩阵和概率分布描述下一步',
    topic: 'markov:prediction',
    goals: ['解释状态和转移概率', '检查转移矩阵每行概率和', '完成一步与多步预测', '理解并检验平稳分布'],
    plainExplanation:
      '马尔可夫链描述“下一步只依赖当前状态”的系统。天气就是一个直观例子：知道今天是晴、阴还是雨，就能使用对应的一行概率估计明天，而不需要逐日回看完整历史。',
    symbols: [
      { symbol: 'P', meaning: '转移矩阵；每一行表示从当前状态出发' },
      { symbol: 'P_{ij}', meaning: '从状态 i 转移到状态 j 的概率' },
      { symbol: 'ρ_n', meaning: '第 n 步的 row-vector 概率分布' },
      { symbol: 'ρ', meaning: '满足 ρP=ρ 的平稳分布' }
    ],
    formulas: ['\\rho_{n+1}=\\rho_nP', '\\sum_jP_{ij}=1', '\\rho P=\\rho', '\\sum_i\\rho_i=1'],
    example: {
      title: '完整例题：从晴天预测下一天',
      problem: '今天一定是晴天，ρ₀=[1,0,0]，使用默认转移矩阵求 ρ₁。',
      steps: ['确认本系统使用 row-vector convention。', '计算 ρ₁=ρ₀P。', '[1,0,0] 只保留 P 的第一行。'],
      answer: 'ρ₁=[0.4,0.6,0]'
    },
    guidedPracticeIds: ['mk-q3'],
    independentPracticeIds: ['mk-q2', 'mk-q5', 'mk-q7'],
    summary: ['状态是系统在某一步可能处于的情况。', '转移矩阵每一行概率和必须为 1。', '本课程统一使用 ρP，而不是 Pρ。', '平稳分布既要满足 ρP=ρ，也要归一化。'],
    nextLessonId: null,
    checklist: ['状态是什么', '转移概率是什么', '转移矩阵是什么', '为什么每一行概率之和为 1', '初始概率分布', '一步预测', '多步预测', '平稳分布', '解方程 ρP = ρ', '概率归一化']
  }
};

export function getLessonByModule(moduleId) {
  return lessons[moduleId] || null;
}
