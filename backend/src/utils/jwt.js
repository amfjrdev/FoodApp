import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const generateToken = (payload) => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
};
