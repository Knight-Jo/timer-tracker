import { TimeEntry, Project, Category, TimeStats, DateRange } from '../types';
import { isDateInRange } from './dateUtils';

export const calculateStats = (
  timeEntries: TimeEntry[],
  projects: Project[],
  categories: Category[],
  dateRange: DateRange
): TimeStats => {
  // 过滤出日期范围内的记录
  const filteredEntries = timeEntries.filter(entry => 
    isDateInRange(entry.date, dateRange)
  );

  // 计算总小时数
  const totalHours = filteredEntries.reduce((sum, entry) => sum + entry.hours, 0);

  // 按项目统计
  const projectStats = projects.map(project => {
    const projectHours = filteredEntries
      .filter(entry => entry.projectId === project.id)
      .reduce((sum, entry) => sum + entry.hours, 0);
    
    return {
      project,
      hours: projectHours,
      percentage: totalHours > 0 ? (projectHours / totalHours) * 100 : 0
    };
  }).filter(stat => stat.hours > 0);

  // 按分类统计
  const categoryStats = categories.map(category => {
    const categoryProjects = projects.filter(project => project.categoryId === category.id);
    const categoryHours = filteredEntries
      .filter(entry => categoryProjects.some(project => project.id === entry.projectId))
      .reduce((sum, entry) => sum + entry.hours, 0);
    
    return {
      category,
      hours: categoryHours,
      percentage: totalHours > 0 ? (categoryHours / totalHours) * 100 : 0
    };
  }).filter(stat => stat.hours > 0);

  // 计算平均小时数
  const uniqueDays = new Set(filteredEntries.map(entry => entry.date)).size;
  const averageHours = uniqueDays > 0 ? totalHours / uniqueDays : 0;

  return {
    totalHours,
    averageHours,
    projects: projectStats,
    categories: categoryStats
  };
};

export const getDailyStats = (
  timeEntries: TimeEntry[],
  dateRange: DateRange
): Array<{ date: string; hours: number }> => {
  const dailyStats: { [date: string]: number } = {};
  
  timeEntries.forEach(entry => {
    if (isDateInRange(entry.date, dateRange)) {
      dailyStats[entry.date] = (dailyStats[entry.date] || 0) + entry.hours;
    }
  });

  return Object.entries(dailyStats)
    .map(([date, hours]) => ({ date, hours }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const getProjectProgress = (project: Project, timeEntries: TimeEntry[]): number => {
  if (!project.targetHours) return 0;
  
  const totalHours = timeEntries
    .filter(entry => entry.projectId === project.id)
    .reduce((sum, entry) => sum + entry.hours, 0);
  
  return Math.min((totalHours / project.targetHours) * 100, 100);
};