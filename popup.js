// Popup script for the extension
class PopupManager {
  constructor() {
    this.currentTabInfo = null;
    this.timer = null;
    this.init();
  }

  async init() {
    try {
      await this.loadCurrentTabInfo();
      await this.loadTodayStats();
      this.setupEventListeners();
      this.startTimer();
      this.showContent();
    } catch (error) {
      console.error('Error initializing popup:', error);
      this.showError();
    }
  }

  async loadCurrentTabInfo() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getCurrentTabInfo' });
      if (response) {
        this.currentTabInfo = response;
        this.updateTabInfo();
      }
    } catch (error) {
      console.error('Error loading tab info:', error);
    }
  }

  async loadTodayStats() {
    try {
      const timeLogs = await chrome.runtime.sendMessage({ action: 'getTimeLogs' });
      this.updateTodayStats(timeLogs);
    } catch (error) {
      console.error('Error loading today stats:', error);
    }
  }

  updateTabInfo() {
    if (!this.currentTabInfo) return;

    const { domain, isProductive, url } = this.currentTabInfo;
    
    // Update domain
    document.getElementById('domain').textContent = domain;
    
    // Update favicon
    const favicon = document.getElementById('favicon');
    favicon.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
    
    // Update productivity badge
    const badge = document.getElementById('productivity-badge');
    badge.textContent = isProductive ? 'Productive' : 'Unproductive';
    badge.className = `productivity-badge ${isProductive ? 'productive' : 'unproductive'}`;
  }

  updateTodayStats(timeLogs) {
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = timeLogs.filter(log => log.date === today);
    
    let productiveTime = 0;
    let unproductiveTime = 0;
    
    todayLogs.forEach(log => {
      if (log.isProductive) {
        productiveTime += log.duration;
      } else {
        unproductiveTime += log.duration;
      }
    });
    
    // Convert to hours and format
    const formatTime = (ms) => {
      const hours = Math.floor(ms / 3600000);
      const minutes = Math.floor((ms % 3600000) / 60000);
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };
    
    document.getElementById('today-productive').textContent = formatTime(productiveTime);
    document.getElementById('today-unproductive').textContent = formatTime(unproductiveTime);
  }

  startTimer() {
    if (!this.currentTabInfo) return;
    
    this.timer = setInterval(() => {
      this.updateTimer();
    }, 1000);
    
    this.updateTimer();
  }

  updateTimer() {
    if (!this.currentTabInfo || !this.currentTabInfo.isTracking) {
      document.getElementById('timer').textContent = '00:00';
      return;
    }
    
    const duration = this.currentTabInfo.duration;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    
    const timerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timer').textContent = timerText;
  }

  setupEventListeners() {
    // Settings button
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: 'chrome://extensions/?options=' + chrome.runtime.id });
      });
    }
  }

  showContent() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
  }

  showError() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'block';
  }

  cleanup() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    const popup = new PopupManager();
    
    // Cleanup when popup is closed
    window.addEventListener('beforeunload', () => {
      popup.cleanup();
    });

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
  } catch (e) {
    // Handle extension context invalidation or other errors gracefully
    console.warn('Popup initialization error:', e);
  }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateTabInfo') {
    // Refresh tab info when background script updates it
    window.location.reload();
  }
});

// Theme toggle logic
function setTheme(theme) {
  const body = document.body;
  if (!body) return;
  if (theme === 'dark') {
    body.style.background = 'linear-gradient(135deg, #23272f 0%, #6366f1 100%)';
    body.style.color = '#fff';
    document.querySelectorAll('.stat-card, .current-tab').forEach(el => {
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
    document.querySelectorAll('.stat-card, .current-tab').forEach(el => {
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