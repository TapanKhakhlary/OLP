import React, { useState } from 'react';
import { Users, BookOpen, PenTool, GraduationCap, BarChart3, Book, Home, Settings } from 'lucide-react';
import DashboardSidebar from '../DashboardSidebar';
import TeacherHome from './TeacherHome';
import ClassManagement from './ClassManagement';
import Library from './Library';
import CourseManagement from './CourseManagement';
import AssignmentCreator from './AssignmentCreator';
import GradingCenter from './GradingCenter';
import Analytics from './Analytics';
import TeacherSettings from './TeacherSettings';

const TeacherDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('home');

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'classes', label: 'Class Management', icon: Users },
    { id: 'courses', label: 'Course Management', icon: Book },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'assignments', label: 'Assignment Creator', icon: PenTool },
    { id: 'grading', label: 'Grading Center', icon: GraduationCap },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <TeacherHome />;
      case 'classes':
        return <ClassManagement />;
      case 'courses':
        return <CourseManagement />;
      case 'library':
        return <Library />;
      case 'assignments':
        return <AssignmentCreator />;
      case 'grading':
        return <GradingCenter />;
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