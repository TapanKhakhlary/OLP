import React from 'react';
import { Users, Calendar, BookOpen, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const MyClasses: React.FC = () => {
  const { data: enrolledClasses = [], isLoading } = useQuery({
    queryKey: ['/api/student/classes'],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Classes</h1>
        <p className="text-gray-600">Classes you've joined</p>
      </div>

      {(enrolledClasses as any[]).length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No classes joined yet</h3>
          <p className="text-gray-600 mb-4">Ask your teacher for a class code to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(enrolledClasses as any[]).map((enrollment: any) => (
            <div key={enrollment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {enrollment.class?.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <User className="h-4 w-4 mr-1" />
                    <span>Teacher: {enrollment.teacher?.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>Code: {enrollment.class?.code}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Joined: {new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  {enrollment.class?.description || 'No description available'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClasses;