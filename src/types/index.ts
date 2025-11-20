// 时间记录条目
export interface TimeEntry {
  id: string;
  projectId: string;
  date: string; // YYYY-MM-DD格式
  hours: number;
  notes?: string;
  createdAt: string;
}

// 小项目
export interface Project {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  targetHours?: number; // 目标小时数
  color?: string; // 项目颜色
  createdAt: string;
}

// 大分类
export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string; // 分类颜色
  createdAt: string;
}

// 统计数据
export interface TimeStats {
  totalHours: number;
  averageHours: number;
  projects: Array<{
    project: Project;
    hours: number;
    percentage: number;
  }>;
  categories: Array<{
    category: Category;
    hours: number;
    percentage: number;
  }>;
}

// 日期范围
export interface DateRange {
  start: string;
  end: string;
}

// 应用状态
export interface AppState {
  categories: Category[];
  projects: Project[];
  timeEntries: TimeEntry[];
  selectedDateRange: DateRange;
}

// 统计类型
export type StatsPeriod = 'day' | 'week' | 'month' | 'year' | 'custom';