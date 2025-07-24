import React, { useState } from 'react';
import { Users, UserPlus, Link, CheckCircle } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';

const LinkChild: React.FC = () => {
  const { user } = useAuth();
  const [childEmail, setChildEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Mock data for now - in real app this would come from API
  const { data: linkedChildren = [] } = useQuery({
    queryKey: ['/parent-children'],
    enabled: !!user && user.role === 'parent',
  });

  const linkChildMutation = useMutation({
    mutationFn: async (email: string) => {
      // Mock implementation - replace with actual API call
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === 'student@example.com') {
            resolve({ success: true, child: { name: 'Test Student', email } });
          } else {
            reject(new Error('Student not found with this email'));
          }
        }, 1000);
      });
    },
    onSuccess: () => {
      setMessage({ 
        type: 'success', 
        text: 'Successfully linked to your child\'s account!' 
      });
      setChildEmail('');
    },
    onError: (error: any) => {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to link child account. Please try again.' 
      });
    },
  });

  const handleLinkChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childEmail.trim()) return;

    setMessage(null);
    linkChildMutation.mutate(childEmail);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Link Child Account</h1>
        <p className="text-gray-600">Connect to your child's account to monitor their progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Link Child Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <UserPlus className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Link New Child</h2>
          </div>

          <form onSubmit={handleLinkChild} className="space-y-4">
            <div>
              <label htmlFor="childEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Child's Email Address
              </label>
              <input
                type="email"
                id="childEmail"
                value={childEmail}
                onChange={(e) => setChildEmail(e.target.value)}
                placeholder="Enter your child's email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              disabled={linkChildMutation.isPending || !childEmail.trim()}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {linkChildMutation.isPending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Link className="h-5 w-5" />
                  <span>Link Child Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <h3 className="text-sm font-medium text-purple-900 mb-2">How to link your child:</h3>
            <ol className="text-sm text-purple-800 space-y-1">
              <li>1. Ask your child for their account email</li>
              <li>2. Enter the email in the field above</li>
              <li>3. Your child will receive a link request</li>
              <li>4. Once approved, you can monitor their progress</li>
            </ol>
          </div>
        </div>

        {/* Linked Children */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Linked Children</h2>
          </div>

          <div className="space-y-4">
            {linkedChildren.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No children linked yet</p>
                <p className="text-sm">Link your child's account to get started</p>
              </div>
            ) : (
              linkedChildren.map((child: any) => (
                <div key={child.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{child.name}</h3>
                        <p className="text-sm text-gray-600">{child.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Linked</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkChild;