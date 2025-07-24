import React, { useState } from 'react';
import { 
  Users, BookOpen, FileText, Clock, CheckCircle, 
  MessageSquare, Download, Upload, AlertCircle 
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { assignmentsAPI, messagesAPI } from '../../../lib/api';
import { queryClient } from '../../../lib/queryClient';
import { useAuth } from '../../../contexts/AuthContext';

const StudentClassView: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'stream' | 'classwork' | 'grades'>('stream');

  // Fetch student's enrolled classes
  const { data: studentClasses = [], isLoading: classesLoading } = useQuery({
    queryKey: ['/student/classes'],
    enabled: !!user && user.role === 'student',
  });

  // Fetch assignments for student
  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['/assignments'],
    enabled: !!user && user.role === 'student',
  });

  // Fetch announcements for student
  const { data: announcements = [] } = useQuery({
    queryKey: ['/announcements'],
    enabled: !!user && user.role === 'student',
  });

  const getAssignmentStatus = (assignment: any) => {
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const isOverdue = now > dueDate;
    
    // You would check if student has submitted based on submissions data
    const isSubmitted = false; // This should come from actual submission data
    
    if (isSubmitted) return { status: 'completed', color: 'green', icon: CheckCircle };
    if (isOverdue) return { status: 'overdue', color: 'red', icon: AlertCircle };
    return { status: 'pending', color: 'yellow', icon: Clock };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">My Classes</h1>
          
          {/* Tab navigation */}
          <div className="flex space-x-8 mt-6">
            {['stream', 'classwork', 'grades'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === 'stream' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-xl font-semibold mb-4">Recent Announcements</h2>
            
            {announcements.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No announcements yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement: any) => (
                  <div key={announcement.id} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {announcement.teacher?.name?.charAt(0) || 'T'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{announcement.teacher?.name}</h3>
                          <span className="text-sm text-gray-500">
                            {new Date(announcement.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{announcement.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'classwork' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Assignments</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  All
                </button>
                <button className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200">
                  To Do
                </button>
                <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                  Done
                </button>
              </div>
            </div>

            {assignmentsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading assignments...</p>
              </div>
            ) : assignments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No assignments yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignments.map((assignment: any) => {
                  const statusInfo = getAssignmentStatus(assignment);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <div key={assignment.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg bg-${statusInfo.color}-100`}>
                            <FileText className={`w-5 h-5 text-${statusInfo.color}-600`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">{assignment.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{assignment.maxScore} points</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <StatusIcon className={`w-5 h-5 text-${statusInfo.color}-600`} />
                          <span className={`text-sm font-medium text-${statusInfo.color}-600 capitalize`}>
                            {statusInfo.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Class: {assignment.className}</span>
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors">
                              View Details
                            </button>
                            {statusInfo.status !== 'completed' && (
                              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                                Submit Work
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'grades' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">Grades</h2>
            
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700">
                  <span>Assignment</span>
                  <span>Class</span>
                  <span>Score</span>
                  <span>Status</span>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {assignments.filter((a: any) => a.score !== null).map((assignment: any) => (
                  <div key={assignment.id} className="px-6 py-4">
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div>
                        <p className="font-medium text-gray-900">{assignment.title}</p>
                        <p className="text-sm text-gray-500">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-sm text-gray-600">{assignment.className}</span>
                      <span className="text-sm font-medium">
                        {assignment.score || 'Not graded'} / {assignment.maxScore}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        assignment.score >= assignment.maxScore * 0.9
                          ? 'bg-green-100 text-green-800'
                          : assignment.score >= assignment.maxScore * 0.7
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {assignment.score >= assignment.maxScore * 0.9 ? 'Excellent' :
                         assignment.score >= assignment.maxScore * 0.7 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                  </div>
                ))}
                
                {assignments.filter((a: any) => a.score !== null).length === 0 && (
                  <div className="px-6 py-12 text-center text-gray-500">
                    <p>No grades available yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentClassView;