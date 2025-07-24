import React from 'react';
import { Bell, Calendar, Megaphone, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { messagesAPI } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';

const StudentAnnouncements: React.FC = () => {
  const { user } = useAuth();

  // Fetch announcements for student
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['/announcements'],
    enabled: !!user && user.role === 'student',
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading announcements...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
        <p className="text-gray-600">Important updates from your teachers</p>
      </div>

      <div className="space-y-6">
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements yet</h3>
            <p className="text-gray-600">Your teachers haven't posted any announcements yet</p>
          </div>
        ) : (
          announcements.map((announcement: any) => (
            <div key={announcement.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    {announcement.type === 'notification' ? (
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Megaphone className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {announcement.type === 'notification' ? 'Important Notification' : 'Class Announcement'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      From: {announcement.senderName || 'Teacher'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(announcement.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="text-gray-700 leading-relaxed">
                {announcement.content}
              </div>
              
              {announcement.type === 'notification' && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-amber-600 mr-2" />
                    <span className="text-sm font-medium text-amber-800">Important Notice</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentAnnouncements;