import React, { useState, useEffect } from 'react';
import { CheckSquare, Clock, AlertCircle, Calendar } from 'lucide-react';
import { apiRequest } from '../../../lib/queryClient';
import { useAuth } from '../../../contexts/AuthContext';

interface TodoItem {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: string;
  type: 'assignment' | 'reading';
  class_name?: string;
}

const TodoList: React.FC = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    try {
      // Get student's assignments through the API
      const assignmentsData = await apiRequest(`/student/assignments`);
      
      // Transform assignments into todo items
      const todoItems: TodoItem[] = Array.isArray(assignmentsData) ? assignmentsData.map((assignment: any) => ({
        id: assignment.id,
        title: assignment.title,
        description: assignment.description || '',
        due_date: assignment.dueDate,
        status: assignment.submissions?.[0]?.status || 'not-started',
        type: 'assignment' as const,
        class_name: assignment.class?.name
      })) : [];

      setTodos(todoItems);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'graded':
      case 'submitted':
        return <CheckSquare className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'graded':
      case 'submitted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && !['submitted', 'graded'].includes(status);
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'pending':
        return !['submitted', 'graded'].includes(todo.status);
      case 'completed':
        return ['submitted', 'graded'].includes(todo.status);
      default:
        return true;
    }
  });

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">To-do</h1>
        <p className="text-gray-600">Keep track of your assignments and deadlines</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'all', label: 'All', count: todos.length },
              { key: 'pending', label: 'Pending', count: todos.filter(t => !['submitted', 'graded'].includes(t.status)).length },
              { key: 'completed', label: 'Completed', count: todos.filter(t => ['submitted', 'graded'].includes(t.status)).length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-4">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
              isOverdue(todo.due_date, todo.status)
                ? 'border-red-500'
                : ['submitted', 'graded'].includes(todo.status)
                ? 'border-green-500'
                : 'border-blue-500'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getStatusIcon(todo.status)}
                  <h3 className="text-lg font-medium text-gray-900">{todo.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(todo.status)}`}>
                    {todo.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                
                {todo.description && (
                  <p className="text-gray-600 mb-3">{todo.description}</p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span className={isOverdue(todo.due_date, todo.status) ? 'text-red-600 font-medium' : ''}>
                      Due: {new Date(todo.due_date).toLocaleDateString()}
                      {isOverdue(todo.due_date, todo.status) && ' (Overdue)'}
                    </span>
                  </div>
                  {todo.class_name && (
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {todo.class_name}
                    </span>
                  )}
                </div>
              </div>
              
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-4">
                {['submitted', 'graded'].includes(todo.status) ? 'View' : 'Start'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTodos.length === 0 && (
        <div className="text-center py-12">
          <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No tasks yet' : 
             filter === 'pending' ? 'No pending tasks' : 'No completed tasks'}
          </h3>
          <p className="text-gray-600">
            {filter === 'all' ? 'Your assignments and tasks will appear here' :
             filter === 'pending' ? 'Great job! No pending assignments' : 'Complete some assignments to see them here'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TodoList;