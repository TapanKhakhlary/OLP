import React, { useState } from 'react';
import { Users, BookOpen, MessageSquare, BarChart3, Home, Settings } from 'lucide-react';
import DashboardSidebar from '../DashboardSidebar';
import TeacherHome from './TeacherHome';
import ClassManagement from './ClassManagement';
import Library from './Library';
import MessageCenter from './MessageCenter';
import Analytics from './Analytics';
import TeacherSettings from './TeacherSettings';

const TeacherDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('home');

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'classes', label: 'Class Management', icon: Users },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'messages', label: 'Message Center', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <TeacherHome />;
      case 'classes':
        return <ClassManagement />;
      case 'library':
        return <Library />;
      case 'messages':
        return <MessageCenter />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <TeacherSettings />;
      default:
        return <TeacherHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar
        items={sidebarItems}
        activeItem={activeView}
        onItemClick={setActiveView}
        theme="green"
      />
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;