import React from 'react';
import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const Assignments: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
  }, [user]);

  const fetchAssignments = async () => {
    try {
      // Get student's enrolled classes
      const { data: enrollments, error: enrollError } = await supabase
        .from('class_enrollments')
        .select('class_id')
        .eq('student_id', user?.id);

      if (enrollError) throw enrollError;

      const classIds = enrollments?.map(e => e.class_id) || [];

      if (classIds.length === 0) {
        setLoading(false);
        return;
      }

      // Get assignments for enrolled classes
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select(`
          *,
          books (title),
          submissions!left (
            id,
            status,
            score,
            feedback,
            submitted_at,
            graded_at
          )
        `)
        .in('class_id', classIds)
        .eq('submissions.student_id', user?.id);

      if (assignmentsError) throw assignmentsError;

      setAssignments(assignmentsData || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not-started':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'submitted':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'graded':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments</h1>
        <p className="text-gray-600">Track your assignments and stay on top of deadlines</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
            <div className="col-span-4">Assignment</div>
            <div className="col-span-3">Book</div>
            <div className="col-span-2">Due Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Action</div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                  <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                  <p className="text-sm text-gray-500">{assignment.description}</p>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-gray-900">{assignment.books?.title || 'No book assigned'}</p>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className={`text-sm ${isOverdue(assignment.due_date) && (assignment.submissions?.[0]?.status || 'not-started') !== 'graded' ? 'text-red-600' : 'text-gray-600'}`}>
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(assignment.submissions?.[0]?.status || 'not-started')}`}>
                    {getStatusIcon(assignment.submissions?.[0]?.status || 'not-started')}
                    <span className="capitalize">{(assignment.submissions?.[0]?.status || 'not-started').replace('-', ' ')}</span>
                  </div>
                </div>
                <div className="col-span-1">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {assignments.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
          <p className="text-gray-600">Your teacher will assign reading tasks that will appear here</p>
        </div>
      )}
    </div>
  );
};

export default Assignments;