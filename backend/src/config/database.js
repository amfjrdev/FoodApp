import mongoose from 'mongoose';
import { env } from './env.js';

let memoryServerInstance = null;

export const connectDatabase = async () => {
  try {
    mongoose.set('strictQuery', true);

    console.log(`📡 Connecting to MongoDB at ${env.MONGODB_URI}...`);
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log('✅ Connected to MongoDB server');
  } catch (error) {
    if (env.NODE_ENV !== 'production') {
      console.warn('⚠️ Local MongoDB not reachable. Starting zero-dependency embedded MongoDB engine...');
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServerInstance = await MongoMemoryServer.create();
        const memoryUri = memoryServerInstance.getUri();
        await mongoose.connect(memoryUri);
        console.log(`✅ Connected to embedded MongoDB at ${memoryUri}`);
        return;
      } catch (memError) {
        console.error('❌ Failed to start embedded MongoDB:', memError);
      }
    }
    console.error('❌ MongoDB connection error:', error.message);
    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServerInstance) {
      await memoryServerInstance.stop();
    }
    console.log('🔌 MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
  }
};
