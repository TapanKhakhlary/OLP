import React, { useState } from 'react';
import { Clock, CheckCircle, Star, MessageSquare } from 'lucide-react';

const GradingCenter: React.FC = () => {
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);

  const submissions = [
    {
      id: 1,
      studentName: 'Alice Johnson',
      assignment: 'Character Analysis Essay',
      book: 'To Kill a Mockingbird',
      submittedAt: '2025-01-10T14:30:00Z',
      status: 'submitted',
      content: 'This essay analyzes the character development of Scout Finch throughout the novel...'
    },
    {
      id: 2,
      studentName: 'Bob Smith',
      assignment: 'Theme Discussion',
      book: 'The Great Gatsby',
      submittedAt: '2025-01-09T16:45:00Z',
      status: 'submitted',
      content: 'The American Dream is a central theme in Fitzgerald\'s work...'
    },
    {
      id: 3,
      studentName: 'Carol Davis',
      assignment: 'Reading Comprehension Quiz',
      book: '1984',
      submittedAt: '2025-01-08T11:20:00Z',
      status: 'graded',
      score: 85,
      feedback: 'Good understanding of the themes, but could improve on analysis of symbolism.'
    }
  ];

  const [gradingForm, setGradingForm] = useState({
    score: '',
    feedback: ''
  });

  const handleGrade = (submissionId: number) => {
    // In a real app, this would submit the grade
    console.log('Grading submission:', submissionId, gradingForm);
    alert('Grade submitted successfully!');
    setSelectedSubmission(null);
    setGradingForm({ score: '', feedback: '' });
  };

  if (selectedSubmission) {
    const submission = submissions.find(s => s.id === selectedSubmission);
    if (!submission) return null;

    return (
      <div>
        <div className="mb-8">
          <button
            onClick={() => setSelectedSubmission(null)}
            className="text-green-600 hover:text-green-800 mb-4"
          >
            ← Back to Grading Center
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Grade Submission</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submission Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{submission.assignment}</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Student: {submission.studentName}</p>
                <p>Book: {submission.book}</p>
                <p>Submitted: {new Date(submission.submittedAt).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-3">Submission Content</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{submission.content}</p>
              </div>
            </div>
          </div>

          {/* Grading Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Grade & Feedback</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-2">
                  Score (out of 100)
                </label>
                <input
                  type="number"
                  id="score"
                  value={gradingForm.score}
                  onChange={(e) => setGradingForm({ ...gradingForm, score: e.target.value })}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter score"
                />
              </div>

              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback
                </label>
                <textarea
                  id="feedback"
                  value={gradingForm.feedback}
                  onChange={(e) => setGradingForm({ ...gradingForm, feedback: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Provide feedback to the student..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleGrade(submission.id)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Grade
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Grading Center</h1>
        <p className="text-gray-600">Review and grade student submissions</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {submissions.filter(s => s.status === 'submitted').length}
          </h3>
          <p className="text-gray-600 text-sm">Pending Review</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {submissions.filter(s => s.status === 'graded').length}
          </h3>
          <p className="text-gray-600 text-sm">Graded This Week</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Star className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">85%</h3>
          <p className="text-gray-600 text-sm">Average Score</p>
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Submissions</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {submissions.map((submission) => (
            <div key={submission.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-gray-900">{submission.studentName}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      submission.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {submission.status === 'submitted' ? 'Needs Review' : 'Graded'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{submission.assignment} - {submission.book}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Submitted {new Date(submission.submittedAt).toLocaleString()}
                  </p>
                  {submission.status === 'graded' && (
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm font-medium text-green-600">Score: {submission.score}/100</span>
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => setSelectedSubmission(submission.id)}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    {submission.status === 'submitted' ? 'Grade' : 'View'}
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

export default GradingCenter;