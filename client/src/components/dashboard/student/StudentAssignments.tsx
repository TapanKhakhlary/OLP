import React, { useState } from 'react';
import { FileText, Calendar, Clock, CheckCircle, AlertCircle, Star, ChevronRight } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { assignmentsAPI } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';

const StudentAssignments: React.FC = () => {
  const { user } = useAuth();
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  // Fetch student assignments
  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['/assignments'],
    enabled: !!user && user.role === 'student',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started': return 'text-gray-600 bg-gray-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'submitted': return 'text-green-600 bg-green-100';
      case 'graded': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not-started': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4" />;
      case 'submitted': return <CheckCircle className="h-4 w-4" />;
      case 'graded': return <Star className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading assignments...</span>
      </div>
    );
  }

  if (selectedAssignment) {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={() => setSelectedAssignment(null)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Back to assignments
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedAssignment.title}</h1>
          <p className="text-gray-600">{selectedAssignment.description}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Status</h3>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAssignment.status)}`}>
                {getStatusIcon(selectedAssignment.status)}
                <span className="ml-1 capitalize">{selectedAssignment.status.replace('-', ' ')}</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Due Date</h3>
              <div className="flex items-center text-sm text-gray-900">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                <span className="ml-2 text-gray-600">({getDaysUntilDue(selectedAssignment.dueDate)})</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Points</h3>
              <p className="text-sm text-gray-900">{selectedAssignment.maxScore} points</p>
            </div>
            {selectedAssignment.score !== null && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Your Score</h3>
                <p className="text-sm text-gray-900 font-semibold">
                  {selectedAssignment.score}/{selectedAssignment.maxScore}
                </p>
              </div>
            )}
          </div>

          {selectedAssignment.instructions && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instructions</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedAssignment.instructions}</p>
              </div>
            </div>
          )}

          {selectedAssignment.feedback && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Teacher Feedback</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-900">{selectedAssignment.feedback}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            {selectedAssignment.status === 'not-started' && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Start Assignment
              </button>
            )}
            {selectedAssignment.status === 'in-progress' && (
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Submit Assignment
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments</h1>
        <p className="text-gray-600">View and complete your assignments</p>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
          <p className="text-gray-600">Your teachers haven't assigned any work yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment: any) => {
            const daysUntilDue = getDaysUntilDue(assignment.dueDate);
            const isOverdue = daysUntilDue === 'Overdue';
            
            return (
              <div
                key={assignment.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer ${
                  isOverdue ? 'border-red-200 bg-red-50' : ''
                }`}
                onClick={() => setSelectedAssignment(assignment)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <FileText className="h-5 w-5 text-gray-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                      <div className={`ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                        {getStatusIcon(assignment.status)}
                        <span className="ml-1 capitalize">{assignment.status.replace('-', ' ')}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{assignment.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                          {daysUntilDue}
                        </span>
                      </div>
                      <div>
                        <span>{assignment.maxScore} points</span>
                      </div>
                      {assignment.score !== null && (
                        <div>
                          <span className="font-medium">Score: {assignment.score}/{assignment.maxScore}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;