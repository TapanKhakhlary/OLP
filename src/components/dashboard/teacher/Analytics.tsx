import React from 'react';
import { TrendingUp, Users, BookOpen, Clock } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Class Analytics</h1>
        <p className="text-gray-600">Monitor student performance and engagement</p>
      </div>

      <div className="text-center py-12">
        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data yet</h3>
        <p className="text-gray-600">Create classes and assignments to see student performance analytics</p>
      </div>
    </div>
  );
};

export default Analytics;