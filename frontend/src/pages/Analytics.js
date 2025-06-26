import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { format, subDays } from 'date-fns';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Calendar, TrendingUp, Clock, Target } from 'lucide-react';

const Analytics = () => {
  const {
    fetchDomainAnalytics,
    fetchHourlyPattern,
    fetchInsights,
    dateRange,
    setDateRange
  } = useData();

  const [domainData, setDomainData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [domains, hourly, insightsData] = await Promise.all([
        fetchDomainAnalytics(dateRange.startDate, dateRange.endDate, 10),
        fetchHourlyPattern(dateRange.startDate, dateRange.endDate),
        fetchInsights(dateRange.startDate, dateRange.endDate)
      ]);
      
      setDomainData(domains);
      setHourlyData(hourly);
      setInsights(insightsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange(startDate, endDate);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 animate-fadeIn">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-300"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Deep insights into your productivity patterns
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">
            {format(new Date(dateRange.startDate), 'MMM d')} - {format(new Date(dateRange.endDate), 'MMM d, yyyy')}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => handleDateRangeChange(
            subDays(new Date(), 7).toISOString().split('T')[0],
            new Date().toISOString().split('T')[0]
          )}
          className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
        >
          <div className="text-sm font-medium text-gray-900">Last 7 Days</div>
        </button>
        <button
          onClick={() => handleDateRangeChange(
            subDays(new Date(), 30).toISOString().split('T')[0],
            new Date().toISOString().split('T')[0]
          )}
          className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
        >
          <div className="text-sm font-medium text-gray-900">Last 30 Days</div>
        </button>
        <button
          onClick={() => handleDateRangeChange(
            subDays(new Date(), 90).toISOString().split('T')[0],
            new Date().toISOString().split('T')[0]
          )}
          className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
        >
          <div className="text-sm font-medium text-gray-900">Last 90 Days</div>
        </button>
      </div>

      {/* Insights */}
      {insights && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Productivity Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(insights.summary.productivityScore)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Productivity Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatTime(insights.summary.totalTime)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {insights.summary.totalSessions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Sessions</div>
            </div>
          </div>
          
          {insights.recommendations && insights.recommendations.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
              <div className="space-y-2">
                {insights.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg text-sm ${
                      rec.type === 'success' ? 'bg-green-50 text-green-800' :
                      rec.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                      'bg-blue-50 text-blue-800'
                    }`}
                  >
                    {rec.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Domains */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Domains</h3>
          {domainData.length > 0 ? (
            <div className="space-y-3">
              {domainData.slice(0, 5).map((domain, index) => (
                <div key={domain._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{domain._id}</div>
                      <div className="text-xs text-gray-500">{domain.sessions} sessions</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatTime(domain.totalTime)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round(domain.productivityScore)}% productive
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No domain data available</div>
          )}
        </div>

        {/* Hourly Pattern */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Activity Pattern</h3>
          {hourlyData.length > 0 ? (
            <div className="chart-container">
              <Bar
                data={{
                  labels: hourlyData.map(item => `${item._id}:00`),
                  datasets: [
                    {
                      label: 'Productive Time',
                      data: hourlyData.map(item => Math.round(item.productiveTime / 60000)),
                      backgroundColor: 'rgba(34, 197, 94, 0.8)',
                      borderColor: 'rgb(34, 197, 94)',
                      borderWidth: 1,
                    },
                    {
                      label: 'Unproductive Time',
                      data: hourlyData.map(item => Math.round(item.unproductiveTime / 60000)),
                      backgroundColor: 'rgba(239, 68, 68, 0.8)',
                      borderColor: 'rgb(239, 68, 68)',
                      borderWidth: 1,
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: ${context.parsed.y} minutes`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Time (minutes)'
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No hourly data available</div>
          )}
        </div>
      </div>

      {/* Productivity Distribution */}
      {insights && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivity Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="chart-container">
              <Doughnut
                data={{
                  labels: ['Productive', 'Unproductive'],
                  datasets: [
                    {
                      data: [
                        Math.round(insights.summary.productiveTime / 60000),
                        Math.round(insights.summary.unproductiveTime / 60000)
                      ],
                      backgroundColor: [
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                      ],
                      borderColor: [
                        'rgb(34, 197, 94)',
                        'rgb(239, 68, 68)'
                      ],
                      borderWidth: 2,
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = ((context.parsed / total) * 100).toFixed(1);
                          return `${context.label}: ${context.parsed} minutes (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-green-800">Productive Time</div>
                  <div className="text-2xl font-bold text-green-900">
                    {formatTime(insights.summary.productiveTime)}
                  </div>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-red-800">Unproductive Time</div>
                  <div className="text-2xl font-bold text-red-900">
                    {formatTime(insights.summary.unproductiveTime)}
                  </div>
                </div>
                <Clock className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics; 