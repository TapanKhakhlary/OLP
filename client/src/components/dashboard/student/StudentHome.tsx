import React from 'react';
import { BookOpen, Calendar, Users, Clock, TrendingUp, Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import { getQueryKey } from '../../../lib/queryClient';

const StudentHome: React.FC = () => {
  const { user } = useAuth();

  const { data: enrolledClasses = [], isLoading: classesLoading } = useQuery({
    queryKey: getQueryKey('/student/classes'),
  });

  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: getQueryKey('/assignments'),
  });

  const { data: announcements = [], isLoading: announcementsLoading } = useQuery({
    queryKey: getQueryKey('/announcements'),
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
          
          {Array.isArray(enrolledClasses) && enrolledClasses.length > 0 ? (
            <div className="space-y-3">
              {enrolledClasses.map((enrollment: any) => (
                <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{enrollment.class?.name || 'Unnamed Class'}</h3>
                      <p className="text-sm text-gray-600 mt-1">{enrollment.class?.description || 'No description'}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <p className="text-sm text-gray-500">Teacher: {enrollment.teacher?.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">Code: {enrollment.class?.code || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Joined</p>
                      <p className="text-xs text-gray-600">{new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center mt-4">
                <p className="text-sm text-blue-600 font-medium">{enrolledClasses.length} class{enrolledClasses.length === 1 ? '' : 'es'} joined</p>
              </div>
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
          
          {Array.isArray(assignments) && assignments.length > 0 ? (
            <div className="space-y-3">
              {assignments.slice(0, 5).map((assignment: any) => (
                <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{assignment.description || 'No description'}</p>
                      {assignment.topic && (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-2">
                          {assignment.topic}
                        </span>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-center text-xs text-red-600 mb-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Due</span>
                      </div>
                      <p className="text-xs text-gray-600">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center mt-4">
                <p className="text-sm text-blue-600 font-medium">{assignments.length} assignment{assignments.length === 1 ? '' : 's'} total</p>
              </div>
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
          
          {Array.isArray(announcements) && announcements.length > 0 ? (
            <div className="space-y-3">
              {announcements.slice(0, 3).map((announcement: any) => (
                <div key={announcement.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Bell className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{announcement.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(announcement.createdAt).toLocaleDateString()} at{' '}
                        {new Date(announcement.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center mt-4">
                <p className="text-sm text-blue-600 font-medium">{announcements.length} announcement{announcements.length === 1 ? '' : 's'} total</p>
              </div>
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

      {/* Quick Stats - Google Classroom Style */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="bg-blue-600 text-white rounded-lg p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-8 w-8" />
          </div>
          <p className="text-3xl font-bold">{Array.isArray(enrolledClasses) ? enrolledClasses.length : 0}</p>
          <p className="text-sm opacity-90">Classes Joined</p>
        </div>
        
        <div className="bg-green-600 text-white rounded-lg p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="h-8 w-8" />
          </div>
          <p className="text-3xl font-bold">{Array.isArray(assignments) ? assignments.length : 0}</p>
          <p className="text-sm opacity-90">Assignments</p>
        </div>
        
        <div className="bg-purple-600 text-white rounded-lg p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Bell className="h-8 w-8" />
          </div>
          <p className="text-3xl font-bold">{Array.isArray(announcements) ? announcements.length : 0}</p>
          <p className="text-sm opacity-90">Announcements</p>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;