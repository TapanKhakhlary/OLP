import React from 'react';
import { Star, Eye, TrendingUp, Award } from 'lucide-react';

const MarksResults: React.FC = () => {
  const results = [
    {
      id: 1,
      assignment: 'Chapter 1-5 Analysis',
      book: 'To Kill a Mockingbird',
      score: 92,
      maxScore: 100,
      grade: 'A',
      submittedDate: '2025-01-05',
      feedback: 'Excellent analysis of character development. Well-structured arguments.'
    },
    {
      id: 2,
      assignment: 'Reading Comprehension Quiz',
      book: 'The Great Gatsby',
      score: 85,
      maxScore: 100,
      grade: 'B+',
      submittedDate: '2025-01-03',
      feedback: 'Good understanding of the themes. Could improve on symbolism analysis.'
    },
    {
      id: 3,
      assignment: 'Character Comparison Essay',
      book: '1984',
      score: 88,
      maxScore: 100,
      grade: 'B+',
      submittedDate: '2024-12-20',
      feedback: 'Strong comparative analysis. Excellent use of textual evidence.'
    },
    {
      id: 4,
      assignment: 'Poetry Analysis',
      book: 'Various Poems',
      score: 95,
      maxScore: 100,
      grade: 'A',
      submittedDate: '2024-12-15',
      feedback: 'Outstanding interpretation of poetic devices and themes.'
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Marks & Results</h1>
        <p className="text-gray-600">Review your academic performance and teacher feedback</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{averageScore}%</h3>
          <p className="text-gray-600 text-sm">Average Score</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Award className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{results.length}</h3>
          <p className="text-gray-600 text-sm">Assignments Completed</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Star className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">A</h3>
          <p className="text-gray-600 text-sm">Most Common Grade</p>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
            <div className="col-span-4">Assignment</div>
            <div className="col-span-2">Score</div>
            <div className="col-span-2">Grade</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Feedback</div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {results.map((result) => (
            <div key={result.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                  <h3 className="font-medium text-gray-900">{result.assignment}</h3>
                  <p className="text-sm text-gray-500">{result.book}</p>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-lg font-semibold text-gray-900">{result.score}</span>
                    <span className="text-sm text-gray-500">/{result.maxScore}</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(result.grade)}`}>
                    {result.grade}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-gray-600">
                    {new Date(result.submittedDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="col-span-2">
                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm">
                    <Eye className="h-4 w-4" />
                    <span>View Feedback</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarksResults;