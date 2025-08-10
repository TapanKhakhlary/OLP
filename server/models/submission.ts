import mongoose, { Schema } from 'mongoose';

// Define the assignment status enum values
const assignmentStatusValues = ['not-started', 'in-progress', 'submitted', 'graded'] as const;

// Define the submission schema
export const submissionSchema = new Schema({
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: String,
  status: { type: String, enum: assignmentStatusValues, default: 'not-started' },
  score: Number,
  feedback: String,
  submittedAt: Date,
  gradedAt: Date,
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Create indexes for faster queries
submissionSchema.index({ assignmentId: 1 });
submissionSchema.index({ studentId: 1 });
submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true }); // One submission per student per assignment

// Define the Submission interface
export interface ISubmission extends mongoose.Document {
  assignmentId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  content?: string;
  status: 'not-started' | 'in-progress' | 'submitted' | 'graded';
  score?: number;
  feedback?: string;
  submittedAt?: Date;
  gradedAt?: Date;
  createdAt: Date;
}