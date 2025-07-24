import React, { useState } from 'react';
import { 
  Plus, Users, Copy, Settings, MessageSquare, FileText, 
  BookOpen, CheckCircle, Clock, AlertCircle, ArrowLeft,
  MoreVertical, Share, Archive, Edit3, Trash2
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { classesAPI, assignmentsAPI, messagesAPI } from '../../../lib/api';
import { queryClient } from '../../../lib/queryClient';
import { useAuth } from '../../../contexts/AuthContext';

interface ClassView {
  type: 'list' | 'detail';
  classId?: string;
  activeTab?: 'stream' | 'classwork' | 'people' | 'grades';
}

const GoogleClassroomInterface: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<ClassView>({ type: 'list' });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');

  // Assignment form state
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    instructions: '',
    dueDate: '',
    maxScore: 100
  });

  // Fetch teacher's classes
  const { data: teacherClasses = [], isLoading: classesLoading } = useQuery({
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
      setShowAssignmentForm(false);
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
      setShowAnnouncementForm(false);
      setAnnouncementText('');
    },
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

  const handleCreateAnnouncement = () => {
    if (!announcementText.trim() || !view.classId) return;
    
    createAnnouncementMutation.mutate({
      content: announcementText,
      classId: view.classId,
    });
  };

  const copyClassCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  if (view.type === 'list') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Classes</h1>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Class
            </button>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="p-6">
          {classesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading classes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teacherClasses.map((classItem: any) => (
                <div
                  key={classItem.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setView({ type: 'detail', classId: classItem.id, activeTab: 'stream' })}
                >
                  {/* Class header with gradient background */}
                  <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle options menu
                        }}
                        className="p-1 text-white hover:bg-white/20 rounded"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-4">
                      <h3 className="text-white font-semibold text-lg truncate">{classItem.name}</h3>
                    </div>
                  </div>
                  
                  {/* Class info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">Class code</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyClassCode(classItem.code);
                        }}
                        className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <span className="font-mono">{classItem.code}</span>
                        <Copy className="w-3 h-3 ml-1" />
                      </button>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{classItem.studentCount || 0} students</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Class Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Create Class</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class Name *
                  </label>
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Enter class name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewClassName('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateClass}
                  disabled={!newClassName.trim() || createClassMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {createClassMutation.isPending ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Class detail view with tabs (similar to Google Classroom)
  const selectedClass = teacherClasses.find((c: any) => c.id === view.classId);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center">
            <button
              onClick={() => setView({ type: 'list' })}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{selectedClass?.name}</h1>
              <p className="text-sm text-gray-600">Class code: {selectedClass?.code}</p>
            </div>
          </div>
          
          {/* Tab navigation */}
          <div className="flex space-x-8 mt-6">
            {['stream', 'classwork', 'people', 'grades'].map((tab) => (
              <button
                key={tab}
                onClick={() => setView({ ...view, activeTab: tab as any })}
                className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  view.activeTab === tab
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
        {view.activeTab === 'stream' && (
          <div className="max-w-4xl mx-auto">
            {/* Announcement composer */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0) || 'T'}
                  </span>
                </div>
                <div className="flex-1">
                  <button
                    onClick={() => setShowAnnouncementForm(true)}
                    className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-500"
                  >
                    Share something with your class...
                  </button>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => setShowAssignmentForm(true)}
                className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <FileText className="w-6 h-6 text-blue-600 mr-3" />
                <span className="font-medium">Create Assignment</span>
              </button>
              <button className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <BookOpen className="w-6 h-6 text-green-600 mr-3" />
                <span className="font-medium">Add Material</span>
              </button>
              <button className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <MessageSquare className="w-6 h-6 text-purple-600 mr-3" />
                <span className="font-medium">Send Message</span>
              </button>
            </div>

            {/* Stream content would go here */}
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No announcements yet. Share something with your class!</p>
            </div>
          </div>
        )}

        {view.activeTab === 'classwork' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Classwork</h2>
              <button
                onClick={() => setShowAssignmentForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </button>
            </div>
            
            {/* Assignments list would go here */}
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No assignments yet. Create your first assignment!</p>
            </div>
          </div>
        )}

        {view.activeTab === 'people' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">People</h2>
            {/* Students list would go here */}
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No students enrolled yet. Share your class code!</p>
            </div>
          </div>
        )}
      </div>

      {/* Assignment Creation Modal */}
      {showAssignmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Create Assignment</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  placeholder="Assignment title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                  placeholder="Assignment description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea
                  value={assignmentForm.instructions}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })}
                  placeholder="Detailed instructions for students"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    value={assignmentForm.dueDate}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Score
                  </label>
                  <input
                    type="number"
                    value={assignmentForm.maxScore}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, maxScore: parseInt(e.target.value) || 100 })}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAssignmentForm(false);
                  setAssignmentForm({
                    title: '',
                    description: '',
                    instructions: '',
                    dueDate: '',
                    maxScore: 100
                  });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAssignment}
                disabled={!assignmentForm.title.trim() || createAssignmentMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {createAssignmentMutation.isPending ? 'Creating...' : 'Create Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnouncementForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Create Announcement</h2>
            <textarea
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="Share something with your class..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowAnnouncementForm(false);
                  setAnnouncementText('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAnnouncement}
                disabled={!announcementText.trim() || createAnnouncementMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {createAnnouncementMutation.isPending ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleClassroomInterface;