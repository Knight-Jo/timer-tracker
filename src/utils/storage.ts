import { Category, Project, TimeEntry } from '../types';

const STORAGE_KEYS = {
  CATEGORIES: 'time-tracker-categories',
  PROJECTS: 'time-tracker-projects',
  TIME_ENTRIES: 'time-tracker-time-entries'
};

export const loadData = () => {
  try {
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    const timeEntries = JSON.parse(localStorage.getItem(STORAGE_KEYS.TIME_ENTRIES) || '[]');
    
    return { categories, projects, timeEntries };
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
    return { categories: [], projects: [], timeEntries: [] };
  }
};

export const saveCategories = (categories: Category[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (error) {
    console.error('Failed to save categories:', error);
  }
};

export const saveProjects = (projects: Project[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save projects:', error);
  }
};

export const saveTimeEntries = (timeEntries: TimeEntry[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(timeEntries));
  } catch (error) {
    console.error('Failed to save time entries:', error);
  }
};

export const exportData = () => {
  const data = loadData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `time-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.categories && data.projects && data.timeEntries) {
          saveCategories(data.categories);
          saveProjects(data.projects);
          saveTimeEntries(data.timeEntries);
          resolve();
        } else {
          reject(new Error('Invalid data format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};