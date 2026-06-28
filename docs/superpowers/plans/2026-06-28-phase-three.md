# Phase Three Graph And Probability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add stable graph theory and probability study modules while preserving all phase-two behavior.

**Architecture:** Pure calculation and progress services are tested before UI work. Existing data-driven lessons and labs are extended with graph and probability adapters. Router cleanup hooks own visualization lifecycle.

**Tech Stack:** Vite, native ES modules, math.js, Chart.js, Cytoscape.js, KaTeX, localStorage, Node assert tests.

---

### Task 1: Stability and review progress

**Files:** `src/data/modules.js`, `src/services/progress.js`, `src/components/questionCard.js`, `src/pages/mistakes.js`, `tests/phase-three.test.js`

- [ ] Test module title lookup and due-review event selection.
- [ ] Implement `getModuleTitle` and `applyQuestionProgress`.
- [ ] Replace page-specific module labels and question-card event branching.
- [ ] Verify wrong answers lower mastery and reschedule for the next day.

### Task 2: Graph calculation core and lab

**Files:** `src/modules/graph/graphMath.js`, `src/modules/graph/graphLab.js`, `src/modules/graph/graphLesson.js`, `src/modules/graph/graphPractice.js`, `tests/phase-three.test.js`

- [ ] Test K4 adjacency, degree, Laplacian, `A^4[1,3] = 20`, cofactors, and 16 spanning trees.
- [ ] Implement immutable graph calculations.
- [ ] Build the persistent-edge Cytoscape editor, matrix panels, walks controls, cofactor controls, and reset action.

### Task 3: Probability calculation core and lab

**Files:** `src/modules/probability/probabilityMath.js`, `src/modules/probability/probabilityLab.js`, `src/modules/probability/probabilityLesson.js`, `src/modules/probability/probabilityPractice.js`, `tests/phase-three.test.js`

- [ ] Test interval integration on each piece and across `x=1`.
- [ ] Test `E[X]=1`, `E[X^2]=7/6`, and `Var(X)=1/6`.
- [ ] Build the density chart, shaded interval, step explanation, and moment actions.

### Task 4: Courses, questions, and beta exam

**Files:** `src/data/topics.js`, `src/data/lessons.js`, `src/data/questions.js`, `src/data/examTemplates.js`, `src/pages/lesson.js`, `src/pages/labs.js`, `src/pages/exam.js`

- [ ] Open graph and probability module routes and lesson topics.
- [ ] Add two ten-part lesson records and connect their interactive labs.
- [ ] Add eight graph and eight probability practice questions.
- [ ] Add five stepped beta questions totaling 50 marks and open the beta exam mode.

### Task 5: Visualization lifecycle and responsive styling

**Files:** `src/router/router.js`, `src/modules/markov/markovSimulator.js`, `src/pages/mistakes.js`, `src/pages/reports.js`, `src/styles/components.css`, `src/styles/layout.css`

- [ ] Add cleanup hooks for lesson, labs, mistakes, reports, and exam.
- [ ] Destroy Chart.js and Cytoscape instances before rerender or route exit.
- [ ] Add responsive graph/probability lab grids and horizontally scrollable matrices.

### Task 6: Documentation, verification, and publish

**Files:** `README.md`, `package.json`

- [ ] Update phase-three features and remaining scope.
- [ ] Run all tests and the production build.
- [ ] Verify every route, both lab calculations, repeat navigation, and 390px layout in the browser.
- [ ] Commit as `Add graph and probability study labs` and push `origin main`.
