import React from 'react';
import { Star, Eye, TrendingUp, Award } from 'lucide-react';

const MarksResults: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Marks & Results</h1>
        <p className="text-gray-600">Review your academic performance and teacher feedback</p>
      </div>

      <div className="text-center py-12">
        <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No results yet</h3>
        <p className="text-gray-600">Complete and submit assignments to see your marks and feedback</p>
      </div>
    </div>
  );
};

export default MarksResults;