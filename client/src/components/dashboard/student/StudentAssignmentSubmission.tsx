import React, { useState, useRef } from 'react';
import { Upload, FileText, Youtube, Cloud, Paperclip, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../../lib/queryClient';
import { useAuth } from '../../../contexts/AuthContext';

interface Assignment {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  dueDate: string;
  maxScore: number;
  class: {
    name: string;
  };
  submission?: {
    id: string;
    status: string;
    content?: string;
    score?: number;
    feedback?: string;
    submittedAt: string;
  };
}

interface StudentAssignmentSubmissionProps {
  assignment: Assignment;
  onBack: () => void;
  onSubmissionComplete: () => void;
}

const StudentAssignmentSubmission: React.FC<StudentAssignmentSubmissionProps> = ({
  assignment,
  onBack,
  onSubmissionComplete
}) => {
  const { user } = useAuth();
  const [submissionText, setSubmissionText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'draft' | 'submitting' | 'submitted' | 'error'>('draft');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files).filter(file => 
        file.size <= 10 * 1024 * 1024 // 10MB limit
      );
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (isDraft = false) => {
    try {
      setIsSubmitting(true);
      setSubmissionStatus('submitting');

      // Prepare submission content
      let content = submissionText;
      if (selectedFiles.length > 0) {
        content += '\n\nFiles attached: ' + selectedFiles.map(f => f.name).join(', ');
      }
      if (youtubeLink) {
        content += '\n\nYouTube Link: ' + youtubeLink;
      }

      await apiRequest('/submissions', {
        method: 'POST',
        body: JSON.stringify({
          assignmentId: assignment.id,
          content,
          status: isDraft ? 'draft' : 'submitted',
          submittedAt: new Date().toISOString()
        })
      });

      setSubmissionStatus('submitted');
      onSubmissionComplete();
      
      // Show success message
      setTimeout(() => {
        onBack();
      }, 2000);
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResubmit = () => {
    setSubmissionStatus('draft');
    if (assignment.submission?.content) {
      setSubmissionText(assignment.submission.content);
    }
  };

  const isOverdue = new Date() > new Date(assignment.dueDate);
  const hasSubmission = assignment.submission && assignment.submission.status !== 'draft';

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center space-x-2"
        >
          ← Back to Assignments
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>{assignment.class.name}</span>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              Due: {new Date(assignment.dueDate).toLocaleDateString()} at {new Date(assignment.dueDate).toLocaleTimeString()}
            </span>
          </div>
          <span>•</span>
          <span>{assignment.maxScore} points</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assignment Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Assignment Details</h2>
            
            {assignment.description && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{assignment.description}</p>
              </div>
            )}

            {assignment.instructions && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Instructions</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{assignment.instructions}</p>
                </div>
              </div>
            )}

            {/* Submission Status */}
            {hasSubmission && (
              <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">Submitted</span>
                </div>
                <p className="text-sm text-green-700">
                  Submitted on {new Date(assignment.submission!.submittedAt).toLocaleDateString()}
                </p>
                {assignment.submission!.score !== undefined && (
                  <p className="text-sm text-green-700">
                    Score: {assignment.submission!.score}/{assignment.maxScore}
                  </p>
                )}
                {assignment.submission!.feedback && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-green-800">Feedback:</p>
                    <p className="text-sm text-green-700">{assignment.submission!.feedback}</p>
                  </div>
                )}
              </div>
            )}

            {isOverdue && !hasSubmission && (
              <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800">Assignment Overdue</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  This assignment was due on {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submission Area */}
        <div className="space-y-6">
          {submissionStatus === 'submitted' ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">Assignment Submitted!</h3>
              <p className="text-green-700">Your work has been submitted successfully.</p>
              {hasSubmission && (
                <button
                  onClick={handleResubmit}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Make Changes & Resubmit
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Work</h2>
              
              {/* Text Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Written Response
                </label>
                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Type your response here..."
                />
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attach Files
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp4,.mov"
                  />
                  
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-4">
                      Drag files here or click to upload
                    </p>
                    <div className="flex justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Paperclip className="h-4 w-4" />
                        <span>Upload Files</span>
                      </button>
                    </div>
                  </div>
                  
                  {selectedFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                      <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* YouTube Link */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube Link (Optional)
                </label>
                <div className="flex items-center space-x-2">
                  <Youtube className="h-5 w-5 text-red-500" />
                  <input
                    type="url"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={isSubmitting || (!submissionText.trim() && selectedFiles.length === 0)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Draft
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting || (!submissionText.trim() && selectedFiles.length === 0) || isOverdue}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? 'Submitting...' : hasSubmission ? 'Resubmit' : 'Submit'}</span>
                </button>
              </div>

              {isOverdue && (
                <p className="text-sm text-red-600 mt-2 text-center">
                  This assignment is overdue. Contact your teacher if you need to submit late work.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAssignmentSubmission;