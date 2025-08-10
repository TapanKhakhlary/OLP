import mongoose, { Schema } from 'mongoose';

// Define the book schema
export const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  description: String,
  coverUrl: String,
  readingLevel: String,
  pages: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Create indexes for faster queries
bookSchema.index({ title: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ genre: 1 });

// Define the Book interface
export interface IBook extends mongoose.Document {
  title: string;
  author: string;
  genre: string;
  description?: string;
  coverUrl?: string;
  readingLevel?: string;
  pages: number;
  createdAt: Date;
}