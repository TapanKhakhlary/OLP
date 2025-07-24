import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Users, Clock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const StudentHome: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [recentAssignments, setRecentAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      // Get enrolled classes
      const { data: enrollments, error: enrollError } = await supabase
        .from('class_enrollments')
        .select(`
          *,
          classes (
            id,
            name,
            code,
            profiles (name)
          )
        `)
        .eq('student_id', user?.id);

      if (enrollError) throw enrollError;

      setClasses(enrollments || []);

      // Get recent assignments
      const classIds = enrollments?.map(e => e.class_id) || [];
      if (classIds.length > 0) {
        const { data: assignments, error: assignmentsError } = await supabase
          .from('assignments')
          .select(`
            *,
            submissions!left (
              id,
              status,
              submitted_at
            )
          `)
          .in('class_id', classIds)
          .eq('submissions.student_id', user?.id)
          .order('due_date', { ascending: true })
          .limit(5);

        if (assignmentsError) throw assignmentsError;
        setRecentAssignments(assignments || []);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
          
          {classes.length > 0 ? (
            <div className="space-y-3">
              {classes.map((enrollment) => (
                <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <h3 className="font-medium text-gray-900">{enrollment.classes.name}</h3>
                  <p className="text-sm text-gray-600">Code: {enrollment.classes.code}</p>
                  <p className="text-sm text-gray-500">Teacher: {enrollment.classes.profiles?.name}</p>
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
          
          {recentAssignments.length > 0 ? (
            <div className="space-y-3">
              {recentAssignments.map((assignment) => (
                <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      Due: {new Date(assignment.due_date).toLocaleDateString()}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      assignment.submissions?.[0]?.status === 'submitted' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {assignment.submissions?.[0]?.status || 'Not started'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No assignments yet</p>
              <p className="text-sm text-gray-500">Your assignments will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">{classes.length}</div>
          <div className="text-sm text-blue-800">Classes Joined</div>
        </div>
        <div className="bg-green-50 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-green-600">
            {recentAssignments.filter(a => a.submissions?.[0]?.status === 'submitted').length}
          </div>
          <div className="text-sm text-green-800">Assignments Submitted</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {recentAssignments.filter(a => !a.submissions?.[0] || a.submissions[0].status === 'not-started').length}
          </div>
          <div className="text-sm text-yellow-800">Pending Assignments</div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;