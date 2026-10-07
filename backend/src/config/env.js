import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5001),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/foodapp_db'),
  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('*'),
  DELIVERY_FEE: z.coerce.number().default(3.99),
  FREE_DELIVERY_THRESHOLD: z.coerce.number().default(50.0),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    if (process.env.NODE_ENV === 'test') {
      return {
        NODE_ENV: 'test',
        PORT: 5001,
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodapp_test',
        JWT_ACCESS_SECRET: 'test_jwt_secret_key_minimum_32_characters_long_123',
        JWT_EXPIRES_IN: '7d',
        CORS_ORIGIN: '*',
        DELIVERY_FEE: 3.99,
        FREE_DELIVERY_THRESHOLD: 50.0,
      };
    }
    throw new Error('Invalid environment variables configuration');
  }
  return result.data;
};

export const env = parseEnv();
