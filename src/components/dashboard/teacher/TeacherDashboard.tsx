import React, { useState } from 'react';
import { Users, BookOpen, PenTool, GraduationCap, BarChart3 } from 'lucide-react';
import DashboardSidebar from '../DashboardSidebar';
import ClassManagement from './ClassManagement';
import ContentLibrary from './ContentLibrary';
import AssignmentCreator from './AssignmentCreator';
import GradingCenter from './GradingCenter';
import Analytics from './Analytics';

const TeacherDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('classes');

  const sidebarItems = [
    { id: 'classes', label: 'Class Management', icon: Users },
    { id: 'library', label: 'Content Library', icon: BookOpen },
    { id: 'assignments', label: 'Assignment Creator', icon: PenTool },
    { id: 'grading', label: 'Grading Center', icon: GraduationCap },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'classes':
        return <ClassManagement />;
      case 'library':
        return <ContentLibrary />;
      case 'assignments':
        return <AssignmentCreator />;
      case 'grading':
        return <GradingCenter />;
      case 'analytics':
        return <Analytics />;
      default:
        return <ClassManagement />;
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