import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext();

const initialState = {
  timeLogs: [],
  analytics: null,
  loading: false,
  error: null,
  selectedDate: new Date().toISOString().split('T')[0],
  dateRange: {
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  }
};

const dataReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_TIME_LOGS':
      return { ...state, timeLogs: action.payload, loading: false };
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload, loading: false };
    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload };
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload };
    case 'ADD_TIME_LOG':
      return { ...state, timeLogs: [action.payload, ...state.timeLogs] };
    default:
      return state;
  }
};

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

  // Fetch time logs
  const fetchTimeLogs = async (filters = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_BASE_URL}/time-logs?${params}`);
      dispatch({ type: 'SET_TIME_LOGS', payload: response.data.timeLogs });
    } catch (error) {
      console.error('Error fetching time logs:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch time logs' });
    }
  };

  // Fetch analytics
  const fetchAnalytics = async (startDate, endDate) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get(`${API_BASE_URL}/analytics/productivity`, {
        params: { startDate, endDate }
      });
      dispatch({ type: 'SET_ANALYTICS', payload: response.data });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch analytics' });
    }
  };

  // Fetch domain analytics
  const fetchDomainAnalytics = async (startDate, endDate, limit = 20) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/domains`, {
        params: { startDate, endDate, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching domain analytics:', error);
      throw error;
    }
  };

  // Fetch hourly pattern
  const fetchHourlyPattern = async (startDate, endDate) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/hourly-pattern`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching hourly pattern:', error);
      throw error;
    }
  };

  // Fetch insights
  const fetchInsights = async (startDate, endDate) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/insights`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching insights:', error);
      throw error;
    }
  };

  // Add time log
  const addTimeLog = async (timeLogData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/time-logs`, timeLogData);
      dispatch({ type: 'ADD_TIME_LOG', payload: response.data.timeLog });
      return response.data;
    } catch (error) {
      console.error('Error adding time log:', error);
      throw error;
    }
  };

  // Update time log
  const updateTimeLog = async (id, updateData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/time-logs/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating time log:', error);
      throw error;
    }
  };

  // Delete time log
  const deleteTimeLog = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/time-logs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting time log:', error);
      throw error;
    }
  };

  // Set selected date
  const setSelectedDate = (date) => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: date });
  };

  // Set date range
  const setDateRange = (startDate, endDate) => {
    dispatch({ type: 'SET_DATE_RANGE', payload: { startDate, endDate } });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  // Load initial data
  useEffect(() => {
    fetchTimeLogs({ date: state.selectedDate });
    fetchAnalytics(state.dateRange.startDate, state.dateRange.endDate);
  }, []);

  const value = {
    ...state,
    fetchTimeLogs,
    fetchAnalytics,
    fetchDomainAnalytics,
    fetchHourlyPattern,
    fetchInsights,
    addTimeLog,
    updateTimeLog,
    deleteTimeLog,
    setSelectedDate,
    setDateRange,
    clearError
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}; 