import React, { useState } from 'react';
import { TrendingUp, MessageSquare, BookOpen, Settings, Users } from 'lucide-react';
import DashboardSidebar from '../DashboardSidebar';
import ChildProgress from './ChildProgress';
import ResultsFeedback from './ResultsFeedback';
import Messages from './Messages';
import ParentSettings from './ParentSettings';
import ParentAnnouncements from './ParentAnnouncements';
import ParentProgressView from './ParentProgressView';
import ComprehensiveChildProgress from './ComprehensiveChildProgress';
import LinkChild from './LinkChild';

const ParentDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('progress');

  const sidebarItems = [
    { id: 'progress', label: "Child's Progress", icon: TrendingUp },
    { id: 'link-child', label: 'Link Child', icon: Users },
    { id: 'results', label: 'Results & Feedback', icon: BookOpen },
    { id: 'announcements', label: 'Announcements', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'progress':
        return <ComprehensiveChildProgress />;
      case 'link-child':
        return <LinkChild />;
      case 'results':
        return <ResultsFeedback />;
      case 'announcements':
        return <ParentAnnouncements />;
      case 'settings':
        return <ParentSettings />;
      default:
        return <ComprehensiveChildProgress />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar
        items={sidebarItems}
        activeItem={activeView}
        onItemClick={setActiveView}
        theme="purple"
      />
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;