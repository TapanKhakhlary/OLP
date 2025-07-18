import React, { useState } from 'react';
import { TrendingUp, MessageSquare, BookOpen } from 'lucide-react';
import DashboardSidebar from '../DashboardSidebar';
import ChildProgress from './ChildProgress';
import ResultsFeedback from './ResultsFeedback';
import Messages from './Messages';

const ParentDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('progress');

  const sidebarItems = [
    { id: 'progress', label: "Child's Progress", icon: TrendingUp },
    { id: 'results', label: 'Results & Feedback', icon: BookOpen },
    { id: 'messages', label: 'Messages', icon: MessageSquare }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'progress':
        return <ChildProgress />;
      case 'results':
        return <ResultsFeedback />;
      case 'messages':
        return <Messages />;
      default:
        return <ChildProgress />;
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