import React from 'react';
import { format, subDays, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const DateSelector = ({ selectedDate, onDateChange }) => {
  const handlePreviousDay = () => {
    const prevDate = subDays(new Date(selectedDate), 1);
    onDateChange(prevDate.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const nextDate = addDays(new Date(selectedDate), 1);
    const today = new Date().toISOString().split('T')[0];
    
    // Don't allow future dates
    if (nextDate.toISOString().split('T')[0] <= today) {
      onDateChange(nextDate.toISOString().split('T')[0]);
    }
  };

  const handleToday = () => {
    onDateChange(new Date().toISOString().split('T')[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-2">
      <button
        onClick={handlePreviousDay}
        className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
        title="Previous day"
      >
        <ChevronLeft className="w-4 h-4 text-gray-600" />
      </button>

      <button
        onClick={handleToday}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
          isToday
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Today
      </button>

      <div className="flex items-center space-x-2 px-3 py-1">
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-900">
          {format(new Date(selectedDate), 'MMM d, yyyy')}
        </span>
      </div>

      <button
        onClick={handleNextDay}
        disabled={isToday}
        className={`p-1 rounded-md transition-colors duration-200 ${
          isToday
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        title="Next day"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default DateSelector; 