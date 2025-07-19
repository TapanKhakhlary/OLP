import React from 'react';
import { Award, BookOpen, Target, Zap, Star, Trophy } from 'lucide-react';

const Achievements: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements</h1>
        <p className="text-gray-600">Celebrate your reading milestones and unlock rewards</p>
      </div>

      <div className="text-center py-12">
        <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements yet</h3>
        <p className="text-gray-600">Complete reading tasks and assignments to unlock achievements</p>
      </div>
    </div>
  );
};

export default Achievements;