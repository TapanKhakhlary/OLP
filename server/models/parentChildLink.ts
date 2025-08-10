import mongoose, { Schema } from 'mongoose';

// Define the parent-child link schema
export const parentChildLinkSchema = new Schema({
  parentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  childId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Create indexes for faster queries
parentChildLinkSchema.index({ parentId: 1 });
parentChildLinkSchema.index({ childId: 1 });
parentChildLinkSchema.index({ parentId: 1, childId: 1 }, { unique: true }); // Unique parent-child relationship

// Define the ParentChildLink interface
export interface IParentChildLink extends mongoose.Document {
  parentId: mongoose.Types.ObjectId;
  childId: mongoose.Types.ObjectId;
  createdAt: Date;
}