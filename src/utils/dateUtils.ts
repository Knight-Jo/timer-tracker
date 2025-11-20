import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, parseISO } from 'date-fns';
import { DateRange } from '../types';

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};

export const getTodayRange = (): DateRange => {
  const today = new Date();
  return {
    start: formatDate(startOfDay(today)),
    end: formatDate(endOfDay(today))
  };
};

export const getWeekRange = (): DateRange => {
  const today = new Date();
  return {
    start: formatDate(startOfWeek(today, { weekStartsOn: 1 })),
    end: formatDate(endOfWeek(today, { weekStartsOn: 1 }))
  };
};

export const getMonthRange = (): DateRange => {
  const today = new Date();
  return {
    start: formatDate(startOfMonth(today)),
    end: formatDate(endOfMonth(today))
  };
};

export const getYearRange = (): DateRange => {
  const today = new Date();
  return {
    start: formatDate(startOfYear(today)),
    end: formatDate(endOfYear(today))
  };
};

export const getDateRangeByPeriod = (period: 'day' | 'week' | 'month' | 'year'): DateRange => {
  switch (period) {
    case 'day':
      return getTodayRange();
    case 'week':
      return getWeekRange();
    case 'month':
      return getMonthRange();
    case 'year':
      return getYearRange();
    default:
      return getTodayRange();
  }
};

export const isDateInRange = (date: string, range: DateRange): boolean => {
  const dateObj = parseISO(date);
  const start = parseISO(range.start);
  const end = parseISO(range.end);
  return isWithinInterval(dateObj, { start, end });
};

export const generateDateRange = (start: string, end: string): string[] => {
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  const dates: string[] = [];
  
  let current = startDate;
  while (current <= endDate) {
    dates.push(formatDate(current));
    current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
  }
  
  return dates;
};