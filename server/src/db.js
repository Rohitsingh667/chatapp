const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatapp';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.warn('Starting server without database. Some features may not work.');
    console.warn('Please ensure MongoDB is installed and running on: ' + MONGODB_URI);
    // Don't exit, allow server to start without database for development
  }
};

module.exports = { connectDB, mongoose };
