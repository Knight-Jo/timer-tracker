import { Category, Project } from '../types';

export const defaultCategories: Category[] = [
  {
    id: '1',
    name: '技术书籍',
    description: '技术相关的书籍阅读',
    color: '#3B82F6',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: '闲书',
    description: '非技术类书籍阅读',
    color: '#10B981',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: '项目',
    description: '个人或工作项目',
    color: '#F59E0B',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: '学习',
    description: '在线课程和学习',
    color: '#8B5CF6',
    createdAt: new Date().toISOString()
  }
];

export const defaultProjects: Project[] = [
  {
    id: '1',
    categoryId: '1',
    name: 'CPP开发实战',
    description: '深入学习C++开发实践',
    targetHours: 100,
    color: '#2563EB',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    categoryId: '1',
    name: 'CPP并发编程实战',
    description: '掌握C++并发编程技术',
    targetHours: 80,
    color: '#1D4ED8',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    categoryId: '2',
    name: '三体',
    description: '科幻小说阅读',
    targetHours: 50,
    color: '#047857',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    categoryId: '3',
    name: '个人博客',
    description: '个人博客网站开发',
    targetHours: 200,
    color: '#D97706',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    categoryId: '4',
    name: 'React高级课程',
    description: '深入学习React高级特性',
    targetHours: 60,
    color: '#7C3AED',
    createdAt: new Date().toISOString()
  }
];