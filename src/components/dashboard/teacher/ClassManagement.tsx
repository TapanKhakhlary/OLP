import React, { useState } from 'react';
import { useEffect } from 'react';
import { Plus, Users, Copy, Settings } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const ClassManagement: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  useEffect(() => {
    if (user) {
      fetchClasses();
    }
  }, [user]);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          class_enrollments (
            id,
            student_id,
            profiles (
              name
            )
          )
        `)
        .eq('teacher_id', user?.id);

      if (error) throw error;

      const classesWithCounts = data?.map(cls => ({
        ...cls,
        students: cls.class_enrollments?.length || 0
      })) || [];

      setClasses(classesWithCounts);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassStudents = async (classId: string) => {
    try {
      const { data, error } = await supabase
        .from('class_enrollments')
        .select(`
          *,
          profiles (
            id,
            name
          )
        `)
        .eq('class_id', classId);

      if (error) throw error;

      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const createClass = async () => {
    if (!newClassName.trim()) return;

    try {
      const classCode = generateClassCode();
      const { error } = await supabase
        .from('classes')
        .insert({
          name: newClassName,
          code: classCode,
          teacher_id: user?.id,
        });

      if (error) throw error;

      setNewClassName('');
      setShowCreateForm(false);
      fetchClasses();
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  const generateClassCode = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const copyClassCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // In a real app, you'd show a toast notification here
    alert('Class code copied to clipboard!');
  };

  const handleClassClick = (classId: string) => {
    setSelectedClass(classId);
    fetchClassStudents(classId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (selectedClass) {
    const classData = classes.find(c => c.id === selectedClass);
    return (
      <div>
        <div className="mb-8">
          <button
            onClick={() => setSelectedClass(null)}
            className="text-green-600 hover:text-green-800 mb-4"
          >
            ← Back to Classes
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{classData?.name}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Class Code:</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-green-600 font-mono">
                {classData?.code}
              </code>
              <button
                onClick={() => copyClassCode(classData?.code || '')}
                className="text-green-600 hover:text-green-800"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Class Roster</h2>
              <span className="text-sm text-gray-600">{students.length} students</span>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {students.map((student) => (
              <div key={student.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{student.profiles?.name}</h3>
                    <p className="text-sm text-gray-500">Student ID: {student.student_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Joined {new Date(student.enrolled_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Class Management</h1>
        <p className="text-gray-600">Manage your classes and view student rosters</p>
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
              View Class
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