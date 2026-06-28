export const questions = [
  {
    id: 'm-q1',
    module: 'matrix',
    topic: 'matrix:vectors',
    difficulty: 'easy',
    type: 'single-choice',
    title: '识别向量',
    question: '下面哪一个最适合作为一个 row vector？',
    options: ['[2, 5, 7]', '[[2, 5], [7, 1]]', 'det(A)', 'P(X)'],
    steps: [],
    hints: ['向量是一列或一行有顺序的数字。', '先排除二维表格。', '[2, 5, 7] 是一个 1×3 row vector。'],
    answer: '[2, 5, 7]',
    explanation: 'row vector 是一行有顺序的数字。',
    marks: 1,
    errorTags: ['概念不理解']
  },
  {
    id: 'm-q2',
    module: 'matrix',
    topic: 'matrix:multiplication',
    difficulty: 'easy',
    type: 'numeric-fill',
    title: '矩阵元素定位',
    question: 'A=[[3,4],[5,6]]，元素 a_21 是多少？',
    steps: [],
    hints: ['a_ij 表示第 i 行第 j 列。', 'a_21 是第 2 行第 1 列。', '第 2 行是 [5,6]，第 1 列元素是 5。'],
    answer: 5,
    explanation: 'a_21 位于第 2 行第 1 列。',
    marks: 1,
    errorTags: ['概念不理解']
  },
  {
    id: 'm-q3',
    module: 'matrix',
    topic: 'matrix:multiplication',
    difficulty: 'easy',
    type: 'matrix-fill',
    title: '2×2 矩阵乘法',
    question: '计算 A=[[1,2],[3,4]], B=[[2,0],[1,2]] 的 AB。',
    steps: [],
    hints: ['使用行乘列规则。', '先算第 1 行第 1 列：1×2+2×1。', '四个元素分别为 4, 4, 10, 8。'],
    answer: [
      [4, 4],
      [10, 8]
    ],
    explanation: 'AB 的每个元素来自 A 的一行与 B 的一列的点积。',
    marks: 4,
    errorTags: ['矩阵乘法错误', '计算错误']
  },
  {
    id: 'm-q4',
    module: 'matrix',
    topic: 'matrix:multiplication',
    difficulty: 'medium',
    type: 'stepped',
    title: '分步骤计算矩阵乘法',
    question: 'A=[[2,1],[0,3]], B=[[1,4],[2,2]]。分步骤计算 AB。',
    steps: [
      {
        stepId: 's1',
        prompt: '第 1 行第 1 列是多少？',
        expectedAnswer: 4,
        marks: 1,
        validationType: 'numeric',
        feedbackCorrect: '正确，2×1+1×2=4。',
        feedbackWrong: '检查第 1 行 [2,1] 与第 1 列 [1,2] 的点积。'
      },
      {
        stepId: 's2',
        prompt: '第 1 行第 2 列是多少？',
        expectedAnswer: 10,
        marks: 1,
        validationType: 'numeric',
        feedbackCorrect: '正确，2×4+1×2=10。',
        feedbackWrong: '第二列是 [4,2]，不是第二行。'
      },
      {
        stepId: 's3',
        prompt: '第 2 行第 1 列是多少？',
        expectedAnswer: 6,
        marks: 1,
        validationType: 'numeric',
        feedbackCorrect: '正确，0×1+3×2=6。',
        feedbackWrong: '用第二行 [0,3] 乘第一列 [1,2]。'
      },
      {
        stepId: 's4',
        prompt: '第 2 行第 2 列是多少？',
        expectedAnswer: 6,
        marks: 1,
        validationType: 'numeric',
        feedbackCorrect: '正确，0×4+3×2=6。',
        feedbackWrong: '用第二行和第二列做点积。'
      }
    ],
    hints: ['仍然是行乘列。', '每一步只填一个元素。', '答案矩阵是 [[4,10],[6,6]]。'],
    answer: { s1: 4, s2: 10, s3: 6, s4: 6 },
    explanation: '每个格子都是一个点积。',
    marks: 4,
    errorTags: ['矩阵乘法错误']
  },
  {
    id: 'm-q5',
    module: 'matrix',
    topic: 'matrix:determinants',
    difficulty: 'easy',
    type: 'numeric-fill',
    title: '2×2 行列式',
    question: '计算 det([[3,2],[1,4]])。',
    steps: [],
    hints: ['2×2 行列式公式是 ad-bc。', '这里 a=3,d=4,b=2,c=1。', '3×4-2×1=10。'],
    answer: 10,
    explanation: 'det(A)=3×4-2×1=10。',
    marks: 2,
    errorTags: ['行列式错误']
  },
  {
    id: 'm-q6',
    module: 'matrix',
    topic: 'matrix:multiplication',
    difficulty: 'medium',
    type: 'single-choice',
    title: '单位矩阵作用',
    question: '若 I 是 2×2 单位矩阵，AI 等于什么？',
    options: ['A', 'I', '0', 'det(A)'],
    steps: [],
    hints: ['单位矩阵像乘法中的 1。', '它不会改变矩阵 A。', 'AI=A。'],
    answer: 'A',
    explanation: '单位矩阵是矩阵乘法中的 identity。',
    marks: 1,
    errorTags: ['概念不理解']
  },
  {
    id: 'm-q7',
    module: 'matrix',
    topic: 'matrix:multiplication',
    difficulty: 'medium',
    type: 'matrix-fill',
    title: '矩阵平方',
    question: '计算 A=[[1,1],[1,0]] 的 A^2。',
    steps: [],
    hints: ['A^2 表示 A×A。', '按行乘列规则计算。', '答案是 [[2,1],[1,1]]。'],
    answer: [
      [2, 1],
      [1, 1]
    ],
    explanation: 'A^2=A×A。',
    marks: 4,
    errorTags: ['矩阵乘法错误']
  },
  {
    id: 'm-q8',
    module: 'matrix',
    topic: 'matrix:determinants',
    difficulty: 'exam',
    type: 'numeric-fill',
    title: '3×3 行列式基础',
    question: '计算 det([[1,0,2],[0,1,0],[3,0,1]])。',
    steps: [],
    hints: ['可沿第二行展开。', '第二行只有中间元素 1。', '剩余 2×2 行列式为 det([[1,2],[3,1]])=1-6=-5。'],
    answer: -5,
    explanation: '沿第二行展开得到 det([[1,2],[3,1]])=-5。',
    marks: 3,
    errorTags: ['行列式错误']
  },
  {
    id: 'mk-q1',
    module: 'markov',
    topic: 'markov:states',
    difficulty: 'easy',
    type: 'single-choice',
    title: '状态的含义',
    question: '在天气马尔可夫链中，“晴天”是什么？',
    options: ['状态', '转移概率', '平稳分布', '行列式'],
    steps: [],
    hints: ['马尔可夫链由若干可能情况组成。', '晴天、阴天、雨天是系统可能处于的情况。', '所以晴天是一个状态。'],
    answer: '状态',
    explanation: '状态是系统在某一步可能处于的情况。',
    marks: 1,
    errorTags: ['概念不理解']
  },
  {
    id: 'mk-q2',
    module: 'markov',
    topic: 'markov:prediction',
    difficulty: 'easy',
    type: 'matrix-fill',
    title: '一步天气预测',
    question: '使用默认矩阵 P，从 ρ0=[1,0,0] 计算 ρ1。',
    steps: [],
    hints: ['使用 ρ1=ρ0P。', 'ρ0=[1,0,0] 会选出 P 的第一行。', '答案是 [0.4,0.6,0]，可填成 1×3 矩阵。'],
    answer: [[0.4, 0.6, 0]],
    explanation: '今天一定晴天时，明天分布就是晴天这一行的转移概率。',
    marks: 3,
    errorTags: ['转移矩阵方向错误']
  },
  {
    id: 'mk-q3',
    module: 'markov',
    topic: 'markov:prediction',
    difficulty: 'medium',
    type: 'stepped',
    title: '分步骤一步预测',
    question: 'ρ0=[0,1,0]，使用默认矩阵 P。分步骤求 ρ1。',
    steps: [
      {
        stepId: 's1',
        prompt: 'ρ1 的晴天概率是多少？',
        expectedAnswer: 0.25,
        marks: 1,
        validationType: 'numeric',
        feedbackCorrect: '正确，从阴天到晴天的概率是 0.25。',
        feedbackWrong: 'ρ0=[0,1,0] 表示当前是阴天，所以看 P 的第二行。'
      },
      {
        stepId: 's2',
        prompt: 'ρ1 的阴天概率是多少？',
        expectedAnswer: 0,
        marks: 1,
        validationType: 'numeric',
        feedbackCorrect: '正确，从阴天到阴天为 0。',
        feedbackWrong: '仍然看第二行的第二个数。'
      },
      {
        stepId: 's3',
        prompt: 'ρ1 的雨天概率是多少？',
        expectedAnswer: 0.75,
        marks: 1,
        validationType: 'numeric',
        feedbackCorrect: '正确，从阴天到雨天为 0.75。',
        feedbackWrong: '第二行第三个概率是 0.75。'
      }
    ],
    hints: ['使用 row-vector convention。', 'ρ0=[0,1,0] 会选出第二行。', 'ρ1=[0.25,0,0.75]。'],
    answer: { s1: 0.25, s2: 0, s3: 0.75 },
    explanation: '当前状态确定为阴天时，一步预测等于转移矩阵第二行。',
    marks: 3,
    errorTags: ['转移矩阵方向错误']
  },
  {
    id: 'mk-q4',
    module: 'markov',
    topic: 'markov:prediction',
    difficulty: 'easy',
    type: 'numeric-fill',
    title: '概率行检查',
    question: '一行转移概率 [0.25, 0, 0.75] 的和是多少？',
    steps: [],
    hints: ['转移矩阵每一行表示从同一状态出发。', '所有可能去向概率相加。', '0.25+0+0.75=1。'],
    answer: 1,
    explanation: '每一行概率和必须等于 1。',
    marks: 1,
    errorTags: ['概率和不等于 1']
  },
  {
    id: 'mk-q5',
    module: 'markov',
    topic: 'markov:prediction',
    difficulty: 'medium',
    type: 'matrix-fill',
    title: '混合初始分布一步预测',
    question: 'ρ0=[0.5,0.5,0]，用默认 P 计算 ρ1。',
    steps: [],
    hints: ['计算 0.5×第一行 + 0.5×第二行。', '晴天概率为 0.5×0.4+0.5×0.25。', '答案是 [0.325,0.3,0.375]。'],
    answer: [[0.325, 0.3, 0.375]],
    explanation: '按 ρP 逐列计算。',
    marks: 3,
    errorTags: ['转移矩阵方向错误', '计算错误']
  },
  {
    id: 'mk-q6',
    module: 'markov',
    topic: 'markov:stationary',
    difficulty: 'medium',
    type: 'numeric-fill',
    title: '概率归一化',
    question: '若求得比例向量 [5,6,4]，归一化后晴天概率是多少？',
    steps: [],
    hints: ['归一化就是除以总和。', '总和是 15。', '晴天概率是 5/15=1/3。'],
    answer: 0.333333,
    explanation: '平稳分布必须总和为 1。',
    marks: 2,
    errorTags: ['平稳分布未归一化']
  },
  {
    id: 'mk-q7',
    module: 'markov',
    topic: 'markov:stationary',
    difficulty: 'exam',
    type: 'stepped',
    title: '平稳分布条件',
    question: '判断 ρ=[0.4,0.24,0.36] 是否是默认矩阵 P 的平稳分布。',
    steps: [
      {
        stepId: 's1',
        prompt: 'ρ 的三个概率和是多少？',
        expectedAnswer: 1,
        marks: 1,
        validationType: 'numeric',
        feedbackCorrect: '正确，分布已归一化。',
        feedbackWrong: '先检查概率和是否为 1。'
      },
      {
        stepId: 's2',
        prompt: 'ρP 的晴天概率是多少？',
        expectedAnswer: 0.58,
        marks: 1,
        validationType: 'numeric',
        feedbackCorrect: '正确，0.4×0.4+0.24×0.25+0.36×1=0.58。',
        feedbackWrong: '按 ρP 的第一列计算。'
      },
      {
        stepId: 's3',
        prompt: '它是否平稳？填写 yes 或 no。',
        expectedAnswer: 'no',
        marks: 1,
        validationType: 'text',
        feedbackCorrect: '正确，ρP 不等于 ρ。',
        feedbackWrong: '比较 ρP 和原来的 ρ。'
      }
    ],
    hints: ['平稳分布满足 ρP=ρ。', '先算 ρP 的至少一个分量。', '晴天分量已经变成 0.58，不等于 0.4。'],
    answer: { s1: 1, s2: 0.58, s3: 'no' },
    explanation: 'ρP≠ρ，因此不是平稳分布。',
    marks: 3,
    errorTags: ['平稳分布未归一化', '转移矩阵方向错误']
  }
];

export function getQuestionsByModule(moduleId) {
  return questions.filter((question) => question.module === moduleId);
}

export function getQuestionById(id) {
  return questions.find((question) => question.id === id);
}
