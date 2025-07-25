import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import { apiRequest } from '../../../lib/queryClient';
import { useAuth } from '../../../contexts/AuthContext';

const TeacherHome: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [recentAssignments, setRecentAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTeacherData();
    }
  }, [user]);

  const fetchTeacherData = async () => {
    try {
      // Get teacher's classes
      const classesData = await apiRequest(`/classes`);
      setClasses(Array.isArray(classesData) ? classesData : []);

      // Get recent assignments
      const assignments = await apiRequest(`/assignments`);
      setRecentAssignments(Array.isArray(assignments) ? assignments.slice(0, 5) : []);
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const totalStudents = classes.reduce((sum, cls) => sum + cls.studentCount, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here's an overview of your classes and assignments</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-green-50 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-green-600">{classes.length}</div>
          <div className="text-sm text-green-800">Active Classes</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalStudents}</div>
          <div className="text-sm text-blue-800">Total Students</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-purple-600">{recentAssignments.length}</div>
          <div className="text-sm text-purple-800">Recent Assignments</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-yellow-600">0</div>
          <div className="text-sm text-yellow-800">Pending Reviews</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Classes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">My Classes</h2>
          </div>
          
          {classes.length > 0 ? (
            <div className="space-y-3">
              {classes.map((classItem) => (
                <div key={classItem.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{classItem.name}</h3>
                      <p className="text-sm text-gray-600">Code: {classItem.code}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {classItem.studentCount} students
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No classes created yet</p>
              <p className="text-sm text-gray-500">Create your first class to get started</p>
            </div>
          )}
        </div>

        {/* Recent Assignments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Calendar className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Recent Assignments</h2>
          </div>
          
          {recentAssignments.length > 0 ? (
            <div className="space-y-3">
              {recentAssignments.map((assignment) => (
                <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      Due: {new Date(assignment.due_date).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      Max Score: {assignment.max_score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No assignments created yet</p>
              <p className="text-sm text-gray-500">Create assignments to track student progress</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherHome;