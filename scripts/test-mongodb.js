// Simple script to test MongoDB connection
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection URI
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/olp';

async function testConnection() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log('✅ Successfully connected to MongoDB!');
    
    // Create a simple test document
    const TestModel = mongoose.model('Test', new mongoose.Schema({
      name: String,
      date: { type: Date, default: Date.now }
    }));
    
    // Insert a test document
    const testDoc = new TestModel({ name: 'Test Connection' });
    await testDoc.save();
    console.log('✅ Successfully created test document!');
    
    // Find the test document
    const foundDoc = await TestModel.findOne({ name: 'Test Connection' });
    console.log('✅ Successfully retrieved test document:', foundDoc);
    
    // Clean up - delete the test document and collection
    await TestModel.deleteMany({});
    console.log('✅ Successfully cleaned up test data!');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed.');
    
    console.log('\n🎉 All tests passed! MongoDB is working correctly.');
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error);
  } finally {
    // Ensure the process exits
    process.exit(0);
  }
}

// Run the test
testConnection();