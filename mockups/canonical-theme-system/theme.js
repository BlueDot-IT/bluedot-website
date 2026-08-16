(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const themeColor = document.getElementById('theme-color');

  if (!toggle) return;

  const label = toggle.querySelector('.theme-toggle-label');

  const applyTheme = (theme) => {
    const isLight = theme === 'light';
    root.dataset.theme = isLight ? 'light' : 'dark';
    if (label) label.textContent = isLight ? 'Dark' : 'Light';
    toggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    toggle.title = isLight ? 'Switch to dark theme' : 'Switch to light theme';
    toggle.setAttribute('aria-pressed', String(isLight));
    if (themeColor) themeColor.content = isLight ? '#f7f7f5' : '#030405';
    try { window.localStorage.setItem('bluedot-home-theme', isLight ? 'light' : 'dark'); } catch (_) {}
  };

  applyTheme(root.dataset.theme === 'light' ? 'light' : 'dark');
  toggle.addEventListener('click', () => applyTheme(root.dataset.theme === 'light' ? 'dark' : 'light'));
})();
