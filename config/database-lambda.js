const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use cached connection if available
    if (mongoose.connections[0].readyState) {
      console.log('Using existing database connection');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 1, // Maintain up to 1 socket connection for Lambda
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // Disable mongoose buffering
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    throw error;
  }
};

module.exports = connectDB;
