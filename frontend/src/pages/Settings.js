import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, Trash2 } from 'lucide-react';
import { useTheme } from '../App';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    autoSync: true,
    notifications: true,
    dataRetention: 30,
    theme: 'light'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Here you would typically save to localStorage or backend
  };

  const handleReset = () => {
    setSettings({
      autoSync: true,
      notifications: true,
      dataRetention: 30,
      theme: 'light'
    });
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      // Clear data logic here
      console.log('Clearing all data...');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <SettingsIcon className="w-6 h-6 mr-3" />
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Configure your productivity tracking preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">General</h3>
          </div>
          <div className="p-6 space-y-6">
            {/* Auto Sync */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Auto Sync</h4>
                <p className="text-sm text-gray-500">
                  Automatically sync data with the backend server
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoSync}
                  onChange={(e) => handleSettingChange('autoSync', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Notifications</h4>
                <p className="text-sm text-gray-500">
                  Show productivity reminders and insights
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Data Retention */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Data Retention (days)
              </label>
              <select
                value={settings.dataRetention}
                onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
                <option value={365}>1 year</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                How long to keep your tracking data
              </p>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Theme
              </label>
              <select
                value={theme}
                onChange={toggleTheme}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        </div>

        {/* Productivity Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Productivity</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Productive Domains
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                The extension automatically classifies websites as productive or unproductive based on a predefined list.
              </p>
              <p className="text-sm text-blue-600">
                Productive sites include: GitHub, Stack Overflow, educational platforms, and development tools.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-900 mb-2">
                Custom Classification
              </h4>
              <p className="text-sm text-yellow-700">
                To customize which sites are considered productive, you can modify the background script.
              </p>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Export Data</h4>
                <p className="text-sm text-gray-500">
                  Download your time tracking data as JSON
                </p>
              </div>
              <button className="btn-secondary">
                Export
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Clear All Data</h4>
                <p className="text-sm text-gray-500">
                  Permanently delete all your tracking data
                </p>
              </div>
              <button
                onClick={handleClearData}
                className="btn-danger flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Data
              </button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">About</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Version</h4>
              <p className="text-sm text-gray-500">1.0.0</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Description</h4>
              <p className="text-sm text-gray-500">
                Productivity Time Tracker is a Chrome extension that helps you monitor and improve your online productivity by tracking time spent on different websites.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleReset}
          className="btn-secondary flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary flex items-center"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Settings; 