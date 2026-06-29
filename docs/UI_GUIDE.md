# UI Guide

## 设计目标

F11MT 复习系统的界面目标是清爽、安静、学术感强，适合每天长时间复习。页面优先服务考试训练、错题复盘和数学阅读，不追求花哨动画，也不使用儿童化视觉。

## 颜色系统

- Background: `--color-bg` / `#F7F8FA`
- Surface: `--color-surface` / `#FFFFFF`
- Surface soft: `--color-surface-soft` / `#F9FAFB`
- Text: `--color-text` / `#1F2937`
- Muted: `--color-muted` / `#6B7280`
- Border: `--color-border` / `#E5E7EB`
- Primary: `--color-primary` / `#3B82F6`
- Success: `--color-success` / `#10B981`
- Danger: `--color-danger` / `#EF4444`
- Warning: `--color-warning` / `#F59E0B`

颜色用于表达状态时必须配合文字，例如“正确”“错误”“待复习”“已标记”，不能只靠颜色区分。

## 按钮层级

- Primary button: 页面主行动，例如开始练习、提交考试、导出数据。
- Secondary button: 次行动，例如进入课程、重做题目、模拟下一步。
- Ghost / icon button: 辅助操作，例如展开、移动证明步骤、打开侧边栏。
- Danger button: 只用于重置学习数据等高风险操作。
- Disabled / loading-like state: 保持可识别但降低透明度，不改变布局。

所有按钮需要 `hover`、`focus-visible` 和触控尺寸，手机端最低高度为 44px。

## 卡片规范

- 普通 card 用白色表面、浅边框和 `--shadow-card`。
- highlighted card 用浅蓝背景，强调当前推荐或目标。
- warning card 用浅黄背景，承载考试说明或注意事项。
- success result card 用浅绿背景，展示正确答案、已掌握、导入成功。
- wrong result card 用浅红背景，展示错误反馈、导入失败、风险提示。

卡片 hover 只允许轻微抬升，移动距离控制在 1px 左右。

## 状态反馈规范

- Correct: 柔和绿色，文字明确说明正确原因。
- Wrong: 柔和红色，先提示错误位置或下一步，不直接泄露完整答案。
- Hint: 蓝色或中性背景，按层级逐步提供信息。
- Explanation: 中性卡片或浅色分区，适合阅读。
- Exam warning / past paper notice: 使用 `section-note` 和 `exam-training-note`，语气正式，不干扰答题。

结果框使用 120ms 到 180ms 的轻微进入动画，不在考试页制造大幅位移。

## 考试页规范

- 模式选择卡必须清楚区分快速测、模块测、50 分结构卷和真题训练 beta。
- 真题训练 beta 使用 source / past-paper 说明，明确“训练步骤，不代表学校正式评分”。
- 答题页 timer 要醒目但不刺眼。
- 题目导航必须清楚显示已答、未答、标记状态，并保持 hash router 稳定。
- 提交结果优先展示总分，其次展示模块分、错误类型和推荐复习。

## 移动端规范

- 重点宽度：390px、430px、768px。
- 页面不可横向溢出。
- 底部导航固定为五项：首页、考前路线、课程、练习、错题本。
- 矩阵、图表、表格允许局部横向滚动，但不能撑开整页。
- 考试题卡、练习卡和错题卡在手机端单列显示。
- 按钮和输入框保持适合手指点击的高度。

## 不要做的事

- 不要加入花哨动画或大幅位移。
- 不要为了视觉效果牺牲题目可读性。
- 不要改变题目答案、分值或 grading 判分逻辑。
- 不要让矩阵输入撑破移动端页面。
- 不要只用颜色表达正确、错误、标记或待复习状态。
- 不要把考试页做成营销页；稳定和清晰优先。
