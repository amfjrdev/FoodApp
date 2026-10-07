import { Router } from 'express';
import mongoose from 'mongoose';
import { sendSuccess } from '../utils/apiResponse.js';
import { env } from '../config/env.js';

const router = Router();

router.get('/', (req, res) => {
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbState = mongoose.connection.readyState;
  const isHealthy = dbState === 1;

  const healthData = {
    status: isHealthy ? 'healthy' : 'degraded',
    environment: env.NODE_ENV,
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatusMap[dbState] || 'unknown',
      connected: isHealthy,
    },
    timestamp: new Date().toISOString(),
  };

  return sendSuccess(res, healthData, 'System health check');
});

export default router;
