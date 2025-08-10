import mongoose, { Schema } from 'mongoose';

// Define the class enrollment schema
export const classEnrollmentSchema = new Schema({
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  enrolledAt: { type: Date, default: Date.now },
  status: { type: String, default: 'active' }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Create indexes for faster queries
classEnrollmentSchema.index({ classId: 1 });
classEnrollmentSchema.index({ studentId: 1 });
classEnrollmentSchema.index({ classId: 1, studentId: 1 }, { unique: true }); // One enrollment per student per class

// Define the ClassEnrollment interface
export interface IClassEnrollment extends mongoose.Document {
  classId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  enrolledAt: Date;
  status: string;
}