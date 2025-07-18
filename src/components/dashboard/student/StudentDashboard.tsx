import React, { useState } from 'react';
import { BookOpen, Calendar, TrendingUp, Award, Star } from 'lucide-react';
import DashboardSidebar from '../DashboardSidebar';
import MyLibrary from './MyLibrary';
import Assignments from './Assignments';
import Progress from './Progress';
import MarksResults from './MarksResults';
import Achievements from './Achievements';

const StudentDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('library');

  const sidebarItems = [
    { id: 'library', label: 'My Library', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'marks', label: 'Marks & Results', icon: Star },
    { id: 'achievements', label: 'Achievements', icon: Award }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'library':
        return <MyLibrary />;
      case 'assignments':
        return <Assignments />;
      case 'progress':
        return <Progress />;
      case 'marks':
        return <MarksResults />;
      case 'achievements':
        return <Achievements />;
      default:
        return <MyLibrary />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar
        items={sidebarItems}
        activeItem={activeView}
        onItemClick={setActiveView}
        theme="blue"
      />
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;