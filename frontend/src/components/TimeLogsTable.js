import React, { useState } from 'react';
import { format } from 'date-fns';
import { Clock, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';

const TimeLogsTable = ({ timeLogs }) => {
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');

  const formatTime = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedTimeLogs = [...timeLogs].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'timestamp') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return null;
    }
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (timeLogs.length === 0) {
    return (
      <div className="p-8 text-center">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No time logs found for this date</p>
        <p className="text-gray-400 text-sm mt-2">
          Start browsing to see your activity tracked here
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('domain')}
            >
              <div className="flex items-center space-x-1">
                <span>Domain</span>
                <span className="text-gray-400">{getSortIcon('domain')}</span>
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('duration')}
            >
              <div className="flex items-center space-x-1">
                <span>Duration</span>
                <span className="text-gray-400">{getSortIcon('duration')}</span>
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('isProductive')}
            >
              <div className="flex items-center space-x-1">
                <span>Type</span>
                <span className="text-gray-400">{getSortIcon('isProductive')}</span>
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('timestamp')}
            >
              <div className="flex items-center space-x-1">
                <span>Time</span>
                <span className="text-gray-400">{getSortIcon('timestamp')}</span>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedTimeLogs.map((log) => (
            <tr key={log._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${log.domain}&sz=16`}
                    alt=""
                    className="w-4 h-4 mr-3"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {log.domain}
                    </div>
                    {log.title && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {log.title}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 font-medium">
                  {formatTime(log.duration)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {log.isProductive ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Productive
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-600 mr-2" />
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Unproductive
                      </span>
                    </>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(log.timestamp), 'HH:mm:ss')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {log.url && (
                  <a
                    href={log.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-900 flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Visit
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeLogsTable; 