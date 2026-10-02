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
import { Login } from './pages/Login';
import { FactoryOperatorDashboard } from './pages/FactoryOperatorDashboard';
import { FactoryExpertDashboard } from './pages/FactoryExpertDashboard';
import { SystemAdminDashboard } from './pages/SystemAdminDashboard';
import { MySolutions } from './pages/MySolutions';
import { SolutionDetail } from './pages/SolutionDetail';
import { SubmitSolution } from './pages/SubmitSolution';
import { useAuth } from './contexts/AuthContext';
import { canAccessPage, getAllowedRoles } from './access/rbac';
import { AccessDenied } from './components/AccessDenied';

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('densync_activeTab') || 'sim';
  });
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeSolutionId, setActiveSolutionId] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    localStorage.setItem('densync_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleNavigate = (e: any) => {
      if (e.detail && e.detail.tab) {
        setActiveTab(e.detail.tab);
        if (e.detail.id) {
          setActiveTaskId(e.detail.id);
          setActiveSolutionId(e.detail.id);
        }
      }
    };
    window.addEventListener('densync_navigate', handleNavigate);
    return () => window.removeEventListener('densync_navigate', handleNavigate);
  }, []);

  // When the user logs in (or switches account), make sure the persisted tab
  // is allowed for their role — otherwise fall back to the dashboard.
  useEffect(() => {
    if (isAuthenticated && user && !canAccessPage(activeTab, user.role)) {
      setActiveTab('sim');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.role]);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  // Enforce role-based access: pages restricted to other roles cannot be opened
  // (defense in depth — the sidebar already hides those entries).
  if (user && !canAccessPage(activeTab, user.role)) {
    const allowedRoles = getAllowedRoles(activeTab) ?? [];
    return (
      <div className="app-container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="main-content">
          <AccessDenied
            pageId={activeTab}
            allowedRoles={allowedRoles}
            userRole={user.role}
            onBack={() => setActiveTab('sim')}
          />
        </main>
      </div>
    );
  }

  // Render role-specific dashboard for 'sim' tab
  const renderRoleDashboard = () => {
    if (activeTab === 'sim') {
      switch (user?.role) {
        case 'factory_operator':
          return <FactoryOperatorDashboard />;
        case 'factory_expert':
          return <FactoryExpertDashboard />;
        case 'system_admin':
          return <SystemAdminDashboard />;
        default:
          return <Dashboard />;
      }
    }
    return null;
  };

  const renderContent = () => {
    // Check if this is the dashboard tab and render role-specific version
    if (activeTab === 'sim') {
      return renderRoleDashboard();
    }

    // For other tabs, use existing pages
    switch (activeTab) {
      case 'live': return <LiveFeeds />;
      case 'solutions': return <Solutions />;
      case 'my-solutions': return <MySolutions />;
      case 'ai': return <AiMentor />;
      case 'ai-management': return <AiManagement />;
      case 'knowledge': return <KnowledgeBase />;
      case 'submit': return <SubmitSolution />;
      case 'work-orders': return <WorkOrders />;
      case 'task-detail': return <TaskDetail id={activeTaskId} />;
      case 'solution-detail': return <SolutionDetail id={activeSolutionId} />;
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
