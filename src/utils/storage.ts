import { AppState } from '../types';

// Backend base URL from env or fallback
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL || '';
console.log('Using BACKEND_API_URL:', BACKEND_API_URL);

const API_URL = `${BACKEND_API_URL}/api/data`;

export const loadData = async () => {
  try {

    console.log('Loading data from server...');
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return {
      categories: data.categories || [],
      projects: data.projects || [],
      timeEntries: data.timeEntries || []
    };
  } catch (error) {
    console.error('Failed to load data from server:', error);
    return { categories: [], projects: [], timeEntries: [] };
  }
};

export const saveData = async (data: Partial<AppState>) => {
  try {
    // We need to send the full state structure that the server expects
    // The server expects { categories, projects, timeEntries }
    // But AppState also has selectedDateRange which we might not want to persist, 
    // or maybe we do. The previous implementation didn't persist it.
    // Let's persist only the data parts.
    
    const payload = {
      categories: data.categories,
      projects: data.projects,
      timeEntries: data.timeEntries
    };
    console.log('Saving data to server:', payload);
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    console.log('Data saved successfully to server');
  } catch (error) {
    console.error('Failed to save data to server:', error);
  }
};

export const exportData = async () => {
  const data = await loadData();
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
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.categories && data.projects && data.timeEntries) {
          await saveData(data);
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
