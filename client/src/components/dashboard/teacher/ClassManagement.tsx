import React, { useState, useEffect } from 'react';
import { Plus, Users, Copy, Settings, Upload, MessageSquare, FileText, Play, BarChart3, ArrowLeft, CheckCircle, BookOpen } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { classesAPI, assignmentsAPI, messagesAPI } from '../../../lib/api';
import { queryClient } from '../../../lib/queryClient';
import { useAuth } from '../../../contexts/AuthContext';

interface ClassView {
  type: 'list' | 'detail';
  classId?: string;
  activeTab?: string;
}

const ClassManagement: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<ClassView>({ type: 'list' });
  const [students, setStudents] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  // Assignment creation form
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    instructions: '',
    dueDate: '',
    maxScore: 100
  });

  // Use React Query for data fetching
  const { data: teacherClasses = [], isLoading: classesLoading, refetch: refetchClasses } = useQuery({
    queryKey: ['/classes'],
    enabled: !!user && user.role === 'teacher',
  });

  // Create class mutation
  const createClassMutation = useMutation({
    mutationFn: classesAPI.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/classes'] });
      setShowCreateForm(false);
      setNewClassName('');
    },
  });

  // Create assignment mutation
  const createAssignmentMutation = useMutation({
    mutationFn: assignmentsAPI.createAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/assignments'] });
      setAssignmentForm({
        title: '',
        description: '',
        instructions: '',
        dueDate: '',
        maxScore: 100
      });
    },
  });

  // Create announcement mutation
  const createAnnouncementMutation = useMutation({
    mutationFn: messagesAPI.createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/announcements'] });
    },
  });

  // Get students and assignments for a specific class
  const { data: classStudents = [] } = useQuery({
    queryKey: ['/classes', view.classId, 'students'],
    enabled: !!view.classId,
  });

  const { data: classAssignments = [] } = useQuery({
    queryKey: ['/assignments/class', view.classId],
    enabled: !!view.classId,
  });

  const handleCreateClass = () => {
    if (!newClassName.trim()) return;
    createClassMutation.mutate({ name: newClassName });
  };

  const handleCreateAssignment = () => {
    if (!assignmentForm.title.trim() || !view.classId) return;
    
    createAssignmentMutation.mutate({
      ...assignmentForm,
      classId: view.classId,
      dueDate: new Date(assignmentForm.dueDate).toISOString(),
    });
  };

      setAssignmentForm({
        title: '',
        description: '',
        instructions: '',
        dueDate: '',
        maxScore: 100
      });

      fetchClassData(view.classId);
      alert('Assignment created successfully!');
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Error creating assignment. Please try again.');
    }
  };

  const generateClassCode = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const copyClassCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Class code copied to clipboard!');
  };

  const handleClassClick = (classId: string) => {
    setView({ type: 'detail', classId, activeTab: 'overview' });
    fetchClassData(classId);
  };

  const backToList = () => {
    setView({ type: 'list' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Class Detail View
  if (view.type === 'detail' && view.classId) {
    const classData = classes.find(c => c.id === view.classId);
    
    return (
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <div className="p-4 border-b">
            <button
              onClick={backToList}
              className="flex items-center text-green-600 hover:text-green-800 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Classes
            </button>
            <h2 className="text-lg font-semibold text-gray-900">{classData?.name}</h2>
            <p className="text-sm text-gray-600">Code: {classData?.code}</p>
          </div>
          
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setView({ ...view, activeTab: 'overview' })}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                view.activeTab === 'overview' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Overview</span>
            </button>
            
            <button
              onClick={() => setView({ ...view, activeTab: 'lessons' })}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                view.activeTab === 'lessons' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Upload className="h-5 w-5" />
              <span>Upload Lessons</span>
            </button>
            
            <button
              onClick={() => setView({ ...view, activeTab: 'assignments' })}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                view.activeTab === 'assignments' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Assignments</span>
            </button>
            
            <button
              onClick={() => setView({ ...view, activeTab: 'messages' })}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                view.activeTab === 'messages' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Send Message</span>
            </button>
            
            <button
              onClick={() => setView({ ...view, activeTab: 'submissions' })}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                view.activeTab === 'submissions' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Review Submissions</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {view.activeTab === 'overview' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Class Overview</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="text-2xl font-bold text-blue-600">{students.length}</div>
                  <div className="text-sm text-blue-800">Total Students</div>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="text-2xl font-bold text-green-600">{assignments.length}</div>
                  <div className="text-sm text-green-800">Assignments</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-purple-800">Lessons</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Roster</h2>
                <div className="space-y-3">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{student.profiles?.name}</h3>
                        <p className="text-sm text-gray-500">Joined {new Date(student.enrolled_at).toLocaleDateString()}</p>
                      </div>
                      <button className="text-green-600 hover:text-green-800 text-sm">
                        View Progress
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view.activeTab === 'lessons' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Upload Lessons</h1>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors cursor-pointer">
                    <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Videos</h3>
                    <p className="text-gray-600 text-sm">Upload video lessons with interactive elements</p>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors cursor-pointer">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Quizzes</h3>
                    <p className="text-gray-600 text-sm">Create interactive quizzes and assessments</p>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Downloadable Content</h3>
                    <p className="text-gray-600 text-sm">Upload PDFs, worksheets, and resources</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view.activeTab === 'assignments' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
              </div>
              
              <div className="mb-6">
                <button
                  onClick={() => setView({ ...view, activeTab: 'create-assignment' })}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Assignment</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                        <p className="text-gray-600 mt-1">{assignment.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                          <span>Max Score: {assignment.max_score}</span>
                          <span>Submissions: {assignment.submissions?.length || 0}</span>
                        </div>
                      </div>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                        View Submissions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view.activeTab === 'create-assignment' && (
            <div>
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setView({ ...view, activeTab: 'assignments' })}
                  className="text-green-600 hover:text-green-800 mr-4"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Create Assignment</h1>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assignment Title *
                    </label>
                    <input
                      type="text"
                      value={assignmentForm.title}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter assignment title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={assignmentForm.description}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Brief description"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instructions
                    </label>
                    <textarea
                      value={assignmentForm.instructions}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Detailed instructions for students"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        value={assignmentForm.dueDate}
                        onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Score
                      </label>
                      <input
                        type="number"
                        value={assignmentForm.maxScore}
                        onChange={(e) => setAssignmentForm({ ...assignmentForm, maxScore: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        min="1"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setView({ ...view, activeTab: 'assignments' })}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={createAssignment}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Create Assignment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view.activeTab === 'messages' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Send Message</h1>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipients
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option>All Students</option>
                      <option>All Parents</option>
                      <option>Individual Student</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Message subject"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Type your message here..."
                    />
                  </div>
                  
                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          )}

          {view.activeTab === 'submissions' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Review Submissions</h1>
              
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions to review</h3>
                <p className="text-gray-600">Student submissions will appear here when assignments are completed</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Class List View
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Class Management</h1>
        <p className="text-gray-600">Manage your classes and track student progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <div key={classItem.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Users className="h-6 w-6" />
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Settings className="h-5 w-5" />
              </button>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{classItem.name}</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Class Code:</span>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-green-600 font-mono text-sm">
                    {classItem.code}
                  </code>
                  <button
                    onClick={() => copyClassCode(classItem.code)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Students:</span>
                <span className="text-sm font-medium text-gray-900">{classItem.students}</span>
              </div>
            </div>
            
            <button
              onClick={() => handleClassClick(classItem.id)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Manage Class
            </button>
          </div>
        ))}
        
        <div 
          className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors cursor-pointer"
          onClick={() => setShowCreateForm(true)}
        >
          <div className="text-center">
            <div className="p-3 rounded-full bg-gray-100 text-gray-400 mx-auto mb-4 w-fit">
              <Plus className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Class</h3>
            <p className="text-gray-600 text-sm mb-4">Set up a new class and get a unique class code</p>
          </div>
        </div>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Class</h3>
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Enter class name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
            />
            <div className="flex space-x-4">
              <button onClick={() => setShowCreateForm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={createClass} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Create Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;