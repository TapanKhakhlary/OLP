import React from 'react';
import { BookOpen, Award, Clock, TrendingUp, Star } from 'lucide-react';

const ChildProgress: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Child's Progress</h1>
        <p className="text-gray-600">Monitor your child's reading journey and achievements</p>
      </div>

      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No child linked yet</h3>
        <p className="text-gray-600">Link your child's account to monitor their reading progress</p>
      </div>
    </div>
  );
};

export default ChildProgress;