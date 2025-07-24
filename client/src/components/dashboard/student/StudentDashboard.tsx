import React, { useState } from 'react';
import { BookOpen, Calendar, TrendingUp, Award, Star, Home, CheckSquare, Settings, UserPlus, Users, Bell } from 'lucide-react';
import DashboardSidebar from '../DashboardSidebar';
import StudentHome from './StudentHome';
import MyLibrary from './MyLibrary';
import StudentAssignments from './StudentAssignments';
import Progress from './Progress';
import MarksResults from './MarksResults';
import Achievements from './Achievements';
import JoinClass from './JoinClass';
import StudentClassView from './StudentClassView';
import TodoList from './TodoList';
import StudentSettings from './StudentSettings';
import StudentAnnouncements from './StudentAnnouncements';

const StudentDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('home');

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'library', label: 'My Library', icon: BookOpen },
    { id: 'todo', label: 'To-do', icon: CheckSquare },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'marks', label: 'Marks & Results', icon: Star },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'join-class', label: 'Join Class', icon: UserPlus },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <StudentHome />;
      case 'library':
        return <MyLibrary />;
      case 'todo':
        return <TodoList />;
      case 'progress':
        return <Progress />;
      case 'marks':
        return <MarksResults />;
      case 'achievements':
        return <Achievements />;
      case 'join-class':
        return <JoinClass />;
      case 'announcements':
        return <StudentAnnouncements />;
      case 'settings':
        return <StudentSettings />;
      default:
        return <StudentHome />;
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