# Modelling and Tools Study

一个面向 Heriot-Watt University F11MT Modelling and Tools 课程的本地互动复习系统。项目帮助数学基础较弱的学生通过知识地图、可视化实验、分步骤练习、错题记录和间隔复习建立考试所需的稳定解题步骤。

第六阶段补齐动态系统与递推关系课程、实验室、题库和模拟卷结构。矩阵、递推、图论、概率论、马尔可夫链五大模块现已全部开放。

## 本地使用

```bash
npm ci
npm run dev
```

打开终端显示的本地地址，通常为 `http://localhost:5173/`。开发模式继续使用根路径，不受 GitHub Pages base 配置影响。

生产构建与预览：

```bash
npm run build
npm run preview
```

完整发布验收见 [`docs/ACCEPTANCE_CHECKLIST.md`](docs/ACCEPTANCE_CHECKLIST.md)。

运行核心逻辑测试：

```bash
npm test
```

## 页面

- **学习首页**：今日建议、总体进度、五大模块、到期复习和考试得分参考。
- **课程**：模块目录、知识地图，以及五大模块的十段式互动课程。
- **互动实验**：矩阵乘法、动态系统、K4 图论、三角形概率密度和马尔可夫天气五个可操作实验室。
- **练习**：按模块、难度、错误类型和练习记录筛选，支持单选、数值、矩阵和分步骤题。
- **错题本**：错误统计、今日复习、高频知识点、重做、复习记录和“已理解”状态。
- **模拟考试**：15 分钟快速测、30 分钟模块测、50 分结构模拟卷 beta、计时、题目标记和步骤分。
- **学习报告**：模块掌握度、近 7 天练习、错误分布和薄弱模块建议。

## 技术栈

- Vite + 原生 HTML、CSS、JavaScript 与 ES Modules
- KaTeX：数学公式
- math.js：矩阵、行列式和基础数学运算
- Chart.js：学习报告、错题、概率和动态系统图表
- Cytoscape.js：马尔可夫状态图与 K4 图编辑器
- Lucide：界面图标
- localStorage：本地进度、错题、复习计划和考试历史

## 项目结构

```text
src/
  components/     通用界面、公式、题目卡片和知识地图
  data/           modules、topics、lessons、questions、examTemplates、errorTypes
  modules/        矩阵、递推、图论、概率论与马尔可夫互动模块
  pages/          Dashboard、Courses、Lesson、Labs、Practice、Mistakes、Exam、Reports
  router/         Hash 路由
  services/       存储、判分、掌握度、筛选、分析和间隔复习
  styles/         设计令牌、应用布局和组件样式
  utils/          数学、校验和格式化工具
tests/            核心逻辑、学习分析、数学与阶段回归测试
docs/             阶段设计记录与发布验收清单
```

## 学习数据

学习状态保存在浏览器的 `f11mt-study-state-v1` localStorage key 中。当前兼容的 v2 数据结构会继续读取旧记录，不需要手动迁移。异常或不完整数据会回退到安全默认值。

掌握度不会因浏览课程直接升高到“掌握”：课程接触、引导题、独立题、间隔复习和限时考试分别提供不同等级的证据。复习间隔为答对后 2、4、8、15 天，答错后次日重做。

到期复习题答对后会触发 `review-correct-48h`，将对应知识点推进到“稳定掌握”；答错则降低一级并安排次日重做。

## 第二阶段完成内容

- 统一设计变量、稳定桌面布局和手机底部导航。
- 五模块 Dashboard、课程目录与知识地图。
- 图论 9 个主题和概率论 8 个主题的目录介绍。
- 矩阵与马尔可夫课程的固定十段结构。
- 独立 Labs 页面和三栏天气模拟器。
- 四维练习筛选与分步骤即时反馈。
- 错题统计、重做、理解状态和到期复习。
- 多模式模拟考试和学习报告图表。
- 数据驱动的考试模板、错误类型和复习元数据。

## 第三阶段完成内容

- 图论与概率论从目录预告升级为可学习模块。
- 图论课程覆盖邻接矩阵、degree matrix、Laplacian、`A^k` walks 和 Matrix-tree theorem。
- K4 图论实验室支持点击边、同步 A/D/L、计算 `(A^4)13=20` 和 16 棵生成树。
- 概率课程覆盖分段密度、区间积分、`E[X]`、`E[X²]` 与 `Var(X)`。
- 三角形密度实验室支持区间阴影、跨分段积分，并给出 `E[X]=1`、`E[X²]=7/6`、`Var(X)=1/6`。
- 新增 8 道图论题、8 道概率题，以及五部分共 50 分的结构模拟卷 beta。
- 修复错题本模块名硬编码，并闭合到期复习与掌握度更新逻辑。
- 为 Markov、概率、错题和报告图表增加路由卸载清理，避免重复实例。

## 第四、五阶段完成内容

- 页面内滚动统一使用 button + `scrollIntoView`，不会污染 hash router 路径。
- GitHub Actions CI 在 push 和 pull request 时执行 `npm ci`、`npm test` 与 `npm run build`。
- 对当时的全部页面、四个实验室、四类练习、错题流程、三种考试和报告图表做真实浏览器验收。
- 修复空白数值答案被 JavaScript 转换为 0 后意外得分的问题。
- 升级到 `mathjs 15.2.0`，消除已知 high 级依赖审计问题。
- 新增发布验收清单和 `/modling/` GitHub Pages 构建 base。

## 第六阶段完成内容

- 动态系统与递推关系从目录预告升级为第五个可学习模块。
- 课程覆盖离散时间、一阶与二阶递推、初始条件、状态向量、矩阵乘方、特征值和长期行为直觉。
- Logistic map 实验室支持修改 `r`、`x₀`、步数，显示折线图、数值表和行为提示。
- 二阶递推实验支持从 `y₀=[1,0]^T` 逐步计算到 `x₆=-8`，同步展示矩阵乘法过程。
- 新增 `r-q1` 至 `r-q10`，覆盖单选、数值、矩阵和分步骤题。
- 50 分 beta 卷第 1 题改为递推关系与矩阵形式，共 10 分。
- Dashboard、Courses、Practice 和 Reports 通过数据层自动接入第五个开放模块。

## 部署到 GitHub Pages

仓库名为 `modling`，生产构建资源路径已配置为 `/modling/`：

```bash
npm ci
npm test
npm run deploy:build
npm run preview
```

预览时访问终端给出的 `/modling/` 地址。部署前，在 GitHub 仓库 `Settings > Pages` 中将 Source 设为 `GitHub Actions`。

当前仓库尚未启用 Pages，因此本阶段没有加入会在 `main` 推送后立即尝试部署的 workflow，避免制造预期失败。启用 Pages 后可加入 GitHub 官方的 `configure-pages`、`upload-pages-artifact` 和 `deploy-pages` workflow；现有 CI 会继续独立检查测试和构建。

## 后续计划

- 支持复杂自由文本证明题的自动评分。
- 完成严格计时、完整说明与打印答题册的两小时考试体验。
- 增加学习数据导出、导入和重置工具。
- 为大体积数学与图表依赖增加按路由加载。
- 启用 GitHub Pages 后加入自动部署 workflow。
