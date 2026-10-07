import { orderService } from '../services/order.service.js';
import { sendSuccess, sendPaginated } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/statusCodes.js';

class OrderController {
  // Public
  async createOrder(req, res, next) {
    try {
      const order = await orderService.createOrder(req.body);
      return sendSuccess(
        res,
        order,
        'Order placed successfully',
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  async trackOrder(req, res, next) {
    try {
      const order = await orderService.getOrderByOrderNumber(req.params.orderNumber);
      return sendSuccess(res, order, 'Order tracking details retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Admin
  async getAllOrders(req, res, next) {
    try {
      const { orders, pagination } = await orderService.getOrders(req.query);
      return sendPaginated(res, orders, pagination, 'Orders retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req, res, next) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      return sendSuccess(res, order, 'Order details retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
      const order = await orderService.updateOrderStatus(
        req.params.id,
        req.body.status
      );
      return sendSuccess(res, order, `Order status updated to ${req.body.status}`);
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();
