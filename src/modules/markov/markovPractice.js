import { getQuestionsByModule } from '../../data/questions.js';

export function getMarkovPracticeQuestions() {
  return getQuestionsByModule('markov');
}
