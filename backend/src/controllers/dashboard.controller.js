import { dashboardService } from '../services/dashboard.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

class DashboardController {
  async getStatistics(_req, res, next) {
    try {
      const stats = await dashboardService.getStatistics();
      return sendSuccess(res, stats, 'Dashboard statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
