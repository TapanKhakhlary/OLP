import React, { useState } from 'react';
import { Send, MessageSquare, Users, Bell, Megaphone } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { messagesAPI, classesAPI } from '../../../lib/api';
import { queryClient } from '../../../lib/queryClient';
import { useAuth } from '../../../contexts/AuthContext';

const AnnouncementCenter: React.FC = () => {
  const { user } = useAuth();
  const [announcementForm, setAnnouncementForm] = useState({
    classId: '',
    content: '',
    type: 'announcement' // announcement, notification
  });

  // Fetch teacher's classes
  const { data: teacherClasses = [] } = useQuery({
    queryKey: ['/classes'],
    enabled: !!user && user.role === 'teacher',
  });

  // Fetch announcements
  const { data: announcements = [] } = useQuery({
    queryKey: ['/announcements'],
    enabled: !!user && user.role === 'teacher',
  });

  // Create announcement mutation
  const createAnnouncementMutation = useMutation({
    mutationFn: messagesAPI.createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/announcements'] });
      setAnnouncementForm({
        classId: '',
        content: '',
        type: 'announcement'
      });
    },
  });

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementForm.content.trim() || !announcementForm.classId) return;

    createAnnouncementMutation.mutate({
      content: announcementForm.content,
      classId: announcementForm.classId,
      type: announcementForm.type
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcement Center</h1>
        <p className="text-gray-600">Send announcements to students and parents in your classes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Send Announcement */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Megaphone className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Create Announcement</h2>
          </div>
          
          <form onSubmit={handleSendAnnouncement} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class
              </label>
              <select
                value={announcementForm.classId}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, classId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a class...</option>
                {teacherClasses.map((classItem: any) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name} ({classItem.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Announcement Type
              </label>
              <select
                value={announcementForm.type}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="announcement">Class Announcement</option>
                <option value="notification">Important Notification</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={announcementForm.content}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your announcement here... This will be sent to all students and parents in the selected class."
                required
              />
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start">
                <Bell className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Who will receive this announcement:</p>
                  <ul className="space-y-1">
                    <li>• All students enrolled in the selected class</li>
                    <li>• All parents linked to students in the class</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={createAnnouncementMutation.isPending}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {createAnnouncementMutation.isPending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Announcement</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Recent Announcements */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <MessageSquare className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Recent Announcements</h2>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {announcements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Megaphone className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No announcements sent yet</p>
              </div>
            ) : (
              announcements.map((announcement: any) => (
                <div key={announcement.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {teacherClasses.find((c: any) => c.id === announcement.classId)?.name || 'Unknown Class'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{announcement.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCenter;