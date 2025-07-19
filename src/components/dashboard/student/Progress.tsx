import React from 'react';
import { TrendingUp, BookOpen, Target, Clock } from 'lucide-react';

const Progress: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Tracker</h1>
        <p className="text-gray-600">Monitor your reading journey and achievements</p>
      </div>

      <div className="text-center py-12">
        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No progress data yet</h3>
        <p className="text-gray-600">Start reading and completing assignments to see your progress</p>
      </div>
    </div>
  );
};

export default Progress;