import React, { useState } from 'react';
import { Category, Project, TimeEntry } from '../types';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/dateUtils';

interface CategoryManagerProps {
  onSelectProject?: (project: Project) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ onSelectProject }) => {
  const { state, dispatch } = useApp();
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [newCategory, setNewCategory] = useState({ name: '', description: '', color: '#3B82F6' });
  const [newProject, setNewProject] = useState({ 
    name: '', 
    description: '', 
    targetHours: '',
    color: '#6B7280'
  });

  const [showAddTime, setShowAddTime] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newTimeEntry, setNewTimeEntry] = useState({
    date: formatDate(new Date()),
    hours: '',
    notes: ''
  });

  const handleAddTimeEntry = () => {
    if (!selectedProject || !newTimeEntry.hours) return;

    const timeEntry: TimeEntry = {
      id: Date.now().toString(),
      projectId: selectedProject.id,
      date: newTimeEntry.date,
      hours: parseFloat(newTimeEntry.hours),
      notes: newTimeEntry.notes.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_TIME_ENTRY', payload: timeEntry });
    setNewTimeEntry({ date: formatDate(new Date()), hours: '', notes: '' });
    setShowAddTime(false);
    setSelectedProject(null);
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;

    const category: Category = {
      id: Date.now().toString(),
      name: newCategory.name.trim(),
      description: newCategory.description.trim() || undefined,
      color: newCategory.color,
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_CATEGORY', payload: category });
    setNewCategory({ name: '', description: '', color: '#3B82F6' });
    setShowAddCategory(false);
  };

  const handleAddProject = () => {
    if (!newProject.name.trim() || !selectedCategoryId) return;

    const project: Project = {
      id: Date.now().toString(),
      categoryId: selectedCategoryId,
      name: newProject.name.trim(),
      description: newProject.description.trim() || undefined,
      targetHours: newProject.targetHours ? parseInt(newProject.targetHours) : undefined,
      color: newProject.color,
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_PROJECT', payload: project });
    setNewProject({ name: '', description: '', targetHours: '', color: '#6B7280' });
    setShowAddProject(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('确定要删除这个分类吗？这会删除该分类下的所有项目和时间记录。')) {
      dispatch({ type: 'DELETE_CATEGORY', payload: categoryId });
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('确定要删除这个项目吗？这会删除该项目下的所有时间记录。')) {
      dispatch({ type: 'DELETE_PROJECT', payload: projectId });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">分类管理</h2>
        <div className="space-x-2">
          <button
            onClick={() => setShowAddCategory(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            添加分类
          </button>
          <button
            onClick={() => setShowAddProject(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            添加项目
          </button>
        </div>
      </div>

      {/* 添加分类模态框 */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">添加分类</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  分类名称 *
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入分类名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  描述
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入分类描述"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  颜色
                </label>
                <input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowAddCategory(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                取消
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 添加项目模态框 */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">添加项目</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  选择分类 *
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">请选择分类</option>
                  {state.categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  项目名称 *
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入项目名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  描述
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入项目描述"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  目标小时数
                </label>
                <input
                  type="number"
                  value={newProject.targetHours}
                  onChange={(e) => setNewProject({ ...newProject, targetHours: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入目标小时数"
                  min="0"
                  step="0.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  颜色
                </label>
                <input
                  type="color"
                  value={newProject.color}
                  onChange={(e) => setNewProject({ ...newProject, color: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowAddProject(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                取消
              </button>
              <button
                onClick={handleAddProject}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 添加时间记录模态框 */}
      {showAddTime && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">
              为 {selectedProject.name} 记录时间
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  日期 *
                </label>
                <input
                  type="date"
                  value={newTimeEntry.date}
                  onChange={(e) => setNewTimeEntry({ ...newTimeEntry, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  小时数 *
                </label>
                <input
                  type="number"
                  value={newTimeEntry.hours}
                  onChange={(e) => setNewTimeEntry({ ...newTimeEntry, hours: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入花费的小时数"
                  min="0"
                  step="0.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  备注
                </label>
                <textarea
                  value={newTimeEntry.notes}
                  onChange={(e) => setNewTimeEntry({ ...newTimeEntry, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入备注信息"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowAddTime(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                取消
              </button>
              <button
                onClick={handleAddTimeEntry}
                disabled={!newTimeEntry.hours}
                className={`px-4 py-2 rounded-lg ${
                  newTimeEntry.hours
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 分类和项目列表 */}
      <div className="space-y-6">
        {state.categories.map(category => {
          const categoryProjects = state.projects.filter(project => project.categoryId === category.id);
          
          return (
            <div key={category.id} className="border border-gray-200 rounded-lg">
              <div 
                className="p-4 flex justify-between items-center"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-gray-600">{category.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {categoryProjects.length} 个项目
                  </span>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    删除
                  </button>
                </div>
              </div>
              
              {categoryProjects.length > 0 && (
                <div className="p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryProjects.map(project => (
                      <div
                        key={project.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          setSelectedProject(project);
                          setShowAddTime(true);
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: project.color }}
                            />
                            <h4 className="font-medium">{project.name}</h4>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.id);
                            }}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            删除
                          </button>
                        </div>
                        {project.description && (
                          <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                        )}
                        {project.targetHours && (
                          <p className="text-sm text-gray-500">
                            目标: {project.targetHours} 小时
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {state.categories.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>还没有分类，点击"添加分类"开始管理您的时间</p>
        </div>
      )}
    </div>
  );
};
