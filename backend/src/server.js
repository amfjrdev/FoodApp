import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

const startServer = async () => {
  try {
    // 1. Connect to Database (MongoDB with automatic embedded memory fallback)
    await connectDatabase();

    // 2. Start HTTP Server
    const server = app.listen(env.PORT, () => {
      console.log(`
🚀 ====================================================
🍔 Food Delivery API Server running in [${env.NODE_ENV}] mode
📍 Local URL:    http://localhost:${env.PORT}
📊 Health Check: http://localhost:${env.PORT}/api/v1/health
🔐 Environment:  MongoDB NoSQL | Zero-Docker Architecture
🚀 ====================================================
      `);
    });

    // Graceful Shutdown Handlers
    const shutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
      server.close(async () => {
        console.log('🚪 HTTP server closed.');
        await disconnectDatabase();
        console.log('✅ Graceful shutdown completed.');
        process.exit(0);
      });

      // Force shutdown after 10s if hanging
      setTimeout(() => {
        console.error('⚠️ Forcing immediate termination after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    process.on('unhandledRejection', (reason, promise) => {
      console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (error) => {
      console.error('💥 Uncaught Exception thrown:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
