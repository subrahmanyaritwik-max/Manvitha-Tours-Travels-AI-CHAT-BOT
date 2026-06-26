const mongoose = require('mongoose');

let useFallback = true;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI || mongoURI.trim() === '') {
    console.log('ℹ️ MONGODB_URI is not set. Running in local file-based database storage mode (MongoDB connection disabled).');
    useFallback = true;
    return false;
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    console.log('✅ Connected to MongoDB successfully.');
    useFallback = false;
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('ℹ️ Falling back to local file-based database storage mode.');
    useFallback = true;
    return false;
  }
};

module.exports = {
  connectDB,
  isFallback: () => useFallback,
};

