/* =========================================================
   theme-change.js — Light / Dark theme switcher
   Persists choice in localStorage; respects OS on first visit;
   follows OS preference while user hasn't chosen.
   ========================================================= */
(function () {
  'use strict';

  const STORAGE_KEY = 'hbm-theme';
  const html = document.documentElement;
  const checkbox = document.getElementById('checkbox');
  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  function stored() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v === 'dark' || v === 'light' ? v : null;
    } catch (e) { return null; }
  }

  function preferred() {
    return stored() || (mq.matches ? 'dark' : 'light');
  }

  function apply(theme) {
    html.setAttribute('data-theme', theme);
    if (checkbox) checkbox.checked = theme === 'dark';
    const meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#121212' : '#0A2241');
    document.dispatchEvent(new CustomEvent('hbm:themechange', { detail: { theme: theme } }));
  }

  // Apply on first load
  apply(preferred());

  // Toggle switch
  if (checkbox) {
    checkbox.addEventListener('change', function () {
      const next = this.checked ? 'dark' : 'light';
      apply(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    });
  }

  // Follow OS preference only when user hasn't picked a theme manually
  mq.addEventListener('change', function (e) {
    if (!stored()) apply(e.matches ? 'dark' : 'light');
  });

  // Public API
  window.HBMTheme = {
    apply: apply,
    get: preferred,
    reset: function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      apply(preferred());
    }
  };
})();