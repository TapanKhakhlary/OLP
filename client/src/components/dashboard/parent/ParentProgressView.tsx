import React, { useState } from 'react';
import { 
  User, BookOpen, FileText, TrendingUp, Calendar,
  CheckCircle, Clock, AlertCircle, MessageSquare, Award
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';

const ParentProgressView: React.FC = () => {
  const { user } = useAuth();
  const [selectedChild, setSelectedChild] = useState<string>('');

  // Fetch parent's children
  const { data: children = [], isLoading: childrenLoading } = useQuery({
    queryKey: ['/parent/children'],
    enabled: !!user && user.role === 'parent',
  });

  // Fetch child's progress data
  const { data: childProgress = null, isLoading: progressLoading } = useQuery({
    queryKey: ['/parent/child-progress', selectedChild],
    enabled: !!selectedChild,
  });

  // Fetch child's classes and assignments
  const { data: childClasses = [] } = useQuery({
    queryKey: ['/parent/child-classes', selectedChild],
    enabled: !!selectedChild,
  });

  const { data: childAssignments = [] } = useQuery({
    queryKey: ['/parent/child-assignments', selectedChild],
    enabled: !!selectedChild,
  });

  const { data: childAnnouncements = [] } = useQuery({
    queryKey: ['/parent/child-announcements', selectedChild],
    enabled: !!selectedChild,
  });

  const calculateOverallGrade = (assignments: any[]) => {
    if (!assignments.length) return 0;
    const gradedAssignments = assignments.filter(a => a.score !== null);
    if (!gradedAssignments.length) return 0;
    
    const totalPoints = gradedAssignments.reduce((sum, a) => sum + a.score, 0);
    const maxPoints = gradedAssignments.reduce((sum, a) => sum + a.maxScore, 0);
    return Math.round((totalPoints / maxPoints) * 100);
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAssignmentStatusCounts = (assignments: any[]) => {
    const completed = assignments.filter(a => a.status === 'submitted' || a.status === 'graded').length;
    const pending = assignments.filter(a => a.status === 'not-started' || a.status === 'in-progress').length;
    const overdue = assignments.filter(a => {
      const dueDate = new Date(a.dueDate);
      const now = new Date();
      return now > dueDate && (a.status === 'not-started' || a.status === 'in-progress');
    }).length;
    
    return { completed, pending, overdue };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Child Progress</h1>
          
          {/* Child selector */}
          {children.length > 0 && (
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">Select Child:</label>
              <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a child</option>
                {children.map((child: any) => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {childrenLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading children...</p>
          </div>
        ) : children.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Children Linked</h3>
            <p className="text-gray-600 mb-4">
              Link your child's account to monitor their progress.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Link Child Account
            </button>
          </div>
        ) : !selectedChild ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600">Select a child to view their progress.</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overall Grade</p>
                    <p className={`text-2xl font-bold ${getGradeColor(calculateOverallGrade(childAssignments))}`}>
                      {calculateOverallGrade(childAssignments)}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Classes Enrolled</p>
                    <p className="text-2xl font-bold text-gray-900">{childClasses.length}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Assignments</p>
                    <p className="text-2xl font-bold text-gray-900">{childAssignments.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                    <p className="text-2xl font-bold text-green-600">
                      {childAssignments.length > 0 
                        ? Math.round((getAssignmentStatusCounts(childAssignments).completed / childAssignments.length) * 100)
                        : 0}%
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Assignments */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Assignments</h3>
                
                {childAssignments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No assignments yet.</p>
                ) : (
                  <div className="space-y-3">
                    {childAssignments.slice(0, 5).map((assignment: any) => {
                      const dueDate = new Date(assignment.dueDate);
                      const isOverdue = new Date() > dueDate && assignment.status !== 'submitted';
                      
                      return (
                        <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${
                              assignment.status === 'submitted' ? 'bg-green-100' :
                              isOverdue ? 'bg-red-100' : 'bg-yellow-100'
                            }`}>
                              {assignment.status === 'submitted' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : isOverdue ? (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              ) : (
                                <Clock className="w-4 h-4 text-yellow-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{assignment.title}</p>
                              <p className="text-sm text-gray-500">
                                Due: {dueDate.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            {assignment.score !== null ? (
                              <p className="font-medium text-gray-900">
                                {assignment.score}/{assignment.maxScore}
                              </p>
                            ) : (
                              <p className={`text-sm font-medium ${
                                assignment.status === 'submitted' ? 'text-blue-600' :
                                isOverdue ? 'text-red-600' : 'text-yellow-600'
                              }`}>
                                {assignment.status === 'submitted' ? 'Submitted' :
                                 isOverdue ? 'Overdue' : 'Pending'}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Class Performance */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Class Performance</h3>
                
                {childClasses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No classes enrolled.</p>
                ) : (
                  <div className="space-y-4">
                    {childClasses.map((classItem: any) => {
                      const classAssignments = childAssignments.filter(a => a.classId === classItem.id);
                      const grade = calculateOverallGrade(classAssignments);
                      
                      return (
                        <div key={classItem.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{classItem.name}</h4>
                            <span className={`text-lg font-bold ${getGradeColor(grade)}`}>
                              {grade || 'N/A'}%
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Teacher: {classItem.teacherName}</span>
                            <span>{classAssignments.length} assignments</span>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  grade >= 90 ? 'bg-green-500' :
                                  grade >= 80 ? 'bg-blue-500' :
                                  grade >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${grade}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Announcements */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Announcements</h3>
              
              {childAnnouncements.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent announcements.</p>
              ) : (
                <div className="space-y-4">
                  {childAnnouncements.slice(0, 3).map((announcement: any) => (
                    <div key={announcement.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{announcement.teacherName}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(announcement.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{announcement.content}</p>
                        <p className="text-sm text-gray-500 mt-1">Class: {announcement.className}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentProgressView;