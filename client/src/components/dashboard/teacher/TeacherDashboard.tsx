import React, { useState } from 'react';
import { Users, BookOpen, MessageSquare, Home, Settings, Calendar } from 'lucide-react';
import DashboardSidebar from '../DashboardSidebar';
import TeacherHome from './TeacherHome';
import GoogleClassroomInterface from './GoogleClassroomInterface';
import Library from './Library';
import MessageCenter from './MessageCenter';
import TeacherSettings from './TeacherSettings';
import AnnouncementCenter from './AnnouncementCenter';
import AssignmentManager from './AssignmentManager';

const TeacherDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('home');

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'classes', label: 'Class Management', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: Calendar },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'announcements', label: 'Announcements', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <TeacherHome />;
      case 'classes':
        return <GoogleClassroomInterface />;
      case 'library':
        return <Library />;
      case 'assignments':
        return <AssignmentManager />;
      case 'announcements':
        return <AnnouncementCenter />;
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