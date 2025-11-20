import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CategoryManager } from './components/CategoryManager';
import { TimeTracker } from './components/TimeTracker';
import { StatsPanel } from './components/StatsPanel';
import { Project } from './types';

function AppContent() {
  const [activeTab, setActiveTab] = useState('categories');
  const [, setSelectedProject] = useState<Project | null>(null);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setActiveTab('time');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'categories':
        return <CategoryManager onSelectProject={handleSelectProject} />;
      case 'time':
        return <TimeTracker />;
      case 'stats':
        return <StatsPanel />;
      default:
        return <CategoryManager onSelectProject={handleSelectProject} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;