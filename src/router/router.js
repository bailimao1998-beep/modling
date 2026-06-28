import { renderDashboard } from '../pages/dashboard.js';
import { renderCourses, bindCoursesPage } from '../pages/courses.js';
import { renderLesson, bindLessonPage } from '../pages/lesson.js';
import { renderLabs, bindLabsPage } from '../pages/labs.js';
import { renderPractice, bindPracticePage } from '../pages/practice.js';
import { renderMistakes, bindMistakesPage } from '../pages/mistakes.js';
import { renderExam, bindExamPage } from '../pages/exam.js';
import { renderReports, bindReportsPage } from '../pages/reports.js';
import { syncAppHeader } from '../components/appHeader.js';
import { syncNavigation } from '../components/sidebar.js';
import { refreshIcons } from '../components/icon.js';

const routes = {
  '/dashboard': { render: renderDashboard, bind: () => {} },
  '/courses': { render: renderCourses, bind: bindCoursesPage },
  '/lesson': { render: renderLesson, bind: bindLessonPage },
  '/labs': { render: renderLabs, bind: bindLabsPage },
  '/practice': { render: renderPractice, bind: bindPracticePage },
  '/mistakes': { render: renderMistakes, bind: bindMistakesPage },
  '/exam': { render: renderExam, bind: bindExamPage },
  '/reports': { render: renderReports, bind: bindReportsPage }
};

export function currentPath() {
  const hash = location.hash || '#/dashboard';
  return hash.replace('#', '').split('?')[0] || '/dashboard';
}

export function renderRoute(target) {
  const pathname = currentPath();
  const route = routes[pathname] || routes['/dashboard'];
  target.innerHTML = route.render();
  route.bind();
  syncAppHeader(pathname);
  syncNavigation(pathname);
  refreshIcons(document);
  window.scrollTo({ top: 0, behavior: 'instant' });
}

export function initRouter(target) {
  if (!location.hash) location.hash = '#/dashboard';
  window.addEventListener('hashchange', () => renderRoute(target));
  renderRoute(target);
}
