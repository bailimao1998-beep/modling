import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';
import { currentPath, initRouter, renderRoute } from './router/router.js';
import { sidebar, mobileBottomNav, bindSidebar } from './components/sidebar.js';
import { appHeader, bindAppHeader, syncAppHeader } from './components/appHeader.js';

const app = document.querySelector('#app');

app.innerHTML = `
  <div class="app-shell">
    ${sidebar()}
    <div class="workspace">
      ${appHeader()}
      <main class="main-content" id="route-view"></main>
    </div>
    ${mobileBottomNav()}
  </div>`;

bindSidebar();
bindAppHeader();
initRouter(document.querySelector('#route-view'));

window.addEventListener('study-state-change', () => {
  if ((location.hash || '').startsWith('#/dashboard')) renderRoute(document.querySelector('#route-view'));
  else syncAppHeader(currentPath());
});
