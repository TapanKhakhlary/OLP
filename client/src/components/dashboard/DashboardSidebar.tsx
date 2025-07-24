import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardSidebarProps {
  items: SidebarItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
  theme: 'blue' | 'green' | 'purple';
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  items, 
  activeItem, 
  onItemClick, 
  theme 
}) => {
  const { user, logout } = useAuth();

  const themeClasses = {
    blue: {
      bg: 'bg-blue-900',
      active: 'bg-blue-700',
      hover: 'hover:bg-blue-800',
      text: 'text-blue-100'
    },
    green: {
      bg: 'bg-green-900',
      active: 'bg-green-700',
      hover: 'hover:bg-green-800',
      text: 'text-green-100'
    },
    purple: {
      bg: 'bg-purple-900',
      active: 'bg-purple-700',
      hover: 'hover:bg-purple-800',
      text: 'text-purple-100'
    }
  };

  const colors = themeClasses[theme];

  return (
    <div className={`${colors.bg} min-h-screen w-64 p-4`}>
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <User className="h-8 w-8 text-white" />
          <div>
            <h3 className="text-white font-semibold">{user?.name}</h3>
            <p className={`text-sm ${colors.text} capitalize`}>{user?.role}</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              activeItem === item.id
                ? `${colors.active} text-white`
                : `text-white ${colors.hover}`
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={logout}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-white ${colors.hover} transition-colors`}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;