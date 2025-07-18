import React from 'react';
import { Star, MessageSquare, TrendingUp } from 'lucide-react';

const ResultsFeedback: React.FC = () => {
  const results = [
    {
      id: 1,
      assignment: 'Character Analysis Essay',
      book: 'To Kill a Mockingbird',
      score: 92,
      maxScore: 100,
      grade: 'A',
      submittedDate: '2025-01-08',
      feedback: 'Excellent analysis of Scout\'s character development. Emma shows great understanding of the themes and uses textual evidence effectively.',
      teacher: 'Mrs. Johnson'
    },
    {
      id: 2,
      assignment: 'Reading Comprehension Quiz',
      book: 'The Great Gatsby',
      score: 87,
      maxScore: 100,
      grade: 'B+',
      submittedDate: '2025-01-05',
      feedback: 'Good grasp of the plot and characters. Could improve on understanding of symbolism and metaphors.',
      teacher: 'Mrs. Johnson'
    },
    {
      id: 3,
      assignment: 'Poetry Analysis',
      book: 'Various Poems',
      score: 94,
      maxScore: 100,
      grade: 'A',
      submittedDate: '2024-12-22',
      feedback: 'Outstanding interpretation of poetic devices. Emma demonstrates mature analytical skills.',
      teacher: 'Mrs. Johnson'
    }
  ];

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'B+':
        return 'bg-blue-100 text-blue-800';
      case 'B':
        return 'bg-yellow-100 text-yellow-800';
      case 'C':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const averageScore = Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Results & Feedback</h1>
        <p className="text-gray-600">Review your child's academic performance and teacher feedback</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{averageScore}%</h3>
          <p className="text-gray-600 text-sm">Average Score</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Star className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{results.length}</h3>
          <p className="text-gray-600 text-sm">Assignments Completed</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <MessageSquare className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">A</h3>
          <p className="text-gray-600 text-sm">Most Common Grade</p>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-6">
        {results.map((result) => (
          <div key={result.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{result.assignment}</h3>
                <p className="text-gray-600">{result.book}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Submitted on {new Date(result.submittedDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl font-bold text-gray-900">{result.score}</span>
                  <span className="text-gray-500">/{result.maxScore}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(result.grade)}`}>
                    {result.grade}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">Teacher Feedback</h4>
                  <p className="text-gray-700">{result.feedback}</p>
                  <p className="text-sm text-gray-500 mt-2">— {result.teacher}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsFeedback;