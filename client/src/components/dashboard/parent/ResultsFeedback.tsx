import React from 'react';
import { Star, MessageSquare, TrendingUp } from 'lucide-react';

const ResultsFeedback: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Results & Feedback</h1>
        <p className="text-gray-600">Review your child's academic performance and teacher feedback</p>
      </div>

      <div className="text-center py-12">
        <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No results available</h3>
        <p className="text-gray-600">Your child's assignment results and teacher feedback will appear here</p>
      </div>
    </div>
  );
};

export default ResultsFeedback;