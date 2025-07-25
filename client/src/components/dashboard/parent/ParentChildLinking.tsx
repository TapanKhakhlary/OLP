import React, { useState, useEffect } from 'react';
import { UserPlus, Users, CheckCircle, AlertCircle, Child } from 'lucide-react';
import { apiRequest } from '../../../lib/queryClient';
import { useAuth } from '../../../contexts/AuthContext';

const ParentChildLinking: React.FC = () => {
  const { user } = useAuth();
  const [studentCode, setStudentCode] = useState('');
  const [linkedChildren, setLinkedChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLinking, setIsLinking] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLinkedChildren();
    }
  }, [user]);

  const fetchLinkedChildren = async () => {
    try {
      const children = await apiRequest(`/parent/children`);
      setLinkedChildren(Array.isArray(children) ? children : []);
    } catch (error) {
      console.error('Error fetching linked children:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentCode.trim()) return;

    setIsLinking(true);
    setMessage(null);

    try {
      await apiRequest('/parent/link-child', {
        method: 'POST',
        body: JSON.stringify({ childCode: studentCode.toUpperCase() })
      });

      setMessage({
        type: 'success',
        text: 'Successfully linked to student account!'
      });
      setStudentCode('');
      fetchLinkedChildren();
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to link student. Please check the code and try again.'
      });
    } finally {
      setIsLinking(false);
    }
  };

  const handleUnlinkChild = async (childId: string) => {
    if (!confirm('Are you sure you want to unlink this child?')) return;

    try {
      await apiRequest(`/parent/unlink-child/${childId}`, {
        method: 'DELETE'
      });
      
      setMessage({
        type: 'success',
        text: 'Child account unlinked successfully.'
      });
      fetchLinkedChildren();
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to unlink child.'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Linked Children</h1>
        <p className="text-gray-600">Link to your children's student accounts to monitor their progress</p>
      </div>

      {/* Link New Child Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Link New Child</h2>
        <p className="text-gray-600 mb-4">
          Ask your child for their unique student code displayed on their profile page.
        </p>

        <form onSubmit={handleLinkChild} className="max-w-md">
          <div className="mb-4">
            <label htmlFor="studentCode" className="block text-sm font-medium text-gray-700 mb-2">
              Student Code
            </label>
            <input
              type="text"
              id="studentCode"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value.toUpperCase())}
              placeholder="Enter student code"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg font-mono"
              maxLength={8}
              required
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm mb-4 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                {message.type === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span>{message.text}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLinking || !studentCode.trim()}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <UserPlus className="h-5 w-5" />
            <span>{isLinking ? 'Linking...' : 'Link Child'}</span>
          </button>
        </form>
      </div>

      {/* Linked Children List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Children</h2>
        
        {linkedChildren.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Child className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No children linked yet</h3>
            <p className="text-gray-600">Use the form above to link to your child's student account</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {linkedChildren.map((link) => (
              <div key={link.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <Child className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {link.child?.name}
                        </h3>
                        <p className="text-sm text-gray-600">{link.child?.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Student Code:</span>
                        <p className="font-mono text-gray-900">{link.child?.studentCode}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Linked:</span>
                        <p className="text-gray-900">
                          {new Date(link.linkedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Classes:</span>
                        <p className="text-gray-900">{link.child?.enrollments?.length || 0} classes</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUnlinkChild(link.childId)}
                    className="text-red-600 hover:text-red-800 text-sm px-3 py-1 border border-red-300 rounded hover:bg-red-50"
                  >
                    Unlink
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {link.child?.stats?.assignmentsCompleted || 0}
                      </p>
                      <p className="text-xs text-gray-600">Assignments</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {link.child?.stats?.averageGrade || 0}%
                      </p>
                      <p className="text-xs text-gray-600">Avg Grade</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">
                        {link.child?.stats?.booksRead || 0}
                      </p>
                      <p className="text-xs text-gray-600">Books Read</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-600">
                        {link.child?.stats?.achievements || 0}
                      </p>
                      <p className="text-xs text-gray-600">Achievements</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentChildLinking;