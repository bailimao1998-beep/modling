import { todayISO } from '../utils/format.js';
import { getNextReviewDate } from './spacedReview.js';

export const STORAGE_KEY = 'f11mt-study-state-v1';

const defaultState = {
  version: 2,
  progress: {
    topics: {},
    completedQuestions: [],
    completedCount: 0
  },
  mistakes: [],
  reviewSchedule: {},
  attempts: {},
  examHistory: [],
  understoodMistakes: [],
  lastSession: null
};

export function createDefaultState() {
  return structuredClone(defaultState);
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw);
    return {
      ...createDefaultState(),
      ...parsed,
      progress: { ...createDefaultState().progress, ...(parsed.progress || {}) },
      reviewSchedule: parsed.reviewSchedule || {},
      mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [],
      attempts: parsed.attempts || {},
      examHistory: Array.isArray(parsed.examHistory) ? parsed.examHistory : [],
      understoodMistakes: Array.isArray(parsed.understoodMistakes) ? parsed.understoodMistakes : []
    };
  } catch (error) {
    console.warn('学习进度读取失败，已使用默认状态。', error);
    return createDefaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function mutateState(mutator) {
  const state = loadState();
  mutator(state);
  state.lastSession = {
    action: '学习记录已更新',
    at: new Date().toISOString()
  };
  saveState(state);
  window.dispatchEvent(new CustomEvent('study-state-change'));
  return state;
}

export function recordQuestionAttempt(question, result, userAnswer) {
  return mutateState((state) => {
    const attempt = {
      questionId: question.id,
      module: question.module,
      topic: question.topic,
      correct: result.correct,
      score: result.score,
      maxScore: result.maxScore,
      errorType: result.errorType || null,
      at: new Date().toISOString()
    };
    state.attempts[question.id] = [...(state.attempts[question.id] || []), attempt];
    if (result.correct && !state.progress.completedQuestions.includes(question.id)) {
      state.progress.completedQuestions.push(question.id);
      state.progress.completedCount = state.progress.completedQuestions.length;
    }
    if (!result.correct) {
      state.mistakes.unshift({
        id: `${question.id}-${Date.now()}`,
        questionId: question.id,
        title: question.title,
        module: question.module,
        topic: question.topic,
        userAnswer,
        correctAnswer: question.answer,
        correctThinking: question.explanation,
        wrongStep: result.firstWrongStep || '整题',
        errorType: result.errorType || question.errorTags?.[0] || '计算错误',
        errorTime: new Date().toISOString(),
        reviewCount: 0,
        nextReviewDate: getNextReviewDate(todayISO(), 0, false)
      });
    }
  });
}
