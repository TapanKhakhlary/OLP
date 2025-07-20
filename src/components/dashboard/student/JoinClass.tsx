import React, { useState } from 'react';
import { UserPlus, Users, CheckCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const JoinClass: React.FC = () => {
  const { user } = useAuth();
  const [classCode, setClassCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classCode.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      // Check if class exists
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('id, name, teacher_id, profiles(name)')
        .eq('code', classCode.toUpperCase())
        .single();

      if (classError || !classData) {
        setMessage({ type: 'error', text: 'Invalid class code. Please check and try again.' });
        return;
      }

      // Check if already enrolled
      const { data: existingEnrollment, error: enrollmentCheckError } = await supabase
        .from('class_enrollments')
        .select('id')
        .eq('class_id', classData.id)
        .eq('student_id', user?.id)
        .single();

      if (existingEnrollment) {
        setMessage({ type: 'error', text: 'You are already enrolled in this class.' });
        return;
      }

      // Enroll student
      const { error: enrollError } = await supabase
        .from('class_enrollments')
        .insert({
          class_id: classData.id,
          student_id: user?.id,
        });

      if (enrollError) throw enrollError;

      setMessage({ 
        type: 'success', 
        text: `Successfully joined "${classData.name}"!` 
      });
      setClassCode('');
    } catch (error) {
      console.error('Error joining class:', error);
      setMessage({ type: 'error', text: 'Failed to join class. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Join a Class</h1>
        <p className="text-gray-600">Enter your teacher's class code to join their class</p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <div className="p-4 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4 w-fit">
              <UserPlus className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Join Class</h2>
            <p className="text-gray-600 text-sm">Ask your teacher for the class code</p>
          </div>

          <form onSubmit={handleJoinClass} className="space-y-4">
            <div>
              <label htmlFor="classCode" className="block text-sm font-medium text-gray-700 mb-2">
                Class Code
              </label>
              <input
                type="text"
                id="classCode"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                placeholder="Enter class code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
                maxLength={8}
                required
              />
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                <div className="flex items-center">
                  {message.type === 'success' && <CheckCircle className="h-4 w-4 mr-2" />}
                  {message.text}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !classCode.trim()}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Users className="h-5 w-5" />
                  <span>Join Class</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">How to join a class:</h3>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Get the class code from your teacher</li>
              <li>2. Enter the code in the field above</li>
              <li>3. Click "Join Class" to enroll</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinClass;