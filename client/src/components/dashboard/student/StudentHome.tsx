import React from 'react';
import { BookOpen, Calendar, Users, Clock, TrendingUp, Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';

const StudentHome: React.FC = () => {
  const { user } = useAuth();

  const { data: enrolledClasses = [], isLoading: classesLoading } = useQuery({
    queryKey: ['/api/student/classes'],
  });

  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['/api/assignments'],
  });

  const { data: announcements = [], isLoading: announcementsLoading } = useQuery({
    queryKey: ['/api/announcements'],
  });

  const isLoading = classesLoading || assignmentsLoading || announcementsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here's what's happening in your classes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Classes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">My Classes</h2>
          </div>
          
          {enrolledClasses.length > 0 ? (
            <div className="space-y-3">
              {enrolledClasses.map((enrollment: any) => (
                <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <h3 className="font-medium text-gray-900">{enrollment.class?.name}</h3>
                  <p className="text-sm text-gray-600">Code: {enrollment.class?.code}</p>
                  <p className="text-sm text-gray-500">Teacher: {enrollment.teacher?.name}</p>
                  <p className="text-xs text-gray-400">Joined: {new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">You haven't joined any classes yet</p>
              <p className="text-sm text-gray-500">Use the "Join Class" section to get started</p>
            </div>
          )}
        </div>

        {/* Recent Assignments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Calendar className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Recent Assignments</h2>
          </div>
          
          {assignments.length > 0 ? (
            <div className="space-y-3">
              {assignments.slice(0, 5).map((assignment: any) => (
                <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                  <p className="text-sm text-gray-600">{assignment.description}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No assignments yet</p>
              <p className="text-sm text-gray-500">Assignments will appear here when teachers create them</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        {/* Recent Announcements */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Recent Announcements</h2>
          </div>
          
          {announcements.length > 0 ? (
            <div className="space-y-3">
              {announcements.slice(0, 3).map((announcement: any) => (
                <div key={announcement.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <p className="text-gray-900">{announcement.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No announcements yet</p>
              <p className="text-sm text-gray-500">Teachers' announcements will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <Users className="h-8 w-8 mr-3" />
            <div>
              <p className="text-sm opacity-90">Classes Joined</p>
              <p className="text-2xl font-bold">{enrolledClasses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 mr-3" />
            <div>
              <p className="text-sm opacity-90">Assignments</p>
              <p className="text-2xl font-bold">{assignments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <Bell className="h-8 w-8 mr-3" />
            <div>
              <p className="text-sm opacity-90">Announcements</p>
              <p className="text-2xl font-bold">{announcements.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;