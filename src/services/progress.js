import { makeReviewItem } from './spacedReview.js';
import { todayISO } from '../utils/format.js';

export const masteryLabels = ['未学习', '已接触', '初步理解', '基本掌握', '稳定掌握', '考试掌握'];

export function getNextMastery(current = 0, evidence) {
  const event = evidence?.event;
  if (event === 'lesson-complete') return Math.max(current, 1);
  if (event === 'guided-correct') return Math.max(current, 2);
  if (event === 'independent-correct') return Math.max(current, 3);
  if (event === 'review-correct-48h') return Math.max(current, 4);
  if (event === 'exam-correct') return Math.max(current, 5);
  if (event === 'wrong') return Math.max(0, current - 1);
  return current;
}

export function updateTopicMastery(state, topic, evidence) {
  const current = state.progress?.topics?.[topic]?.mastery || 0;
  const mastery = getNextMastery(current, evidence);
  state.progress.topics[topic] = {
    ...(state.progress.topics[topic] || {}),
    mastery,
    lastEvent: evidence.event,
    updatedAt: new Date().toISOString()
  };
  return mastery;
}

export function getAttemptMasteryEvent(question, result, existingReview, dateISO = todayISO()) {
  if (!result.correct) return 'wrong';
  if (existingReview?.nextReviewDate && existingReview.nextReviewDate <= dateISO) {
    return 'review-correct-48h';
  }
  if (question.difficulty === 'exam') return 'exam-correct';
  if (question.type === 'stepped') return 'guided-correct';
  return 'independent-correct';
}

export function applyQuestionProgress(state, question, result, dateISO = todayISO()) {
  state.reviewSchedule ||= {};
  const existingReview = state.reviewSchedule[question.id] || null;
  const event = getAttemptMasteryEvent(question, result, existingReview, dateISO);
  state.reviewSchedule[question.id] = makeReviewItem(question, result.correct, existingReview, dateISO);
  const mastery = updateTopicMastery(state, question.topic, { event });
  return { event, mastery, reviewItem: state.reviewSchedule[question.id] };
}

export function getModuleMastery(state, moduleId) {
  const topicEntries = Object.entries(state.progress?.topics || {}).filter(([topic]) =>
    topic.startsWith(`${moduleId}:`)
  );
  if (!topicEntries.length) return 0;
  const average =
    topicEntries.reduce((total, [, value]) => total + Number(value.mastery || 0), 0) / topicEntries.length;
  return Math.round(average);
}

export function getOverallMastery(state, moduleList = []) {
  if (moduleList.length) {
    const topicIds = moduleList.flatMap((module) => module.topics || []);
    if (!topicIds.length) return 0;
    const total = topicIds.reduce(
      (sum, topicId) => sum + Number(state.progress?.topics?.[topicId]?.mastery || 0),
      0
    );
    return Math.round((total / (topicIds.length * 5)) * 100);
  }
  const values = Object.values(state.progress?.topics || {});
  if (!values.length) return 0;
  const average = values.reduce((total, item) => total + Number(item.mastery || 0), 0) / values.length;
  return Math.round((average / 5) * 100);
}
