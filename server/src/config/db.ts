import mongoose from 'mongoose';

export const connectDB = async (): Promise<boolean> => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[MongoDB] Connected successfully to ${uri}`);
    return true;
  } catch (error: any) {
    console.warn(`[MongoDB] Connection warning: Could not connect to MongoDB at ${uri}.`);
    console.warn(`[MongoDB] ${error.message}`);
    console.warn(`[MongoDB] The server will continue running using in-memory fallback data.`);
    console.warn(`[MongoDB] To persist data, ensure MongoDB is running or specify a valid MONGODB_URI in your .env file.`);
    return false;
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('[MongoDB] Connection lost');
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB] Runtime error:', err.message);
});
