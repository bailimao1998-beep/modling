export const errorTypes = [
  { id: '概念不理解', label: '概念不理解', description: '定义或符号含义还不清楚。' },
  { id: '公式选择错误', label: '公式选择错误', description: '识别了题型，但选择了不适用的公式。' },
  { id: '矩阵乘法错误', label: '矩阵乘法错误', description: '行乘列或矩阵尺寸判断有误。' },
  { id: '行列式错误', label: '行列式错误', description: '展开、符号或 2×2 公式使用有误。' },
  { id: '计算错误', label: '计算错误', description: '方法正确，但数值运算出现失误。' },
  { id: '转移矩阵方向错误', label: '转移矩阵方向错误', description: '混淆了 ρP 与 Pρ 或行列含义。' },
  { id: '概率和不等于 1', label: '概率和不等于 1', description: '概率行或分布没有满足归一化。' },
  { id: '平稳分布未归一化', label: '平稳分布未归一化', description: '比例解没有转换为概率分布。' }
];
