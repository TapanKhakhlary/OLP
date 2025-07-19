import React, { useState } from 'react';
import { Clock, CheckCircle, Star, MessageSquare } from 'lucide-react';

const GradingCenter: React.FC = () => {
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);

  const submissions: any[] = [];

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

      <div className="text-center py-12">
        <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions to grade</h3>
        <p className="text-gray-600">Student submissions will appear here when they complete assignments</p>
      </div>
    </div>
  );
};

export default GradingCenter;