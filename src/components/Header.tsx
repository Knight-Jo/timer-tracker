import React from 'react';
import { exportData, importData } from '../utils/storage';

export const Header: React.FC = () => {
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importData(file)
        .then(() => {
          alert('数据导入成功！请刷新页面查看。');
          window.location.reload();
        })
        .catch((error) => {
          alert('数据导入失败：' + error.message);
        });
    }
    event.target.value = '';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              个人时间管理系统
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <span className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                导入数据
              </span>
            </label>
            
            <button
              onClick={exportData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              导出数据
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};