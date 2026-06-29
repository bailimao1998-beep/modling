import { modules } from '../data/modules.js';
import { questions } from '../data/questions.js';
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
    masteryTask(state),
    examTask(state, dateISO),
    proofTask(state)
  ].filter(Boolean);
}
