import React, { useState } from 'react';
import { User, Bell, Shield, Mail } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const StudentSettings: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    assignments: true,
    grades: true,
    announcements: true,
    reminders: true
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <User className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={user?.name || ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <input
                type="text"
                value="Student"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
              <input
                type="text"
                value={user?.id || ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student Code (for Parent Linking)</label>
              <div className="relative">
                <input
                  type="text"
                  value={user?.studentCode || 'Not Available'}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-blue-50 text-blue-900 font-mono text-lg font-bold text-center"
                />
                <div className="mt-2 text-xs text-gray-600">
                  Share this code with your parents to link their account
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
              <input
                type="text"
                value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { key: 'assignments', label: 'New Assignments', description: 'Get notified when teachers assign new work' },
              { key: 'grades', label: 'Grades & Feedback', description: 'Receive notifications when assignments are graded' },
              { key: 'announcements', label: 'Class Announcements', description: 'Stay updated with class announcements' },
              { key: 'reminders', label: 'Due Date Reminders', description: 'Get reminded about upcoming assignment deadlines' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{item.label}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[item.key as keyof typeof notifications]}
                    onChange={() => handleNotificationChange(item.key as keyof typeof notifications)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Privacy & Security</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Data Privacy</h3>
              <p className="text-sm text-gray-600 mb-3">
                Your reading progress and assignment data is private and only shared with your teachers.
              </p>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Privacy Policy
              </button>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Account Security</h3>
              <p className="text-sm text-gray-600 mb-3">
                Keep your account secure by using a strong password.
              </p>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Mail className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Support</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-3">
                Contact our support team if you have any questions or issues.
              </p>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSettings;