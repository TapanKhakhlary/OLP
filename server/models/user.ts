import mongoose, { Schema } from 'mongoose';

// Define the user roles enum values
const userRoles = ['student', 'teacher', 'parent'] as const;

// Define the user schema
export const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: userRoles, required: true },
  studentCode: { type: String, unique: true, sparse: true }, // Unique code for parent linking
  profilePicture: String, // URL to profile picture
  googleId: String,
  isEmailVerified: { type: Boolean, default: false },
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Create indexes for faster queries
// email and studentCode already have indexes from unique: true
userSchema.index({ googleId: 1 });

// Define the User interface
export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'parent';
  studentCode?: string;
  profilePicture?: string;
  googleId?: string;
  isEmailVerified: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}