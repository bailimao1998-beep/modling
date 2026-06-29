import { icon } from './icon.js';

export const navItems = [
  { href: '#/dashboard', path: '/dashboard', label: '首页', icon: 'layout-dashboard' },
  { href: '#/roadmap', path: '/roadmap', label: '考前路线', icon: 'map' },
  { href: '#/coverage', path: '/coverage', label: '知识覆盖', icon: 'scan-search' },
  { href: '#/courses', path: '/courses', label: '课程', icon: 'book-open' },
  { href: '#/labs', path: '/labs', label: '互动实验', icon: 'flask-conical' },
  { href: '#/practice', path: '/practice', label: '练习', icon: 'list-checks' },
  { href: '#/mistakes', path: '/mistakes', label: '错题本', icon: 'notebook-tabs' },
  { href: '#/exam', path: '/exam', label: '模拟考试', icon: 'timer' },
  { href: '#/proofs', path: '/proofs', label: '证明训练', icon: 'graduation-cap' },
  { href: '#/reports', path: '/reports', label: '学习报告', icon: 'chart-no-axes-combined' },
  { href: '#/settings', path: '/settings', label: '数据管理', icon: 'settings' }
];

function navLinks(className = 'nav-list') {
  return `<nav class="${className}" aria-label="主导航">${navItems.map((item) => `
    <a class="nav-link" data-nav-path="${item.path}" href="${item.href}">
      <span class="nav-icon">${icon(item.icon)}</span><span>${item.label}</span>
    </a>`).join('')}</nav>`;
}

export function sidebar() {
  return `<aside class="sidebar" data-sidebar>
    <div class="brand"><span class="brand-mark">MT</span><div><strong>Modelling and Tools</strong><small>F11MT 复习系统</small></div></div>
    ${navLinks()}
    <div class="sidebar-note"><span>${icon('hard-drive')}</span><div><strong>仅保存在此设备</strong><small>无需登录，学习记录存入浏览器。</small></div></div>
  </aside>`;
}

export function mobileBottomNav() {
  const primary = navItems.filter((item) => ['/dashboard', '/roadmap', '/courses', '/practice', '/mistakes'].includes(item.path));
  return `<nav class="mobile-bottom-nav" aria-label="手机导航">${primary.map((item) => `
    <a data-nav-path="${item.path}" href="${item.href}">${icon(item.icon)}<span>${item.label}</span></a>`).join('')}</nav>`;
}

export function bindSidebar() {
  const sidebarEl = document.querySelector('[data-sidebar]');
  document.querySelector('[data-toggle-sidebar]')?.addEventListener('click', () => sidebarEl?.classList.toggle('is-open'));
  document.querySelectorAll('.nav-link').forEach((link) => link.addEventListener('click', () => sidebarEl?.classList.remove('is-open')));
}

export function syncNavigation(pathname) {
  document.querySelectorAll('[data-nav-path]').forEach((link) => {
    const active = link.dataset.navPath === pathname || (pathname === '/lesson' && link.dataset.navPath === '/courses');
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}
