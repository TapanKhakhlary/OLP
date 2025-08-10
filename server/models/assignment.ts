import mongoose, { Schema } from 'mongoose';

// Define the assignment schema
export const assignmentSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  instructions: String,
  bookId: { type: Schema.Types.ObjectId, ref: 'Book' },
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date, required: true },
  maxScore: { type: Number, default: 100 },
  topic: String, // Topic/Category for organization
  youtubeLink: String, // YouTube video links
  driveLink: String, // Google Drive or file links
  attachments: [String], // File attachments URLs
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Create indexes for faster queries
assignmentSchema.index({ classId: 1 });
assignmentSchema.index({ teacherId: 1 });
assignmentSchema.index({ dueDate: 1 });

// Define the Assignment interface
export interface IAssignment extends mongoose.Document {
  title: string;
  description?: string;
  instructions?: string;
  bookId?: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  dueDate: Date;
  maxScore: number;
  topic?: string;
  youtubeLink?: string;
  driveLink?: string;
  attachments?: string[];
  createdAt: Date;
}