import mongoose, { Schema } from 'mongoose';

// Define the class schema
export const classSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Create indexes for faster queries
// code already has an index from unique: true
classSchema.index({ teacherId: 1 });

// Define the Class interface
export interface IClass extends mongoose.Document {
  name: string;
  code: string;
  teacherId: mongoose.Types.ObjectId;
  createdAt: Date;
}