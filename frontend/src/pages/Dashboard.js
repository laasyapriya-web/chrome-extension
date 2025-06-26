import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { format, subDays } from 'date-fns';
import { Clock, TrendingUp, TrendingDown, Activity, Calendar } from 'lucide-react';
import ProductivityChart from '../components/charts/ProductivityChart';
import TimeLogsTable from '../components/TimeLogsTable';
import DateSelector from '../components/DateSelector';

const Dashboard = () => {
  const {
    timeLogs,
    analytics,
    loading,
    error,
    selectedDate,
    fetchTimeLogs,
    fetchAnalytics,
    setSelectedDate
  } = useData();

  const [todayStats, setTodayStats] = useState({
    totalTime: 0,
    productiveTime: 0,
    unproductiveTime: 0,
    productivityScore: 0
  });

  useEffect(() => {
    fetchTimeLogs({ date: selectedDate });
  }, [selectedDate, fetchTimeLogs]);

  useEffect(() => {
    const startDate = subDays(new Date(), 7).toISOString().split('T')[0];
    const endDate = new Date().toISOString().split('T')[0];
    fetchAnalytics(startDate, endDate);
  }, [fetchAnalytics]);

  useEffect(() => {
    if (timeLogs.length > 0) {
      const stats = timeLogs.reduce((acc, log) => {
        acc.totalTime += log.duration;
        if (log.isProductive) {
          acc.productiveTime += log.duration;
        } else {
          acc.unproductiveTime += log.duration;
        }
        return acc;
      }, { totalTime: 0, productiveTime: 0, unproductiveTime: 0 });

      stats.productivityScore = stats.totalTime > 0 
        ? (stats.productiveTime / stats.totalTime) * 100 
        : 0;

      setTodayStats(stats);
    }
  }, [timeLogs]);

  const formatTime = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track your productivity and time management
          </p>
        </div>
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium stat-label">Total Time</p>
              <p className="text-2xl font-bold stat-value">
                {formatTime(todayStats.totalTime)}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-[#e6f4ea] rounded-lg">
              <TrendingUp className="w-6 h-6" style={{ color: '#81c995' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium stat-label">Productive Time</p>
              <p className="text-2xl font-bold stat-value">
                {formatTime(todayStats.productiveTime)}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-[#fbeaea] rounded-lg">
              <TrendingDown className="w-6 h-6" style={{ color: '#f28b82' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium stat-label">Unproductive Time</p>
              <p className="text-2xl font-bold stat-value">
                {formatTime(todayStats.unproductiveTime)}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-[#ece9f7] rounded-lg">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium stat-label">Productivity Score</p>
              <p className="text-2xl font-bold stat-value">
                {Math.round(todayStats.productivityScore)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Productivity Overview
          </h3>
          {analytics ? (
            <ProductivityChart data={analytics.dailyData} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Today's Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Productive Time</span>
              <span className="text-sm font-medium text-gray-900">
                {formatTime(todayStats.productiveTime)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${todayStats.totalTime > 0 ? (todayStats.productiveTime / todayStats.totalTime) * 100 : 0}%`
                }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Unproductive Time</span>
              <span className="text-sm font-medium text-gray-900">
                {formatTime(todayStats.unproductiveTime)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${todayStats.totalTime > 0 ? (todayStats.unproductiveTime / todayStats.totalTime) * 100 : 0}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activity - {format(new Date(selectedDate), 'MMMM d, yyyy')}
          </h3>
        </div>
        <TimeLogsTable timeLogs={timeLogs} />
      </div>
    </div>
  );
};

export default Dashboard; 