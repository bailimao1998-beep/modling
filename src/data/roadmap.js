export const examRoadmap = [
  {
    id: 'secure-marks',
    number: 1,
    title: '第一阶段：保底拿分',
    target: '先稳定 30 分左右',
    topics: ['概率论', '马尔可夫链', '图论计算'],
    description: '优先练公式明确、步骤可核对的计算题，把基础分变成稳定得分。',
    actions: [
      { label: '概率课程', href: '#/lesson?module=probability' },
      { label: '马尔可夫课程', href: '#/lesson?module=markov' },
      { label: '图论实验室', href: '#/labs' },
      { label: '图论练习', href: '#/practice?module=graph' }
    ]
  },
  {
    id: 'recurrence-marks',
    number: 2,
    title: '第二阶段：补递推关系',
    target: '争取 Q1 步骤分',
    topics: ['二阶递推', '状态向量', 'A=[[2,-2],[1,0]]', 'x2 到 x6'],
    description: '把逐项计算和矩阵形式连起来，先确保每一个可独立给分的步骤都能写出。',
    actions: [
      { label: '递推课程', href: '#/lesson?module=recurrence' },
      { label: '递推实验室', href: '#/labs' },
      { label: '重做 r-q10', href: '#/practice?module=recurrence&question=r-q10' }
    ]
  },
  {
    id: 'proof-marks',
    number: 3,
    title: '第三阶段：证明题模板',
    target: 'Q3 不空题，争步骤分',
    topics: ['normalized Laplacian PSD', '证明结构排序', '关键空填空'],
    description: '记住“考虑二次型、化成平方和、说明非负、得出半正定”的写作骨架。',
    actions: [
      { label: '进入证明训练', href: '#/proofs' },
      { label: '图论课程', href: '#/lesson?module=graph' }
    ]
  },
  {
    id: 'full-paper',
    number: 4,
    title: '第四阶段：整卷训练',
    target: '把知识点变成限时得分',
    topics: ['50 分 beta 卷', '错题复盘', '48 小时后重做'],
    description: '提交后按五部分报告安排复习，不追求一次满分，追求下一次少犯一种错误。',
    actions: [
      { label: '开始 50 分 beta', href: '#/exam?mode=full-beta' },
      { label: '打开错题本', href: '#/mistakes' }
    ]
  }
];
