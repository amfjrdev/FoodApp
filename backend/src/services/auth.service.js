import { Admin } from '../models/Admin.js';
import { comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { UnauthorizedError, NotFoundError } from '../errors/AppError.js';

class AuthService {
  async login(email, password) {
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await comparePassword(password, admin.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const token = generateToken({
      id: admin.id || admin._id,
      email: admin.email,
      name: admin.name,
    });

    return {
      token,
      admin: {
        id: admin.id || admin._id,
        email: admin.email,
        name: admin.name,
        createdAt: admin.createdAt,
      },
    };
  }

  async getAdminProfile(adminId) {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw new NotFoundError('Admin account not found', 'ADMIN_NOT_FOUND');
    }

    return {
      id: admin.id || admin._id,
      email: admin.email,
      name: admin.name,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }
}

export const authService = new AuthService();
