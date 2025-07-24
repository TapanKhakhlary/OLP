import React from 'react';
import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, Upload, FileText, Cloud } from 'lucide-react';
import { apiRequest } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Drop files here</h3>
        <p className="text-gray-600 mb-4">or click to browse</p>
        <input
          type="file"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          accept=".pdf,.doc,.docx,.txt"
        />
        <label
          htmlFor="file-upload"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
        >
          Browse Files
        </label>
      </div>
      
      <div className="flex space-x-4">
        <button className="flex-1 flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <FileText className="h-5 w-5 text-gray-600" />
          <span className="text-gray-700">Create Document</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Cloud className="h-5 w-5 text-gray-600" />
          <span className="text-gray-700">From Drive</span>
        </button>
      </div>
    </div>
  );
};

const Assignments: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
  }, [user]);

  const fetchAssignments = async () => {
    try {
      // Get student's enrolled classes
      const { data: enrollments, error: enrollError } = await supabase
        .from('class_enrollments')
        .select('class_id')
        .eq('student_id', user?.id);

      if (enrollError) throw enrollError;

      const classIds = enrollments?.map(e => e.class_id) || [];

      if (classIds.length === 0) {
        setLoading(false);
        return;
      }

      // Get assignments for enrolled classes
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select(`
          *,
          books (title),
          submissions!left (
            id,
            status,
            score,
            feedback,
            submitted_at,
            graded_at
          )
        `)
        .in('class_id', classIds)
        .eq('submissions.student_id', user?.id);

      if (assignmentsError) throw assignmentsError;

      setAssignments(assignmentsData || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not-started':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'submitted':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'graded':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedAssignment || (!submissionText.trim() && !selectedFile)) return;

    try {
      // In a real implementation, you would upload the file to storage first
      const content = selectedFile 
        ? `File submitted: ${selectedFile.name}` 
        : submissionText;

      const { error } = await supabase
        .from('submissions')
        .upsert({
          assignment_id: selectedAssignment.id,
          student_id: user?.id,
          content,
          status: 'submitted',
          submitted_at: new Date().toISOString(),
        });

      if (error) throw error;

      alert('Assignment submitted successfully!');
      setSelectedAssignment(null);
      setSubmissionText('');
      setSelectedFile(null);
      fetchAssignments();
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Error submitting assignment. Please try again.');
    }
  };

  if (selectedAssignment) {
    return (
      <div>
        <div className="mb-8">
          <button
            onClick={() => setSelectedAssignment(null)}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Assignments
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedAssignment.title}</h1>
          <p className="text-gray-600">{selectedAssignment.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assignment Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Assignment Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <p className="text-gray-900">{new Date(selectedAssignment.due_date).toLocaleDateString()}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
                <p className="text-gray-900">{selectedAssignment.max_score} points</p>
              </div>
              
              {selectedAssignment.instructions && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedAssignment.instructions}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submission Area */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Submission</h2>
            
            <div className="space-y-6">
              {/* Text Submission */}
              <div>
                <label htmlFor="submission" className="block text-sm font-medium text-gray-700 mb-2">
                  Write your response
                </label>
                <textarea
                  id="submission"
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type your response here..."
                />
              </div>

              <div className="text-center text-gray-500">
                <span>OR</span>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload a file
                </label>
                <FileUpload onFileSelect={handleFileSelect} />
                {selectedFile && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm">
                      Selected: {selectedFile.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!submissionText.trim() && !selectedFile}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Assignment
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments</h1>
        <p className="text-gray-600">Track your assignments and stay on top of deadlines</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
            <div className="col-span-4">Assignment</div>
            <div className="col-span-3">Book</div>
            <div className="col-span-2">Due Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Action</div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                  <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                  <p className="text-sm text-gray-500">{assignment.description}</p>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-gray-900">{assignment.books?.title || 'No book assigned'}</p>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className={`text-sm ${isOverdue(assignment.due_date) && (assignment.submissions?.[0]?.status || 'not-started') !== 'graded' ? 'text-red-600' : 'text-gray-600'}`}>
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(assignment.submissions?.[0]?.status || 'not-started')}`}>
                    {getStatusIcon(assignment.submissions?.[0]?.status || 'not-started')}
                    <span className="capitalize">{(assignment.submissions?.[0]?.status || 'not-started').replace('-', ' ')}</span>
                  </div>
                </div>
                <div className="col-span-1">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    {['submitted', 'graded'].includes(assignment.submissions?.[0]?.status || 'not-started') ? 'View' : 'Start'}
                  </button>
                  {!['submitted', 'graded'].includes(assignment.submissions?.[0]?.status || 'not-started') && (
                    <button
                      onClick={() => setSelectedAssignment(assignment)}
                      className="ml-2 text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {assignments.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
          <p className="text-gray-600">Your teacher will assign reading tasks that will appear here</p>
        </div>
      )}
    </div>
  );
};

export default Assignments;