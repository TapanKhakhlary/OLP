import mongoose, { Schema } from 'mongoose';

// Define the achievement schema
export const achievementSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  rarity: { type: String, default: 'common' },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Create indexes for faster queries
achievementSchema.index({ name: 1 });
achievementSchema.index({ rarity: 1 });

// Define the Achievement interface
export interface IAchievement extends mongoose.Document {
  name: string;
  description: string;
  icon: string;
  rarity: string;
  createdAt: Date;
}