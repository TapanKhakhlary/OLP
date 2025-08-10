import mongoose, { Schema } from 'mongoose';

// Define the user achievement schema
export const userAchievementSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  achievementId: { type: Schema.Types.ObjectId, ref: 'Achievement', required: true },
  earnedAt: { type: Date, default: Date.now }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Create indexes for faster queries
userAchievementSchema.index({ userId: 1 });
userAchievementSchema.index({ achievementId: 1 });
userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true }); // Each user can earn an achievement only once

// Define the UserAchievement interface
export interface IUserAchievement extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  achievementId: mongoose.Types.ObjectId;
  earnedAt: Date;
}