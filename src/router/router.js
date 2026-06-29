import { renderDashboard } from '../pages/dashboard.js';
import { renderCourses, bindCoursesPage } from '../pages/courses.js';
import { renderLesson, bindLessonPage, cleanupLessonPage } from '../pages/lesson.js';
import { renderLabs, bindLabsPage, cleanupLabsPage } from '../pages/labs.js';
import { renderPractice, bindPracticePage } from '../pages/practice.js';
import { renderMistakes, bindMistakesPage, cleanupMistakesPage } from '../pages/mistakes.js';
import { renderExam, bindExamPage, cleanupExamPage } from '../pages/exam.js';
import { renderReports, bindReportsPage, cleanupReportsPage } from '../pages/reports.js';
import { renderProofs, bindProofsPage } from '../pages/proofs.js';
import { renderSettings, bindSettingsPage } from '../pages/settings.js';
import { renderRoadmap } from '../pages/roadmap.js';
import { syncAppHeader } from '../components/appHeader.js';
import { syncNavigation } from '../components/sidebar.js';
import { refreshIcons } from '../components/icon.js';

const routes = {
  '/dashboard': { render: renderDashboard, bind: () => {} },
  '/courses': { render: renderCourses, bind: bindCoursesPage },
  '/lesson': { render: renderLesson, bind: bindLessonPage, cleanup: cleanupLessonPage },
  '/labs': { render: renderLabs, bind: bindLabsPage, cleanup: cleanupLabsPage },
  '/practice': { render: renderPractice, bind: bindPracticePage },
  '/mistakes': { render: renderMistakes, bind: bindMistakesPage, cleanup: cleanupMistakesPage },
  '/exam': { render: renderExam, bind: bindExamPage, cleanup: cleanupExamPage },
  '/proofs': { render: renderProofs, bind: bindProofsPage },
  '/roadmap': { render: renderRoadmap, bind: () => {} },
  '/reports': { render: renderReports, bind: bindReportsPage, cleanup: cleanupReportsPage },
  '/settings': { render: renderSettings, bind: bindSettingsPage }
};

let activeRoute = null;

export function currentPath() {
  const hash = location.hash || '#/dashboard';
  return hash.replace('#', '').split('?')[0] || '/dashboard';
}

export function renderRoute(target) {
  activeRoute?.cleanup?.();
  const pathname = currentPath();
  const route = routes[pathname] || routes['/dashboard'];
  target.innerHTML = route.render();
  route.bind();
  activeRoute = route;
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
