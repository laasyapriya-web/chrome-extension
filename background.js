// Background script for time tracking
class TimeTracker {
  constructor() {
    this.currentTab = null;
    this.startTime = null;
    this.timer = null;
    this.isTracking = false;
    
    this.productiveDomains = [
      'github.com', 'stackoverflow.com', 'developer.mozilla.org',
      'medium.com', 'dev.to', 'css-tricks.com', 'smashingmagazine.com',
      'codepen.io', 'jsfiddle.net', 'replit.com', 'codesandbox.io',
      'leetcode.com', 'hackerrank.com', 'codewars.com', 'exercism.io',
      'freecodecamp.org', 'theodinproject.com', 'udemy.com', 'coursera.org',
      'edx.org', 'pluralsight.com', 'frontendmasters.com', 'egghead.io',
      'youtube.com', 'vimeo.com', 'twitch.tv', 'discord.com', 'slack.com',
      'notion.so', 'evernote.com', 'trello.com', 'asana.com', 'jira.com',
      'confluence.com', 'google.com', 'bing.com', 'duckduckgo.com',
      'wikipedia.org', 'stackexchange.com', 'reddit.com/r/programming',
      'reddit.com/r/webdev', 'reddit.com/r/javascript', 'reddit.com/r/reactjs'
    ];
    
    this.init();
  }

  init() {
    // Listen for tab updates
    chrome.tabs.onActivated.addListener(this.handleTabActivated.bind(this));
    chrome.tabs.onUpdated.addListener(this.handleTabUpdated.bind(this));
    chrome.tabs.onRemoved.addListener(this.handleTabRemoved.bind(this));
    
    // Listen for extension messages
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    
    // Initialize with current active tab
    this.getCurrentActiveTab();
    
    // Start tracking immediately
    this.startTracking();
  }

  async getCurrentActiveTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        this.currentTab = tab;
        this.startTracking();
      }
    } catch (error) {
      console.error('Error getting current tab:', error);
    }
  }

  handleTabActivated(activeInfo) {
    this.stopTracking();
    this.getTabById(activeInfo.tabId);
  }

  handleTabUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.active) {
      this.stopTracking();
      this.currentTab = tab;
      this.startTracking();
    }
  }

  handleTabRemoved(tabId) {
    if (this.currentTab && this.currentTab.id === tabId) {
      this.stopTracking();
      this.currentTab = null;
    }
  }

  async getTabById(tabId) {
    try {
      const tab = await chrome.tabs.get(tabId);
      this.currentTab = tab;
      this.startTracking();
    } catch (error) {
      console.error('Error getting tab by ID:', error);
    }
  }

  startTracking() {
    if (!this.currentTab || !this.currentTab.url) return;
    
    this.stopTracking();
    this.startTime = Date.now();
    this.isTracking = true;
    
    // Update badge every second
    this.timer = setInterval(() => {
      this.updateBadge();
    }, 1000);
    
    console.log('Started tracking:', this.currentTab.url);
  }

  stopTracking() {
    if (this.isTracking && this.startTime && this.currentTab) {
      const duration = Date.now() - this.startTime;
      const domain = this.extractDomain(this.currentTab.url);
      const isProductive = this.isProductiveDomain(domain);
      
      this.saveTimeData(domain, duration, isProductive);
      console.log('Stopped tracking:', this.currentTab.url, 'Duration:', duration);
    }
    
    this.isTracking = false;
    this.startTime = null;
    
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  updateBadge() {
    if (!this.isTracking || !this.startTime) {
      chrome.action.setBadgeText({ text: '' });
      return;
    }
    
    const duration = Date.now() - this.startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    
    // Show time in MM:SS format
    const badgeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    chrome.action.setBadgeText({ text: badgeText });
    
    // Set badge color based on productivity
    if (this.currentTab && this.currentTab.url) {
      const domain = this.extractDomain(this.currentTab.url);
      const isProductive = this.isProductiveDomain(domain);
      const badgeColor = isProductive ? '#4CAF50' : '#FF5722';
      chrome.action.setBadgeBackgroundColor({ color: badgeColor });
    }
  }

  extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch (error) {
      return 'unknown';
    }
  }

  isProductiveDomain(domain) {
    return this.productiveDomains.some(productiveDomain => 
      domain.includes(productiveDomain)
    );
  }

  async saveTimeData(domain, duration, isProductive) {
    const today = new Date().toISOString().split('T')[0];
    const timeData = {
      domain,
      duration,
      isProductive,
      timestamp: new Date().toISOString(),
      date: today
    };

    // Save to local storage
    try {
      const existingData = await chrome.storage.local.get(['timeLogs']);
      const timeLogs = existingData.timeLogs || [];
      timeLogs.push(timeData);
      
      // Keep only last 30 days of data
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const filteredLogs = timeLogs.filter(log => 
        new Date(log.timestamp) > thirtyDaysAgo
      );
      
      await chrome.storage.local.set({ timeLogs: filteredLogs });
      
      // Sync with backend
      this.syncWithBackend(timeData);
    } catch (error) {
      console.error('Error saving time data:', error);
    }
  }

  async syncWithBackend(timeData) {
    try {
      const response = await fetch('http://localhost:3000/api/time-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timeData)
      });
      
      if (!response.ok) {
        console.error('Failed to sync with backend');
      }
    } catch (error) {
      console.error('Error syncing with backend:', error);
    }
  }

  handleMessage(request, sender, sendResponse) {
    switch (request.action) {
      case 'getCurrentTabInfo':
        if (this.currentTab) {
          const domain = this.extractDomain(this.currentTab.url);
          const isProductive = this.isProductiveDomain(domain);
          const duration = this.isTracking ? Date.now() - this.startTime : 0;
          
          sendResponse({
            url: this.currentTab.url,
            domain,
            isProductive,
            duration,
            isTracking: this.isTracking
          });
        } else {
          sendResponse(null);
        }
        break;
        
      case 'getTimeLogs':
        chrome.storage.local.get(['timeLogs'], (result) => {
          sendResponse(result.timeLogs || []);
        });
        return true; // Keep message channel open for async response
        
      case 'openDashboard':
        chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
        break;
    }
  }
}

// Initialize the time tracker
const timeTracker = new TimeTracker(); 