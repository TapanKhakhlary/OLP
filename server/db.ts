import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection
let db;

const connectToDatabase = async () => {
  try {
    // Use MongoDB connection string from environment variables
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/olp';
    
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    
    console.log('Connected to MongoDB successfully');
    db = mongoose.connection;
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

// Export the database connection and connection function
export { db, connectToDatabase };
