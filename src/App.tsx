import { useState, useEffect } from 'react';
import './App.css';

// Import Components
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Solutions } from './pages/Solutions';
import { AiMentor } from './pages/AiMentor';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { AiManagement } from './pages/AiManagement';
import { WorkOrders } from './pages/WorkOrders';
import { TaskDetail } from './pages/TaskDetail';
import { Settings } from './pages/Settings';
import { Analytics } from './pages/Analytics';
import { Notifications } from './pages/Notifications';
import { Devices } from './pages/Devices';
import { LiveFeeds } from './pages/LiveFeeds';
import { Diagnostics } from './pages/Diagnostics';

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('densync_activeTab') || 'sim';
  });
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('densync_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleNavigate = (e: any) => {
      if (e.detail && e.detail.tab) {
        setActiveTab(e.detail.tab);
        if (e.detail.id) setActiveTaskId(e.detail.id);
      }
    };
    window.addEventListener('densync_navigate', handleNavigate);
    return () => window.removeEventListener('densync_navigate', handleNavigate);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'sim': return <Dashboard />;
      case 'live': return <LiveFeeds />;
      case 'solutions': return <Solutions />;
      case 'ai': return <AiMentor />;
      case 'ai-management': return <AiManagement />;
      case 'knowledge': return <KnowledgeBase />;
      case 'submit': 
      case 'work-orders': return <WorkOrders />;
      case 'task-detail': return <TaskDetail id={activeTaskId} />;
      case 'analytics': return <Analytics />;
      case 'notifications': return <Notifications />;
      case 'devices': return <Devices />;
      case 'settings': return <Settings />;
      case 'diagnostics': return <Diagnostics />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
