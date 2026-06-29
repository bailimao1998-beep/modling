export const laplacianPsdProof = {
  id: 'normalized-laplacian-psd',
  title: 'Symmetric normalized graph Laplacian 是 positive semidefinite',
  target: '对 connected undirected weighted graph，证明 L_sym = I - D^{-1/2}AD^{-1/2} 是 positive semidefinite。',
  steps: [
    { id: 'define', text: '写出 L_sym = I - D^{-1/2} A D^{-1/2}。' },
    { id: 'quadratic', text: '对任意向量 f，考虑二次型 f^T L_sym f。' },
    { id: 'expand', text: '把二次型展开成关于顶点 i、j 的求和形式。' },
    { id: 'rewrite', text: '重写为 1/2 sum_{i,j} a_ij (f_i/sqrt(d_i) - f_j/sqrt(d_j))^2。' },
    { id: 'nonnegative', text: '说明每一项都是平方，并且 a_ij >= 0。' },
    { id: 'conclude-form', text: '因此对任意 f，都有 f^T L_sym f >= 0。' },
    { id: 'conclude-psd', text: '由定义得出 L_sym 是 positive semidefinite。' }
  ],
  practiceOrder: ['define', 'expand', 'quadratic', 'rewrite', 'conclude-form', 'nonnegative', 'conclude-psd'],
  blanks: [
    { id: 'factor', label: '求和式前的系数', answer: '1/2' },
    { id: 'weight', label: '边的非负权重', answer: 'a_ij' },
    { id: 'normalized', label: '归一化后的第 i 个分量', answer: 'f_i/sqrt(d_i)' },
    { id: 'shape', label: '括号整体形成什么', answer: 'square' },
    { id: 'bound', label: '二次型最终下界', answer: '>= 0' }
  ],
  completeTemplate: [
    '令 L_sym = I - D^{-1/2}AD^{-1/2}，并取任意向量 f。',
    '展开 f^T L_sym f，可将无向边的两个方向合并。',
    '于是 f^T L_sym f = 1/2 sum_{i,j} a_ij (f_i/sqrt(d_i) - f_j/sqrt(d_j))^2。',
    '由于 a_ij >= 0 且平方项非负，所以 f^T L_sym f >= 0。',
    '因此 L_sym 是 positive semidefinite。'
  ],
  examVersion: [
    'Let L_sym = I - D^{-1/2}AD^{-1/2} and take any vector f.',
    'Consider the quadratic form f^T L_sym f.',
    'Then f^T L_sym f = 1/2 sum_{i,j} a_ij (f_i/sqrt(d_i) - f_j/sqrt(d_j))^2.',
    'Every term is non-negative because a_ij >= 0 and the bracket is squared.',
    'Hence f^T L_sym f >= 0 for every f, so L_sym is positive semidefinite.'
  ],
  examTip: '考试中先写“取任意 f 并考虑二次型”，再化成加权平方和；最后明确写出“对任意 f 非负，因此矩阵半正定”。'
};
