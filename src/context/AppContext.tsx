import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Category, Project, TimeEntry, DateRange, AppState } from '../types';
import { loadData, saveCategories, saveProjects, saveTimeEntries } from '../utils/storage';
import { defaultCategories, defaultProjects } from '../data/defaultData';
import { getTodayRange } from '../utils/dateUtils';

type AppAction =
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'SET_TIME_ENTRIES'; payload: TimeEntry[] }
  | { type: 'ADD_TIME_ENTRY'; payload: TimeEntry }
  | { type: 'UPDATE_TIME_ENTRY'; payload: TimeEntry }
  | { type: 'DELETE_TIME_ENTRY'; payload: string }
  | { type: 'SET_DATE_RANGE'; payload: DateRange };

const initialState: AppState = {
  categories: [],
  projects: [],
  timeEntries: [],
  selectedDateRange: getTodayRange()
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(cat =>
          cat.id === action.payload.id ? action.payload : cat
        )
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(cat => cat.id !== action.payload),
        projects: state.projects.filter(project => project.categoryId !== action.payload)
      };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(proj =>
          proj.id === action.payload.id ? action.payload : proj
        )
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(proj => proj.id !== action.payload),
        timeEntries: state.timeEntries.filter(entry => entry.projectId !== action.payload)
      };
    case 'SET_TIME_ENTRIES':
      return { ...state, timeEntries: action.payload };
    case 'ADD_TIME_ENTRY':
      return { ...state, timeEntries: [...state.timeEntries, action.payload] };
    case 'UPDATE_TIME_ENTRY':
      return {
        ...state,
        timeEntries: state.timeEntries.map(entry =>
          entry.id === action.payload.id ? action.payload : entry
        )
      };
    case 'DELETE_TIME_ENTRY':
      return {
        ...state,
        timeEntries: state.timeEntries.filter(entry => entry.id !== action.payload)
      };
    case 'SET_DATE_RANGE':
      return { ...state, selectedDateRange: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 加载数据
  useEffect(() => {
    const data = loadData();
    
    // 如果没有数据，使用默认数据
    if (data.categories.length === 0) {
      dispatch({ type: 'SET_CATEGORIES', payload: defaultCategories });
      dispatch({ type: 'SET_PROJECTS', payload: defaultProjects });
    } else {
      dispatch({ type: 'SET_CATEGORIES', payload: data.categories });
      dispatch({ type: 'SET_PROJECTS', payload: data.projects });
      dispatch({ type: 'SET_TIME_ENTRIES', payload: data.timeEntries });
    }
  }, []);

  // 保存数据到localStorage
  useEffect(() => {
    saveCategories(state.categories);
  }, [state.categories]);

  useEffect(() => {
    saveProjects(state.projects);
  }, [state.projects]);

  useEffect(() => {
    saveTimeEntries(state.timeEntries);
  }, [state.timeEntries]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}