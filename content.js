// Content script for additional tracking capabilities
(function() {
  'use strict';

  if (window.location.protocol === 'chrome-extension:' || window.location.href.startsWith('chrome-extension://')) {
    // Don't run content script on extension pages
    return;
  }

  // Track page visibility changes
  let isPageVisible = true;
  let lastActivityTime = Date.now();
  let activityTimer = null;

  // Listen for visibility changes
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    if (isPageVisible) {
      lastActivityTime = Date.now();
    }
  });

  // Track user activity (mouse movements, clicks, keyboard)
  const trackActivity = () => {
    lastActivityTime = Date.now();
  };

  document.addEventListener('mousemove', trackActivity);
  document.addEventListener('click', trackActivity);
  document.addEventListener('keydown', trackActivity);
  document.addEventListener('scroll', trackActivity);

  // Send activity data to background script every 30 seconds
  setInterval(() => {
    const timeSinceLastActivity = Date.now() - lastActivityTime;
    const isActive = timeSinceLastActivity < 300000; // 5 minutes

    chrome.runtime.sendMessage({
      action: 'updateActivity',
      data: {
        isPageVisible,
        isActive,
        timeSinceLastActivity
      }
    });
  }, 30000);

  // Listen for messages from popup or background
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
      case 'getPageInfo':
        sendResponse({
          title: document.title,
          url: window.location.href,
          domain: window.location.hostname,
          timestamp: Date.now()
        });
        break;
        
      case 'injectAnalytics':
        // Could inject analytics tracking code here
        sendResponse({ success: true });
        break;
    }
  });

  // Notify background script that content script is loaded
  chrome.runtime.sendMessage({
    action: 'contentScriptLoaded',
    data: {
      url: window.location.href,
      timestamp: Date.now()
    }
  });

  console.log('Productivity Tracker: Content script loaded for', window.location.href);
})(); 