import React, { useState } from 'react';
import { Project, TimeEntry } from '../types';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/dateUtils';

export const TimeTracker: React.FC = () => {
  const { state, dispatch } = useApp();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAddTime, setShowAddTime] = useState(false);
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
  };

  const handleDeleteTimeEntry = (entryId: string) => {
    if (window.confirm('确定要删除这个时间记录吗？')) {
      dispatch({ type: 'DELETE_TIME_ENTRY', payload: entryId });
    }
  };

  const getProjectTimeEntries = (projectId: string) => {
    return state.timeEntries
      .filter(entry => entry.projectId === projectId)
      .sort((a, b) => b.date.localeCompare(a.date));
  };

  const getTotalHoursForProject = (projectId: string) => {
    return state.timeEntries
      .filter(entry => entry.projectId === projectId)
      .reduce((sum, entry) => sum + entry.hours, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">时间记录</h2>
        <button
          onClick={() => setShowAddTime(true)}
          disabled={!selectedProject}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedProject
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          记录时间
        </button>
      </div>

      {/* 项目选择 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          选择项目
        </label>
        <select
          value={selectedProject?.id || ''}
          onChange={(e) => {
            const project = state.projects.find(p => p.id === e.target.value);
            setSelectedProject(project || null);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">请选择项目</option>
          {state.projects.map(project => {
            const category = state.categories.find(c => c.id === project.categoryId);
            return (
              <option key={project.id} value={project.id}>
                {category?.name} - {project.name}
              </option>
            );
          })}
        </select>
      </div>

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

      {/* 时间记录列表 */}
      {selectedProject ? (
        <div>
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{selectedProject.name}</h3>
                {selectedProject.description && (
                  <p className="text-sm text-gray-600">{selectedProject.description}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {getTotalHoursForProject(selectedProject.id).toFixed(1)}
                </p>
                <p className="text-sm text-gray-500">总小时数</p>
                {selectedProject.targetHours && (
                  <p className="text-sm text-gray-500">
                    目标: {selectedProject.targetHours} 小时
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {getProjectTimeEntries(selectedProject.id).map(entry => (
              <div
                key={entry.id}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-gray-900">{entry.date}</span>
                    <span className="text-blue-600 font-semibold">
                      {entry.hours} 小时
                    </span>
                    {entry.notes && (
                      <span className="text-gray-600 text-sm">{entry.notes}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTimeEntry(entry.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  删除
                </button>
              </div>
            ))}
          </div>

          {getProjectTimeEntries(selectedProject.id).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>还没有为这个项目记录时间</p>
              <p className="text-sm mt-1">点击"记录时间"按钮开始记录</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>请选择一个项目来查看和记录时间</p>
        </div>
      )}
    </div>
  );
};