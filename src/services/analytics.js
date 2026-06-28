import { addDays, getDueReviews } from './spacedReview.js';

function attemptsList(state) {
  return Object.values(state?.attempts || {}).flat();
}

export function getErrorSummary(state, dateISO) {
  const mistakes = state?.mistakes || [];
  const byType = {};
  const byTopic = {};
  mistakes.forEach((mistake) => {
    const errorType = mistake.errorType || '其他错误';
    const topic = mistake.topic || '未分类';
    byType[errorType] = (byType[errorType] || 0) + 1;
    byTopic[topic] = (byTopic[topic] || 0) + 1;
  });
  return {
    byType,
    byTopic,
    due: mistakes.filter(
      (mistake) => !mistake.understoodAt && mistake.nextReviewDate && mistake.nextReviewDate <= dateISO
    )
  };
}

export function getSevenDayActivity(state, endDateISO) {
  const dates = Array.from({ length: 7 }, (_, index) => addDays(endDateISO, index - 6));
  const counts = Object.fromEntries(dates.map((date) => [date, 0]));
  attemptsList(state).forEach((attempt) => {
    const date = attempt.at?.slice(0, 10);
    if (date in counts) counts[date] += 1;
  });
  return dates.map((date) => ({ date, count: counts[date] }));
}

export function getModuleEvidence(state, moduleId) {
  const attempts = attemptsList(state)
    .filter((attempt) => attempt.module === moduleId)
    .sort((a, b) => String(b.at).localeCompare(String(a.at)));
  const latest = attempts[0];
  if (!latest) return { count: 0, latest: null, rate: 0 };
  const earned = attempts.reduce((sum, attempt) => sum + Number(attempt.score || 0), 0);
  const possible = attempts.reduce((sum, attempt) => sum + Number(attempt.maxScore || 0), 0);
  return { count: attempts.length, latest, rate: possible ? Math.round((earned / possible) * 100) : 0 };
}

export function getModuleMasteryPercent(state, module) {
  const topicIds = module.topics || [];
  if (!topicIds.length) return 0;
  const total = topicIds.reduce(
    (sum, topicId) => sum + Number(state?.progress?.topics?.[topicId]?.mastery || 0),
    0
  );
  return Math.round((total / (topicIds.length * 5)) * 100);
}

export function getScoreEstimate(state, modules) {
  return modules.map((module) => {
    const masteryPercent = getModuleMasteryPercent(state, module);
    const maxMarks = Number(module.examWeight || 0);
    return {
      moduleId: module.id,
      title: module.title,
      maxMarks,
      masteryPercent,
      estimatedMarks: Number(((masteryPercent / 100) * maxMarks).toFixed(1))
    };
  });
}

export function getStudyRecommendation(state, modules, questions, dateISO) {
  const due = getDueReviews(state, dateISO);
  if (due.length) {
    return {
      kind: 'review',
      title: due[0].title,
      reason: `这项内容已到复习日期，先巩固可以避免刚学会的步骤变模糊。`,
      route: `#/practice?module=${due[0].module}&question=${due[0].questionId}`
    };
  }

  const openModules = modules.filter((module) => module.status === 'open');
  const target = [...openModules].sort(
    (a, b) => getModuleMasteryPercent(state, a) - getModuleMasteryPercent(state, b)
  )[0];
  const targetQuestion = questions.find((question) => question.module === target?.id);
  return {
    kind: 'lesson',
    title: target?.title || '矩阵基础',
    reason: target
      ? '这是当前开放模块中掌握证据最少的一项，适合从课程演示和一道基础题开始。'
      : '从一个短课程和一道基础题开始建立今天的学习记录。',
    route: targetQuestion ? `#/lesson?module=${target.id}` : '#/courses'
  };
}

export function getWeakestModule(state, modules) {
  const available = modules.filter((module) => module.topics?.length);
  return [...available].sort(
    (a, b) => getModuleMasteryPercent(state, a) - getModuleMasteryPercent(state, b)
  )[0] || null;
}
