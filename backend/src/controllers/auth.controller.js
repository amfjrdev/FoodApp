import { authService } from '../services/auth.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async logout(_req, res, next) {
    try {
      return sendSuccess(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const profile = await authService.getAdminProfile(req.admin.id);
      return sendSuccess(res, profile, 'Admin profile fetched successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
