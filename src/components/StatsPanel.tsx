import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useApp } from '../context/AppContext';
import { calculateStats, getDailyStats, getProjectProgress } from '../utils/stats';
import { getDateRangeByPeriod, formatDate } from '../utils/dateUtils';
import { StatsPeriod } from '../types';

export const StatsPanel: React.FC = () => {
  const { state, dispatch } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<StatsPeriod>('week');
  const [customRange, setCustomRange] = useState({
    start: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    end: formatDate(new Date())
  });
  const [showCustomRange, setShowCustomRange] = useState(false);

  const dateRange = selectedPeriod === 'custom' 
    ? { start: customRange.start, end: customRange.end }
    : getDateRangeByPeriod(selectedPeriod);

  const stats = calculateStats(state.timeEntries, state.projects, state.categories, dateRange);
  const dailyStats = getDailyStats(state.timeEntries, dateRange);

  const handlePeriodChange = (period: StatsPeriod) => {
    setSelectedPeriod(period);
    if (period !== 'custom') {
      const range = getDateRangeByPeriod(period);
      dispatch({ type: 'SET_DATE_RANGE', payload: range });
    }
  };

  const handleCustomRangeApply = () => {
    dispatch({ type: 'SET_DATE_RANGE', payload: customRange });
    setShowCustomRange(false);
  };

  // 准备饼图数据
  const categoryPieData = stats.categories.map(item => ({
    name: item.category.name,
    value: item.hours,
    color: item.category.color
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">统计分析</h2>
        <div className="flex space-x-2">
          {(['day', 'week', 'month', 'year', 'custom'] as StatsPeriod[]).map(period => (
            <button
              key={period}
              onClick={() => handlePeriodChange(period)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {{
                day: '今日',
                week: '本周',
                month: '本月',
                year: '今年',
                custom: '自定义'
              }[period]}
            </button>
          ))}
        </div>
      </div>

      {/* 自定义日期范围选择 */}
      {showCustomRange && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">选择日期范围</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  开始日期
                </label>
                <input
                  type="date"
                  value={customRange.start}
                  onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  结束日期
                </label>
                <input
                  type="date"
                  value={customRange.end}
                  onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowCustomRange(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                取消
              </button>
              <button
                onClick={handleCustomRangeApply}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                应用
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 概览统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="text-3xl font-bold text-blue-600">
            {stats.totalHours.toFixed(1)}
          </div>
          <div className="text-blue-800 font-medium">总小时数</div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="text-3xl font-bold text-green-600">
            {stats.averageHours.toFixed(1)}
          </div>
          <div className="text-green-800 font-medium">日均小时数</div>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="text-3xl font-bold text-purple-600">
            {stats.projects.length}
          </div>
          <div className="text-purple-800 font-medium">活跃项目</div>
        </div>
      </div>

      {/* 时间趋势图 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">时间趋势</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 分类分布 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">分类分布</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 项目分布 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">项目分布</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.projects.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="project.name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#8884d8">
                  {stats.projects.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.project.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 项目进度 */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">项目进度</h3>
        <div className="space-y-4">
          {state.projects.filter(project => project.targetHours).map(project => {
            const progress = getProjectProgress(project, state.timeEntries);
            const totalHours = state.timeEntries
              .filter(entry => entry.projectId === project.id)
              .reduce((sum, entry) => sum + entry.hours, 0);
            
            return (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="font-medium">{project.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {totalHours.toFixed(1)} / {project.targetHours} 小时
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: project.color
                    }}
                  />
                </div>
                <div className="text-right text-sm text-gray-500 mt-1">
                  {progress.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>

        {state.projects.filter(project => project.targetHours).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>还没有设置目标小时数的项目</p>
            <p className="text-sm mt-1">在项目设置中设置目标小时数来跟踪进度</p>
          </div>
        )}
      </div>
    </div>
  );
};