import { modules } from '../data/modules.js';
import { questions } from '../data/questions.js';
import { coverageMap } from '../data/coverageMap.js';
import { getModuleMasteryPercent } from './analytics.js';
import { addDays, getDueReviews } from './spacedReview.js';
import { todayISO } from '../utils/format.js';

function dueTasks(state, dateISO) {
  return getDueReviews(state, dateISO).slice(0, 3).map((review) => ({
    id: `review-${review.questionId}`,
    kind: 'review',
    title: review.title,
    reason: `${review.nextReviewDate} 到期，先用一次主动回忆巩固步骤。`,
    route: `#/practice?module=${review.module}&question=${review.questionId}`,
    actionLabel: '复习这道题'
  }));
}

function masteryTask(state) {
  const target = [...modules]
    .filter((module) => module.status === 'open')
    .sort((a, b) => getModuleMasteryPercent(state, a) - getModuleMasteryPercent(state, b))[0];
  if (!target) return null;
  const mastery = getModuleMasteryPercent(state, target);
  const easyQuestion = questions.find((question) => question.module === target.id && question.difficulty === 'easy');
  const useLesson = mastery === 0 || !easyQuestion;
  return {
    id: `mastery-${target.id}`,
    kind: 'mastery',
    moduleId: target.id,
    title: `补强 ${target.title}`,
    reason: `当前模块掌握度约 ${mastery}%，完成一项基础任务即可增加有效证据。`,
    route: useLesson ? target.route : `#/practice?module=${target.id}&question=${easyQuestion.id}`,
    actionLabel: useLesson ? '进入课程' : '做一道 easy 题'
  };
}

function coverageTasks(state) {
  const progress = state.progress?.topics || {};
  const tasks = [];
  const highGap = coverageMap.find((item) => item.importance === 'high' && item.status !== 'covered');
  if (highGap) {
    tasks.push({
      id: `coverage-${highGap.id}`,
      kind: 'coverage',
      moduleId: highGap.module,
      title: `补齐高频知识点：${highGap.title}`,
      reason: `覆盖状态为“${highGap.status}”。${highGap.examNote}`,
      route: highGap.lessonRoute || '#/coverage',
      actionLabel: '查看入口'
    });
  }

  const noIndependent = coverageMap.find((item) => {
    const topic = progress[item.topic] || {};
    return topic.lessonSeen && Number(topic.independentCorrectCount || 0) === 0 && item.independentQuestionIds?.length;
  });
  if (noIndependent) {
    tasks.push({
      id: `independent-${noIndependent.id}`,
      kind: 'evidence',
      moduleId: noIndependent.module,
      title: `把“看过”变成掌握：${noIndependent.title}`,
      reason: '你已经接触过这个知识点，但还没有独立题正确证据。',
      route: `#/practice?module=${noIndependent.module}&question=${noIndependent.independentQuestionIds[0]}`,
      actionLabel: '做独立题'
    });
  }

  const pastPaperGap = coverageMap.find((item) => {
    const topic = progress[item.topic] || {};
    return item.source === 'Past Paper 2024-2025' && Number(topic.masteryLevel ?? topic.mastery ?? 0) < 5 && item.examQuestionIds?.length;
  });
  if (pastPaperGap) {
    tasks.push({
      id: `past-paper-${pastPaperGap.id}`,
      kind: 'past-paper',
      moduleId: pastPaperGap.module,
      title: `真题题型未掌握：${pastPaperGap.title}`,
      reason: '这个知识点在 2024-2025 往年卷出现过，但还没有考试掌握证据。',
      route: `#/practice?module=${pastPaperGap.module}&question=${pastPaperGap.examQuestionIds[0]}`,
      actionLabel: '练真题题型'
    });
  }

  const repeatedWrong = coverageMap.find((item) => Number(progress[item.topic]?.recentWrongCount || 0) >= 2);
  if (repeatedWrong) {
    tasks.push({
      id: `wrong-${repeatedWrong.id}`,
      kind: 'wrong-topic',
      moduleId: repeatedWrong.module,
      title: `连续错过：${repeatedWrong.title}`,
      reason: '最近错误次数偏高，先回到小白解释和引导题。',
      route: repeatedWrong.lessonRoute || '#/coverage',
      actionLabel: '回到前置知识'
    });
  }

  return tasks.slice(0, 3);
}

function examTask(state, dateISO) {
  const fullBeta = (state.examHistory || []).find((exam) => exam.mode === 'full-beta');
  if (fullBeta?.at?.slice(0, 10) >= addDays(dateISO, -7)) return null;
  const hasAnyExam = (state.examHistory || []).length > 0;
  return {
    id: 'exam-check',
    kind: 'exam',
    title: hasAnyExam ? '做一次 50 分结构模拟' : '做一次 15 分钟快速测',
    reason: hasAnyExam ? '最近 7 天没有完整结构卷记录，用一套卷检查各部分失分。' : '先用短测建立今天的考试证据，再决定是否做整卷。',
    route: hasAnyExam ? '#/exam?mode=full-beta' : '#/exam?mode=quick',
    actionLabel: hasAnyExam ? '开始 beta 卷' : '开始快速测'
  };
}

function proofTask(state) {
  if ((state.proofHistory || []).length) return null;
  return {
    id: 'proof-first-run',
    kind: 'proof',
    title: '完成一次证明模板训练',
    reason: '目前没有证明训练记录，先记住二次型化为加权平方和的七步结构。',
    route: '#/proofs',
    actionLabel: '进入证明训练'
  };
}

export function generateTodayTasks(state, { dateISO = todayISO() } = {}) {
  return [
    ...dueTasks(state, dateISO),
    ...coverageTasks(state),
    masteryTask(state),
    examTask(state, dateISO),
    proofTask(state)
  ].filter(Boolean);
}
