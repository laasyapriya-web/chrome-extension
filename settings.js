// Theme toggle logic
function setTheme(theme) {
  const body = document.body;
  if (!body) return;
  if (theme === 'dark') {
    body.style.background = 'linear-gradient(135deg, #23272f 0%, #6366f1 100%)';
    body.style.color = '#fff';
    document.querySelectorAll('.container, .section').forEach(el => {
      if (el) {
        el.style.background = 'rgba(30,41,59,0.9)';
        el.style.color = '#fff';
      }
    });
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) themeToggle.textContent = '☀️';
  } else {
    body.style.background = 'linear-gradient(135deg, #ece9f7 0%, #f8f9fb 100%)';
    body.style.color = '#333';
    document.querySelectorAll('.container, .section').forEach(el => {
      if (el) {
        el.style.background = '';
        el.style.color = '';
      }
    });
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) themeToggle.textContent = '🌙';
  }
}
function getTheme() {
  return localStorage.getItem('theme') || 'light';
}
window.addEventListener('DOMContentLoaded', () => {
  try {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const current = getTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        setTheme(next);
      });
      setTheme(getTheme());
    }
    // Add similar guards for other elements as needed
    const saveBtn = document.getElementById('save-settings');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        // ... existing code ...
      });
    }
    // ...repeat for all other DOM access...
  } catch (e) {
    // Handle extension context invalidation or other errors gracefully
    console.warn('Settings initialization error:', e);
  }
}); 