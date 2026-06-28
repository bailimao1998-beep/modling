import { todayISO } from '../utils/format.js';

const intervals = [2, 4, 8, 15];

export function addDays(dateISO, days) {
  const [year, month, day] = dateISO.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function getNextReviewDate(baseDate = todayISO(), successCount = 0, correct = true) {
  if (!correct) return addDays(baseDate, 1);
  const interval = intervals[Math.min(successCount, intervals.length - 1)];
  return addDays(baseDate, interval);
}

export function getDueReviews(state, dateISO = todayISO()) {
  return Object.values(state.reviewSchedule || {}).filter((item) => item.nextReviewDate <= dateISO);
}

export function makeReviewItem(question, correct, existing = null, baseDate = todayISO()) {
  const successCount = correct ? (existing?.successCount || 0) + 1 : 0;
  return {
    questionId: question.id,
    module: question.module,
    topic: question.topic,
    title: question.title,
    successCount,
    nextReviewDate: getNextReviewDate(baseDate, successCount - 1, correct),
    updatedAt: new Date().toISOString()
  };
}
