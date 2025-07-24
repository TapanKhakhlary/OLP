import React, { useState } from 'react';
import { FileText, Plus, Calendar, Users, BookOpen, Clock, CheckCircle } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { assignmentsAPI, classesAPI, booksAPI } from '../../../lib/api';
import { queryClient } from '../../../lib/queryClient';
import { useAuth } from '../../../contexts/AuthContext';

const AssignmentManager: React.FC = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    classId: '',
    bookId: '',
    dueDate: '',
    maxScore: 100
  });

  // Fetch teacher's classes and books
  const { data: teacherClasses = [] } = useQuery({
    queryKey: ['/classes'],
    enabled: !!user && user.role === 'teacher',
  });

  const { data: books = [] } = useQuery({
    queryKey: ['/books'],
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ['/assignments'],
    enabled: !!user && user.role === 'teacher',
  });

  // Create assignment mutation
  const createAssignmentMutation = useMutation({
    mutationFn: assignmentsAPI.createAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/assignments'] });
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        instructions: '',
        classId: '',
        bookId: '',
        dueDate: '',
        maxScore: 100
      });
    },
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    createAssignmentMutation.mutate({
      ...formData,
      dueDate: new Date(formData.dueDate).toISOString()
    });
  };

  const getStatusColor = (assignment: any) => {
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const isOverdue = dueDate < now;
    
    if (isOverdue) return 'text-red-600 bg-red-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignment Manager</h1>
            <p className="text-gray-600">Create and manage assignments for your classes</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Assignment</span>
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Assignment</h2>
              
              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assignment Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Class *
                    </label>
                    <select
                      value={formData.classId}
                      onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Choose a class...</option>
                      {teacherClasses.map((classItem: any) => (
                        <option key={classItem.id} value={classItem.id}>
                          {classItem.name} ({classItem.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Related Book (Optional)
                    </label>
                    <select
                      value={formData.bookId}
                      onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">No specific book</option>
                      {books.map((book: any) => (
                        <option key={book.id} value={book.id}>
                          {book.title} - {book.author}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points/Max Score
                    </label>
                    <input
                      type="number"
                      value={formData.maxScore}
                      onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="1000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of the assignment..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Instructions
                  </label>
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Detailed instructions for students on how to complete this assignment..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createAssignmentMutation.isPending}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {createAssignmentMutation.isPending ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        <span>Create Assignment</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assignment List */}
      <div className="space-y-6">
        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
            <p className="text-gray-600 mb-4">Create your first assignment to get started</p>
          </div>
        ) : (
          assignments.map((assignment: any) => (
            <div key={assignment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">{assignment.title}</h3>
                    <div className={`ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment)}`}>
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(assignment.dueDate) > new Date() ? 'Active' : 'Overdue'}
                    </div>
                  </div>
                  
                  {assignment.description && (
                    <p className="text-gray-600 mb-3">{assignment.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>Class: {teacherClasses.find((c: any) => c.id === assignment.classId)?.name}</span>
                    </div>
                    <div>
                      <span>{assignment.maxScore} points</span>
                    </div>
                    {assignment.bookId && (
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>Book: {books.find((b: any) => b.id === assignment.bookId)?.title}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {assignment.instructions && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{assignment.instructions}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignmentManager;