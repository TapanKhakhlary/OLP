import mongoose, { Schema } from 'mongoose';

// Define the reading status enum values
const readingStatusValues = ['reading', 'completed', 'wishlist'] as const;

// Define the reading progress schema
export const readingProgressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  status: { type: String, enum: readingStatusValues, default: 'reading' },
  progress: { type: Number, default: 0 },
  startedAt: { type: Date, default: Date.now },
  completedAt: Date
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Create indexes for faster queries
readingProgressSchema.index({ userId: 1 });
readingProgressSchema.index({ bookId: 1 });
readingProgressSchema.index({ userId: 1, bookId: 1 }, { unique: true }); // One reading progress per user per book

// Define the ReadingProgress interface
export interface IReadingProgress extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  status: 'reading' | 'completed' | 'wishlist';
  progress: number;
  startedAt: Date;
  completedAt?: Date;
}