import { Order } from '../models/Order.js';
import { Food } from '../models/Food.js';
import { Category } from '../models/Category.js';
import { ORDER_STATUS } from '../constants/orderStatus.js';

class DashboardService {
  async getStatistics() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      pendingOrders,
      todayOrders,
      activeFoods,
      activeCategories,
      recentOrders,
      statusAggregation,
      revenueAggregation,
      todayRevenueAggregation,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: ORDER_STATUS.PENDING }),
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Food.countDocuments({ isAvailable: true }),
      Category.countDocuments({ isActive: true }),
      Order.find().sort({ createdAt: -1 }).limit(5),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { status: { $ne: ORDER_STATUS.CANCELLED } } },
        { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfToday },
            status: { $ne: ORDER_STATUS.CANCELLED },
          },
        },
        { $group: { _id: null, todayRevenue: { $sum: '$total' } } },
      ]),
    ]);

    const ordersByStatus = {
      [ORDER_STATUS.PENDING]: 0,
      [ORDER_STATUS.CONFIRMED]: 0,
      [ORDER_STATUS.PREPARING]: 0,
      [ORDER_STATUS.READY]: 0,
      [ORDER_STATUS.OUT_FOR_DELIVERY]: 0,
      [ORDER_STATUS.DELIVERED]: 0,
      [ORDER_STATUS.CANCELLED]: 0,
    };

    statusAggregation.forEach((item) => {
      if (ordersByStatus[item._id] !== undefined) {
        ordersByStatus[item._id] = item.count;
      }
    });

    const totalRevenue =
      revenueAggregation.length > 0
        ? Math.round(revenueAggregation[0].totalRevenue * 100) / 100
        : 0;

    const todayRevenue =
      todayRevenueAggregation.length > 0
        ? Math.round(todayRevenueAggregation[0].todayRevenue * 100) / 100
        : 0;

    return {
      overview: {
        totalOrders,
        pendingOrders,
        todayOrders,
        totalRevenue,
        todayRevenue,
        activeFoods,
        activeCategories,
      },
      ordersByStatus,
      recentOrders,
    };
  }
}

export const dashboardService = new DashboardService();
