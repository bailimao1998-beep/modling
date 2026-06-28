export const modules = [
  {
    id: 'matrix',
    title: '数学基础',
    subtitle: '向量、矩阵、行列式与矩阵乘法',
    status: 'open',
    route: '#/lesson?module=matrix',
    topics: ['matrix:vectors', 'matrix:multiplication', 'matrix:determinants'],
    examWeight: 12,
    color: '#2f6672'
  },
  {
    id: 'recurrence',
    title: '动态系统与递推关系',
    subtitle: '差分方程、长期行为与递推模型',
    status: 'preview',
    route: '#/courses?module=recurrence',
    topics: ['recurrence:introduction', 'recurrence:systems'],
    examWeight: 8,
    color: '#68708a'
  },
  {
    id: 'graph',
    title: '图论',
    subtitle: '顶点、边、路径和邻接矩阵',
    status: 'preview',
    route: '#/courses?module=graph',
    topics: ['graph:introduction', 'graph:vertices-edges', 'graph:directed', 'graph:adjacency', 'graph:degree', 'graph:degree-matrix', 'graph:laplacian', 'graph:walks-paths', 'graph:spanning-tree'],
    examWeight: 10,
    color: '#526b55'
  },
  {
    id: 'probability',
    title: '概率论',
    subtitle: '事件、条件概率和分布',
    status: 'preview',
    route: '#/courses?module=probability',
    topics: ['probability:introduction', 'probability:sample-space', 'probability:variables', 'probability:discrete', 'probability:continuous', 'probability:density', 'probability:expectation', 'probability:variance'],
    examWeight: 10,
    color: '#8a6744'
  },
  {
    id: 'markov',
    title: '马尔可夫链',
    subtitle: '转移矩阵、预测和平稳分布',
    status: 'open',
    route: '#/lesson?module=markov',
    topics: ['markov:states', 'markov:prediction', 'markov:stationary'],
    examWeight: 10,
    color: '#765b78'
  }
];
