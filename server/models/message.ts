import mongoose, { Schema } from 'mongoose';

// Define the message schema
export const messageSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  readAt: Date,
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Create indexes for faster queries
messageSchema.index({ senderId: 1 });
messageSchema.index({ recipientId: 1 });
messageSchema.index({ senderId: 1, recipientId: 1 }); // For conversation queries

// Define the Message interface
export interface IMessage extends mongoose.Document {
  senderId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  content: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}