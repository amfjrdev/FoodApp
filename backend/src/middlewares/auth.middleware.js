import { verifyToken } from '../utils/jwt.js';
import { UnauthorizedError } from '../errors/AppError.js';
import { Admin } from '../models/Admin.js';

export const requireAdminAuth = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError(
        'Access denied. No authentication token provided.',
        'TOKEN_MISSING'
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError(
        'Access denied. Malformed authorization header.',
        'TOKEN_INVALID'
      );
    }

    const decoded = verifyToken(token);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      throw new UnauthorizedError(
        'Admin account no longer exists.',
        'ADMIN_NOT_FOUND'
      );
    }

    req.admin = {
      id: admin.id || admin._id,
      email: admin.email,
      name: admin.name,
    };

    next();
  } catch (error) {
    next(error);
  }
};
