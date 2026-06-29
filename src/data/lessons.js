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
  recurrence: {
    id: 'recurrence-foundations',
    moduleId: 'recurrence',
    title: '动态系统与递推关系',
    subtitle: '从一步更新规则走到状态向量、矩阵预测与长期行为',
    topic: 'recurrence:matrix',
    goals: ['识别离散动态系统与初始条件', '计算一阶和二阶递推关系', '把二阶递推写成状态向量与矩阵形式', '用特征值建立稳定、震荡与增长的直觉', '区分离散递推和 ODE 连续时间模型'],
    plainExplanation: '动态系统就是“今天的状态决定明天的状态”。人口增长、天气变化、弹簧运动和账户余额都可以写成一步一步更新的规则。离散时间系统只在 k=0,1,2,… 这些时刻观察；ODE 则把时间看成连续的，用 dx/dt 描述此刻变化率。知道更新规则和初始条件，就能从 x_k 推到 x_{k+1}，或从当前 x 判断连续变化速度。',
    symbols: [
      { symbol: 'x_k', meaning: '系统在离散时刻 k 的状态' },
      { symbol: 'x_{k+1}=f(x_k)', meaning: '一阶递推：下一步由当前一步决定' },
      { symbol: 'x_0,x_1', meaning: '二阶递推所需的两个初始条件' },
      { symbol: 'y_k', meaning: '状态向量 [x_{k+1},x_k]^T' },
      { symbol: 'A', meaning: '把状态 y_k 更新到 y_{k+1} 的矩阵' },
      { symbol: 'λ', meaning: '特征值；帮助判断长期衰减、震荡或增长' },
      { symbol: 'dx/dt', meaning: 'ODE 中状态 x 对连续时间 t 的瞬时变化率' }
    ],
    formulas: [
      'x_{k+1}=f(x_k)',
      'x_{k+1}=r x_k(1-x_k)',
      'x_{k+2}=2x_{k+1}-2x_k',
      'y_k=\\begin{bmatrix}x_{k+1}\\\\x_k\\end{bmatrix}',
      'y_{k+1}=Ay_k,\\quad A=\\begin{bmatrix}2&-2\\\\1&0\\end{bmatrix}',
      'y_k=A^k y_0',
      '\\frac{dx}{dt}=f(x,t)'
    ],
    example: {
      title: '完整例题：二阶递推的矩阵形式',
      problem: 'x₀=0，x₁=1，且 x_{k+2}=2x_{k+1}-2x_k。求 x₂ 到 x₆，并写成矩阵系统。',
      steps: [
        'x₂=2x₁-2x₀=2。',
        '继续代入得到 x₃=2，x₄=0，x₅=-4，x₆=-8。',
        '令 y_k=[x_{k+1},x_k]^T，使两个必需的旧值放在同一个状态里。',
        '第一行产生 2x_{k+1}-2x_k，第二行把 x_{k+1} 保留下来，所以 A=[[2,-2],[1,0]]。',
        '因此 y_{k+1}=Ay_k，反复更新等价于 y_k=A^k y₀。'
      ],
      answer: 'x₂,…,x₆ = 2,2,0,-4,-8；A=[[2,-2],[1,0]]'
    },
    guidedPracticeIds: ['r-q4', 'r-q7', 'r-q10'],
    independentPracticeIds: ['r-q3', 'r-q8', 'r-q9'],
    summary: ['动态系统由状态、更新规则和初始条件组成。', '二阶递推必须保留连续两个值。', '状态向量把二阶递推变成一阶矩阵系统。', '矩阵乘方可以一次预测多步。', '特征值的模提供稳定、震荡与增长的第一层直觉。', 'ODE 是连续时间模型，第一步通常是把当前 x 代入 dx/dt。'],
    nextLessonId: 'graph-foundations',
    checklist: ['什么是动态系统', '离散时间系统', '递推关系', '初始条件', '从 x_k 到 x_{k+1}', '二阶递推关系', '递推的矩阵形式', '状态向量', '矩阵乘方预测未来', '特征值基础', '稳定、震荡与增长的直觉', 'ODE 与连续时间系统']
  },
  graph: {
    id: 'graph-foundations',
    moduleId: 'graph',
    title: '图论核心复习',
    subtitle: '从邻接矩阵走到 walks、图拉普拉斯与生成树',
    topic: 'graph:adjacency',
    goals: ['从图构造邻接矩阵 A', '用 A^k 读取长度为 k 的 walks 数量', '构造 D 与 L=D-A', '用 incidence matrix 记录顶点-边关系', '用 Matrix-tree theorem 计算生成树数量', '理解 spectral clustering 为什么看 Laplacian eigenvectors'],
    plainExplanation: '图把对象画成顶点，把关系画成边。邻接矩阵是这张图的数字版本；incidence matrix 则换一个角度，记录每条边碰到哪些顶点。矩阵乘方会记录不同长度的走法，图拉普拉斯的余子式行列式会数出生成树，而 spectral 方法会用 Laplacian 的 eigenvectors 给顶点新的分组坐标。',
    symbols: [
      { symbol: 'A', meaning: '邻接矩阵；Aij=1 表示 vi 与 vj 相连' },
      { symbol: 'A^k', meaning: '其 ij 元素是从 vi 到 vj 长度为 k 的 walks 数量' },
      { symbol: 'D', meaning: '度矩阵；对角线记录每个顶点的 degree' },
      { symbol: 'L', meaning: '图拉普拉斯矩阵 L=D-A' },
      { symbol: 'B', meaning: 'incidence matrix；行是顶点，列是边' },
      { symbol: 'τ(G)', meaning: '图 G 的生成树数量' },
      { symbol: 'L_sym', meaning: 'normalized Laplacian，用 degree 调整尺度' }
    ],
    formulas: ['L=D-A', '(A^k)_{ij}=\\text{number of walks of length }k', 'B_{ve}=1\\text{ if vertex }v\\text{ touches edge }e', '\\tau(G)=\\det(L^{(r,c)})', '\\tau(K_n)=n^{n-2}', 'L_{sym}=I-D^{-1/2}AD^{-1/2}'],
    example: {
      title: '完整例题：K4 的矩阵与生成树',
      problem: 'K4 有四个顶点且任意两个顶点相连。求 A、(A⁴)₁₃、L 与生成树数量。',
      steps: ['A 的对角线为 0，其余元素全为 1。', '计算 A⁴，读取第 1 行第 3 列得到 20。', '每个顶点 degree 为 3，所以 D=diag(3,3,3,3)。', 'L=D-A；删除任一行和任一列后，3×3 minor 的 determinant 为 16。'],
      answer: '(A⁴)₁₃=20，τ(K4)=16'
    },
    guidedPracticeIds: ['g-q4', 'g-q7'],
    independentPracticeIds: ['g-q1', 'g-q5', 'g-q8'],
    summary: ['无向简单图的 A 是对称矩阵且对角线为 0。', 'incidence matrix 的每一列对应一条边。', 'A^k 的元素计数 walks，不要求顶点互不重复。', 'D 只在对角线上记录 degree。', '任一 Laplacian cofactor 的 determinant 给出生成树数量。', 'spectral clustering 用 Laplacian eigenvectors 表示图的分组结构。'],
    nextLessonId: 'probability-foundations',
    checklist: ['邻接矩阵 A', 'incidence matrix', '节点 degree', '度矩阵 D', '图拉普拉斯 L', 'walks and paths', '矩阵乘方 A^k', 'Matrix-tree theorem', 'spanning trees', 'spectral clustering']
  },
  probability: {
    id: 'probability-foundations',
    moduleId: 'probability',
    title: '概率密度核心复习',
    subtitle: '把曲线下面积、期望和方差连成一套计算步骤',
    topic: 'probability:density',
    goals: ['把区间概率写成密度积分', '正确拆分分段密度的跨区间积分', '计算 E[X] 与 E[X²]', '使用 Var(X)=E[X²]-E[X]²', '用条件概率和独立性判断事件关系', '用 LLN、CLT 和 sampling 解释样本平均'],
    plainExplanation: '连续随机变量不会把概率放在单个点上，而是放在曲线下面积里。期望像概率质量的平衡位置，方差则描述这些质量离平衡位置有多分散。条件概率是在“已知 B 发生”的小世界里重新算比例；独立表示知道 B 不会改变 A 的概率。sampling 则回答：抽样次数变多时，样本平均会不会更稳定。',
    symbols: [
      { symbol: 'p(x)', meaning: '概率密度函数' },
      { symbol: 'P(a≤X≤b)', meaning: '密度曲线从 a 到 b 下方的面积' },
      { symbol: 'E[X]', meaning: '随机变量的带权平均位置' },
      { symbol: 'E[X²]', meaning: '平方后的二阶矩' },
      { symbol: 'Var(X)', meaning: '围绕期望的分散程度' },
      { symbol: 'P(A|B)', meaning: '在 B 已发生条件下 A 的概率' },
      { symbol: 'Cov(X,Y)', meaning: 'X 与 Y 线性同升同降的程度' },
      { symbol: '\\bar X', meaning: '样本平均，LLN 和 CLT 的核心对象' }
    ],
    formulas: ['P(a\\le X\\le b)=\\int_a^b p(x)\\,dx', 'E[X]=\\int xp(x)\\,dx', 'E[X^2]=\\int x^2p(x)\\,dx', '\\operatorname{Var}(X)=E[X^2]-E[X]^2', 'P(A|B)=\\frac{P(A\\cap B)}{P(B)}', 'A\\perp B\\Rightarrow P(A\\cap B)=P(A)P(B)', '\\operatorname{Cov}(X,Y)=E[XY]-E[X]E[Y]'],
    example: {
      title: '完整例题：三角形密度',
      problem: 'p(x)=x (0 < x≤1)，p(x)=2-x (1 < x≤2)。求 P(X≤0.5)、E[X] 与 Var(X)。',
      steps: ['P(X≤0.5)=∫₀^0.5 x dx=1/8。', 'E[X] 分两段计算 ∫₀¹x²dx + ∫₁²x(2-x)dx=1。', 'E[X²]=∫₀¹x³dx + ∫₁²x²(2-x)dx=7/6。', 'Var(X)=7/6-1²=1/6。'],
      answer: 'P(X≤0.5)=1/8，E[X]=1，Var(X)=1/6'
    },
    guidedPracticeIds: ['p-q4', 'p-q8'],
    independentPracticeIds: ['p-q3', 'p-q5', 'p-q7'],
    summary: ['连续概率是曲线下面积。', '跨过分段点 x=1 时必须拆成两个积分。', '期望是带权平均位置。', '方差可用 E[X²]-E[X]² 快速计算。', '条件概率先缩小样本空间，再计算比例。', '独立比零协方差更强。', 'LLN 讲样本平均靠近期望，CLT 讲大样本平均近似 normal。'],
    nextLessonId: 'markov-foundations',
    checklist: ['概率与补事件', '条件概率', '独立性', '协方差', '连续随机变量', '概率密度函数', '区间积分', '分段积分', '期望 E[X]', '二阶矩 E[X²]', '方差 Var(X)', 'LLN', 'CLT', 'sampling']
  },
  markov: {
    id: 'markov-foundations',
    moduleId: 'markov',
    title: '马尔可夫链',
    subtitle: '用状态、转移矩阵和概率分布描述下一步',
    topic: 'markov:prediction',
    goals: ['解释状态和转移概率', '检查转移矩阵每行概率和', '完成一步与多步预测', '理解并检验平稳分布', '用 regular/ergodic 判断长期收敛直觉', '认识 Perron-Frobenius 与 eigenvalue 1 的关系'],
    plainExplanation:
      '马尔可夫链描述“下一步只依赖当前状态”的系统。天气就是一个直观例子：知道今天是晴、阴还是雨，就能使用对应的一行概率估计明天，而不需要逐日回看完整历史。若链是 regular/ergodic，走很多步以后起点影响会消失，概率分布会靠近平稳分布；Perron-Frobenius theorem 是这个长期稳定直觉背后的理论入口。',
    symbols: [
      { symbol: 'P', meaning: '转移矩阵；每一行表示从当前状态出发' },
      { symbol: 'P_{ij}', meaning: '从状态 i 转移到状态 j 的概率' },
      { symbol: 'ρ_n', meaning: '第 n 步的 row-vector 概率分布' },
      { symbol: 'ρ', meaning: '满足 ρP=ρ 的平稳分布' },
      { symbol: 'P^k>0', meaning: '某个 k 步转移矩阵所有元素为正，是 regular 的常见判定' },
      { symbol: 'λ=1', meaning: 'stochastic matrix 与 stationary distribution 对应的主特征值' }
    ],
    formulas: ['\\rho_{n+1}=\\rho_nP', '\\sum_jP_{ij}=1', '\\rho P=\\rho', '\\sum_i\\rho_i=1', 'P^k>0\\Rightarrow\\text{regular}', '\\rho P=1\\cdot \\rho'],
    example: {
      title: '完整例题：从晴天预测下一天',
      problem: '今天一定是晴天，ρ₀=[1,0,0]，使用默认转移矩阵求 ρ₁。',
      steps: ['确认本系统使用 row-vector convention。', '计算 ρ₁=ρ₀P。', '[1,0,0] 只保留 P 的第一行。'],
      answer: 'ρ₁=[0.4,0.6,0]'
    },
    guidedPracticeIds: ['mk-q3'],
    independentPracticeIds: ['mk-q2', 'mk-q5', 'mk-q7'],
    summary: ['状态是系统在某一步可能处于的情况。', '转移矩阵每一行概率和必须为 1。', '本课程统一使用 ρP，而不是 Pρ。', '平稳分布既要满足 ρP=ρ，也要归一化。', 'regular/ergodic 的长期直觉是起点影响消失。', 'Perron-Frobenius 支撑正平稳分布和 eigenvalue 1 的理论背景。'],
    nextLessonId: null,
    checklist: ['状态是什么', '转移概率是什么', '转移矩阵是什么', '为什么每一行概率之和为 1', '初始概率分布', '一步预测', '多步预测', '平稳分布', '解方程 ρP = ρ', '概率归一化', 'regular / ergodic', 'Perron-Frobenius']
  }
};

export function getLessonByModule(moduleId) {
  return lessons[moduleId] || null;
}
