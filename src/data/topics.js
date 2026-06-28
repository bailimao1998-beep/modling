export const topics = [
  { id: 'matrix:vectors', moduleId: 'matrix', title: '向量、行与列', summary: '认识 row vector、column vector 与矩阵尺寸。', status: 'open' },
  { id: 'matrix:multiplication', moduleId: 'matrix', title: '矩阵运算', summary: '掌握加法、行乘列、单位矩阵和矩阵乘方。', status: 'open' },
  { id: 'matrix:determinants', moduleId: 'matrix', title: '行列式', summary: '计算 2×2 与基础 3×3 行列式。', status: 'open' },
  { id: 'recurrence:introduction', moduleId: 'recurrence', title: '递推关系', summary: '用前一步的值定义下一步。', status: 'preview' },
  { id: 'recurrence:systems', moduleId: 'recurrence', title: '动态系统', summary: '观察递推模型的长期行为。', status: 'preview' },
  { id: 'graph:introduction', moduleId: 'graph', title: '什么是图', summary: '用顶点和边描述对象之间的关系。', status: 'open' },
  { id: 'graph:vertices-edges', moduleId: 'graph', title: '顶点和边', summary: '识别 vertices、edges 和基本记号。', status: 'open' },
  { id: 'graph:directed', moduleId: 'graph', title: '有向图和无向图', summary: '区分有方向和无方向的连接。', status: 'open' },
  { id: 'graph:adjacency', moduleId: 'graph', title: '邻接矩阵', summary: '把图的连接关系写成矩阵。', status: 'open' },
  { id: 'graph:degree', moduleId: 'graph', title: '节点的度', summary: '统计连接到一个节点的边数。', status: 'open' },
  { id: 'graph:degree-matrix', moduleId: 'graph', title: '度矩阵', summary: '用对角矩阵记录节点度数。', status: 'open' },
  { id: 'graph:laplacian', moduleId: 'graph', title: '图拉普拉斯矩阵', summary: '理解 L = D - A。', status: 'open' },
  { id: 'graph:walks-paths', moduleId: 'graph', title: 'Walks and paths', summary: '区分游走、路径和连通性。', status: 'open' },
  { id: 'graph:spanning-tree', moduleId: 'graph', title: 'Spanning tree', summary: '连接全部顶点且不形成环。', status: 'open' },
  { id: 'probability:introduction', moduleId: 'probability', title: '概率是什么', summary: '用 0 到 1 描述事件发生的可能性。', status: 'open' },
  { id: 'probability:sample-space', moduleId: 'probability', title: '样本空间', summary: '列出一次随机试验的所有可能结果。', status: 'open' },
  { id: 'probability:variables', moduleId: 'probability', title: '随机变量', summary: '把随机结果映射成数值。', status: 'open' },
  { id: 'probability:discrete', moduleId: 'probability', title: '离散随机变量', summary: '处理可数取值及其概率。', status: 'open' },
  { id: 'probability:continuous', moduleId: 'probability', title: '连续随机变量', summary: '理解区间概率和连续取值。', status: 'open' },
  { id: 'probability:density', moduleId: 'probability', title: '概率密度函数', summary: '用曲线下的面积表示概率。', status: 'open' },
  { id: 'probability:expectation', moduleId: 'probability', title: '期望', summary: '计算随机变量的长期平均。', status: 'open' },
  { id: 'probability:variance', moduleId: 'probability', title: '方差', summary: '衡量随机变量围绕均值的波动。', status: 'open' },
  { id: 'markov:states', moduleId: 'markov', title: '状态与转移', summary: '认识状态、转移概率和随机矩阵。', status: 'open' },
  { id: 'markov:prediction', moduleId: 'markov', title: '一步与多步预测', summary: '使用 row-vector convention 计算 ρP。', status: 'open' },
  { id: 'markov:stationary', moduleId: 'markov', title: '平稳分布', summary: '求解 ρP = ρ 并进行概率归一化。', status: 'open' }
];

export function getTopicsByModule(moduleId) {
  return topics.filter((topic) => topic.moduleId === moduleId);
}

export function getTopicTitle(topicId) {
  return topics.find((topic) => topic.id === topicId)?.title || topicId;
}
